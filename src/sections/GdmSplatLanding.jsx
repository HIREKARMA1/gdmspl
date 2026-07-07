"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import useSectionScroll from "@/hooks/useSectionScroll";
import AppImage from "@/components/ui/AppImage";
import logoImg from "@/assets/GDMS_logo.png";
import pkb from "@/assets/04 PKB/04_01.png";
import bps from "@/assets/03 BPS/03_01.png";
import jm from "@/assets/07 jamshedpur mall/07_01.png";
import ja from "@/assets/08 JODHPUR AIRPORT/08_01.png";
import pgi from "@/assets/11_PGIMER/11_01.png";
import epfo from "@/assets/updateImages/01_01.png";
import cup from "@/assets/05 CUP BHATINDA/05_02.jpg";
import taj from "@/assets/15_TAJ SAFARIS/15_01.png";
import laks from "@/assets/12_LAKSHDWEEP/12_02.png";

const bgImages = [pkb, bps, jm, ja, pgi, epfo, cup, taj, laks];

const W_c = 140;
const H_c = 96;

const DEFAULT_NAV = { top: 20, left: 52, width: 70, height: 48 };

/** SSR-safe defaults — never read window during initial render */
const INITIAL_LAYOUT = { centerY: 0, centerX: 0, ...DEFAULT_NAV };

function measureLayoutFromDom(navEl) {
  const next = {
    centerY: window.innerHeight / 2 - 48,
    centerX: window.innerWidth / 2 - 70,
    ...DEFAULT_NAV,
  };

  if (navEl) {
    const rect = navEl.getBoundingClientRect();
    next.top = rect.top;
    next.left = rect.left;
    next.width = rect.width;
    next.height = rect.height;
  }

  return next;
}

export default function GdmSplatLanding() {
  const containerRef = useRef(null);
  const navLogoRef = useRef(null);
  const scrollProgress = useSectionScroll(containerRef);
  const [currentBg, setCurrentBg] = useState(0);
  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  const measureLayout = useCallback(() => {
    setLayout(measureLayoutFromDom(navLogoRef.current));
  }, []);

  useLayoutEffect(() => {
    measureLayout();
    requestAnimationFrame(measureLayout);
  }, [measureLayout]);

  useEffect(() => {
    window.addEventListener("resize", measureLayout);
    return () => window.removeEventListener("resize", measureLayout);
  }, [measureLayout]);

  useEffect(() => {
    if (scrollProgress >= 0.25) {
      measureLayout();
    }
  }, [scrollProgress, measureLayout]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const { centerY: Y_c, centerX: X_c, top: Y_s, left: X_s, width: W_s, height: H_s } = layout;

  let blockerOpacity = 0.55;
  let logoScale = 4;
  let logoOpacity = 0.85;
  let logoTop = Y_c, logoLeft = X_c, logoWidth = W_c, logoHeight = H_c;
  let sideElementsOpacity = 0;
  let textOpacity = 0, textTranslateY = 200, textBlur = 15, textScale = 0.9, textRotateX = 20;

  if (scrollProgress <= 0.3) {
    const factor = scrollProgress / 0.3;
    blockerOpacity = 0.55 - factor * 0.55;
    logoScale = 4 - factor * 3;
    logoOpacity = 0.85 + factor * 0.15;
    logoTop = Y_c;
    logoLeft = X_c;
    logoWidth = W_c;
    logoHeight = H_c;
    sideElementsOpacity = 0;
  } else if (scrollProgress <= 0.5) {
    const factor = (scrollProgress - 0.3) / 0.2;
    blockerOpacity = 0;
    logoScale = 1;
    logoOpacity = 1;
    logoTop = Y_c + factor * (Y_s - Y_c);
    logoLeft = X_c + factor * (X_s - X_c);
    logoWidth = W_c + factor * (W_s - W_c);
    logoHeight = H_c + factor * (H_s - H_c);
  } else {
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
      const factor = (scrollProgress - 0.5) / 0.25;
      textOpacity = factor;
      textTranslateY = 200 - factor * 200;
      textBlur = 15 - factor * 15;
      textScale = 0.9 + factor * 0.1;
      textRotateX = 20 - factor * 20;
    } else if (scrollProgress <= stableEnd) {
      textOpacity = 1;
      textTranslateY = 0;
      textBlur = 0;
      textScale = 1;
      textRotateX = 0;
    } else {
      const factor = (scrollProgress - stableEnd) / 0.1;
      textOpacity = 1 - factor;
      textTranslateY = -(factor * 50);
      textBlur = factor * 4;
      textScale = 1 + factor * 0.05;
    }
  }

  return (
    <div ref={containerRef} className="relative z-[1] h-screen-300 w-full overflow-visible bg-[#f2f2f0] text-charcoal">
      <section
        className="pointer-events-none absolute inset-0 z-[500] bg-[#f2f2f0]"
        style={{ opacity: blockerOpacity }}
      />

      <section className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f2f2f0]">
        <div className="absolute inset-0 -z-10">
          {bgImages.map((src, index) => (
            <AppImage
              key={index}
              src={src}
              alt={`Project ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="transition-opacity duration-[1500ms] ease-in-out"
              style={{ opacity: currentBg === index ? 1 : 0 }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <div
          className="pointer-events-none absolute z-[600] will-change-[transform,top,left,width,height,opacity]"
          suppressHydrationWarning
          style={{
            top: logoTop,
            left: logoLeft,
            width: logoWidth,
            height: logoHeight,
            transform: `scale(${logoScale})`,
            transformOrigin: "50% 46%",
            opacity: logoOpacity,
          }}
        >
          <AppImage
            src={logoImg}
            alt="GDMSPL Logo"
            fill
            className="object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Hidden navbar slot — mirrors original header for logo fly-in target */}
        <header
          className="absolute inset-x-0 top-0 z-[100] flex h-[90px] items-center justify-between px-[52px]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={navLogoRef}
            src={typeof logoImg === "string" ? logoImg : logoImg.src}
            alt=""
            className="block h-12 w-[70px] shrink-0 object-contain opacity-0"
          />
          <nav className="flex gap-11 opacity-0">
            {["about", "services", "projects", "contact"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleScrollTo(e, id)}
                className="nav-anchor relative text-sm font-medium tracking-[1.2px] text-charcoal no-underline"
              >
                {id.toUpperCase()}
              </a>
            ))}
          </nav>
        </header>

        <div
          className="container-fluid relative z-10 flex w-full max-w-full items-center justify-center overflow-visible text-center will-change-[transform,opacity,filter]"
          style={{
            transform: `translateY(${textTranslateY}px) scale(${textScale}) rotateX(${textRotateX}deg)`,
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex w-full max-w-full flex-col items-center gap-2 overflow-visible text-center">
            <h1 className="aurora-text m-0 inline-block w-fit max-w-none overflow-visible whitespace-nowrap text-center text-[clamp(2.5rem,9.5vw,8.5rem)] font-light uppercase leading-[1.1] tracking-[0.05em]">
              Geometric
            </h1>
            <div className="w-full max-w-full">
              <p className="m-0 mt-[1.5vw] max-w-full whitespace-nowrap text-center text-[clamp(0.7rem,1.85vw,1.65rem)] font-normal uppercase leading-[1.35] tracking-[clamp(0.06em,0.12vw,0.16em)] text-white/90 [text-shadow:0_4px_10px_rgba(0,0,0,0.6)] max-md:whitespace-normal">
                Design Management Services Pvt Ltd
              </p>
            </div>
          </div>
        </div>

        <footer
          className="absolute bottom-[26px] left-[60px] z-20 flex gap-7 text-[11px] text-[#888]"
          style={{ opacity: sideElementsOpacity }}
        >
          <span>Architecture Studio</span>
          <span>Premium Design Practice</span>
          <span>Est. 2008</span>
        </footer>
      </section>
    </div>
  );
}
