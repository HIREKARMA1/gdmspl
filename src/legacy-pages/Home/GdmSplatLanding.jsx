import React, { useRef, useState, useEffect } from 'react';
import useSectionScroll from '../../hooks/useSectionScroll';

// Import local image assets — using exact project cover images from projects.js
import logoImg from '../../assets/GDMS_logo.png';


// Import original hero styles
import './Hero.css';

export default function GdmSplatLanding() {
  const containerRef = useRef(null);
  const navLogoRef = useRef(null);
  const scrollProgress = useSectionScroll(containerRef);



  // Smooth scroll handler
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Screen center coordinates for logo zoom state
  const Y_c = typeof window !== 'undefined' ? window.innerHeight / 2 - 48 : "calc(50vh - 48px)";
  const X_c = typeof window !== 'undefined' ? window.innerWidth / 2 - 70 : "calc(50vw - 70px)";
  const W_c = 140;
  const H_c = 96;

  // Navbar slot coordinates (fallback defaults)
  let Y_s = 20;
  let X_s = 52;
  let W_s = 70;
  let H_s = 48;

  if (navLogoRef.current) {
    const rect = navLogoRef.current.getBoundingClientRect();
    Y_s = rect.top;
    X_s = rect.left;
    W_s = rect.width;
    H_s = rect.height;
  }

  // ── ALL animation values driven purely by scrollProgress (0 → 1) ──

  let blockerOpacity = 0.7;  // Semi-transparent so background image shows through faintly at load
  let logoScale = 4;        // Start at 4x — large enough to be cinematic, small enough to be recognizable
  let logoOpacity = 0.2;    // Faded watermark initially
  let logoTop = Y_c;
  let logoLeft = X_c;
  let logoWidth = W_c;
  let logoHeight = H_c;
  let sideElementsOpacity = 0;

  let textOpacity = 0;
  let textTranslateY = 200;
  let textBlur = 15;
  let textScale = 0.9;
  let textRotateX = 20;

  // Phase 1: Logo zoom-out & Blocker fade (progress 0 → 0.3)
  //   Blocker fades from 0.7 → 0, background image revealed; logo zooms 4x → 1x and becomes fully opaque
  if (scrollProgress <= 0.3) {
    const factor = scrollProgress / 0.3; // 0 → 1
    blockerOpacity = 0.7 - (factor * 0.7); // 0.7 → 0
    logoScale = 4 - (factor * 3);          // 4 → 1
    logoOpacity = 0.2 + (factor * 0.8);    // 0.2 → 1
    logoTop = Y_c;
    logoLeft = X_c;
    logoWidth = W_c;
    logoHeight = H_c;
    sideElementsOpacity = 0;
  }
  // Phase 2: Logo fly-in to navbar slot (progress 0.3 → 0.5)
  else if (scrollProgress <= 0.5) {
    const factor = (scrollProgress - 0.3) / 0.2; // 0 → 1
    blockerOpacity = 0;
    logoScale = 1;
    logoOpacity = 1;
    const currentY_c = typeof Y_c === "number" ? Y_c : 0;
    const currentX_c = typeof X_c === "number" ? X_c : 0;
    logoTop = currentY_c + factor * (Y_s - currentY_c);
    logoLeft = currentX_c + factor * (X_s - currentX_c);
    logoWidth = W_c + factor * (W_s - W_c);
    logoHeight = H_c + factor * (H_s - H_c);
    sideElementsOpacity = factor;
  }
  // Phase 3: Logo settled, branding text reveal (progress 0.5 → 1.0)
  else {
    blockerOpacity = 0;
    logoScale = 1;
    logoOpacity = 1;
    logoTop = Y_s;
    logoLeft = X_s;
    logoWidth = W_s;
    logoHeight = H_s;
    sideElementsOpacity = 1;

    const revealEnd = 0.75;
    const stableEnd = 0.9;

    if (scrollProgress <= revealEnd) {
      // Rise & Reveal (progress 0.5 → 0.75)
      const factor = (scrollProgress - 0.5) / 0.25;
      textOpacity = factor;
      textTranslateY = 200 - (factor * 200);
      textBlur = 15 - (factor * 15);
      textScale = 0.9 + (factor * 0.1);
      textRotateX = 20 - (factor * 20);
    } else if (scrollProgress <= stableEnd) {
      // Stable center (progress 0.75 → 0.9)
      textOpacity = 1;
      textTranslateY = 0;
      textBlur = 0;
      textScale = 1;
      textRotateX = 0;
    } else {
      // Fade out (progress 0.9 → 1.0)
      const factor = (scrollProgress - stableEnd) / 0.1;
      textOpacity = 1 - factor;
      textTranslateY = -(factor * 50);
      textBlur = factor * 4;
      textScale = 1 + (factor * 0.05);
      textRotateX = 0;
    }
  }

  const containerStyle = {
    ...styles.bodyOverride,
    position: "relative",
    height: "300vh",
    width: "100%",
    overflow: "visible",
    zIndex: 1
  };

  const mainSiteStyle = {
    ...styles.mainSite,
    position: "sticky",
    top: 0,
    height: "100vh",
    width: "100%",
    overflow: "hidden"
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* CREAM BLOCKER OVERLAY — fades out as user scrolls */}
      <section style={{ ...styles.intro, opacity: blockerOpacity }}></section>

      {/* MAIN SITE */}
      <section style={mainSiteStyle}>
        {/* ROTATING PROJECT BACKGROUND — video revealed as blocker fades */}
        <div className="hero-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://gdmspl.s3.us-east-1.amazonaws.com/Landing+page+new+vidoe+(Updated).mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
        </div>

        {/* SCROLL-DRIVEN LOGO — visible as a faded watermark at load, zooms out & flies to navbar on scroll */}
        <div
          className="scroll-logo-wrapper"
          style={{
            position: "absolute",
            top: logoTop,
            left: logoLeft,
            width: logoWidth,
            height: logoHeight,
            transform: `scale(${logoScale})`,
            transformOrigin: "50% 46%",
            opacity: logoOpacity,
            zIndex: 600,
            pointerEvents: "none",
            willChange: 'transform, top, left, width, height, opacity'
          }}
        >
          <img src={logoImg} alt="GDMSPL Logo" style={styles.introLogo} />
        </div>

        {/* Hidden navbar slot (used purely for measuring destination coordinates) */}
        <header style={styles.header}>
          <img ref={navLogoRef} src={logoImg} alt="GDMSPL Logo" style={styles.navLogo} />
          <nav style={styles.nav}>
            <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="nav-anchor" style={styles.navAnchor}>ABOUT</a>
            <a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="nav-anchor" style={styles.navAnchor}>SERVICES</a>
            <a href="#projects" onClick={(e) => handleScrollTo(e, 'projects')} className="nav-anchor" style={styles.navAnchor}>PROJECTS</a>
            <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="nav-anchor" style={styles.navAnchor}>CONTACT US</a>
          </nav>
        </header>

        {/* CENTERED SCROLLING BRANDING TEXT */}
        <div
          className="container-fluid hero-content"
          style={{
            transform: `translateY(${textTranslateY}px) scale(${textScale}) rotateX(${textRotateX}deg)`,
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`
          }}
        >
          <div className="branding-container">
            <h1 className="brand-primary aurora-text">
              Geometric
            </h1>
            <div className="brand-secondary-well">
              <p className="brand-secondary">
                Design Management Services Pvt Ltd
              </p>
            </div>
          </div>
        </div>




        <footer className="footer-el" style={{ ...styles.footer, opacity: sideElementsOpacity }}>
          <span>Architecture Studio</span>
          <span>Premium Design Practice</span>
          <span>Est. 2008</span>
        </footer>
      </section>

      <style>{`
        .nav-anchor::after {
          content: "";
          position: absolute;
          left: 0; bottom: -5px;
          width: 0%; height: 1px;
          background: #111;
          transition: width .35s ease;
        }
        .nav-anchor:hover::after { width: 100%; }
      `}</style>
    </div>
  );
}

const styles = {
  bodyOverride: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f2f2f0",
    color: "#111",
    margin: 0,
    padding: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden"
  },
  intro: {
    position: "absolute",
    inset: 0,
    background: "#f2f2f0",
    zIndex: 500,
    pointerEvents: "none"
  },
  introLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block"
  },
  mainSite: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    background: "#f2f2f0",
    zIndex: 1
  },
  header: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "90px",
    padding: "0 52px",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  navLogo: {
    width: "70px",
    height: "48px",
    objectFit: "contain",
    display: "block",
    opacity: 0,
    flexShrink: 0
  },
  nav: {
    display: "flex",
    gap: "44px",
    opacity: 0
  },
  navAnchor: {
    textDecoration: "none",
    color: "#111",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "1.2px",
    position: "relative"
  },
  verticalText: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%) rotate(180deg)",
    writingMode: "vertical-rl",
    fontSize: "13px",
    letterSpacing: "4px",
    fontWeight: 400,
    color: "#444",
    zIndex: 20
  },
  footer: {
    position: "absolute",
    left: "60px",
    bottom: "26px",
    display: "flex",
    gap: "28px",
    fontSize: "11px",
    color: "#888",
    zIndex: 20
  }
};
