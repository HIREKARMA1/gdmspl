import { useRef } from 'react';
import useSectionScroll from '../../hooks/useSectionScroll';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const scrollProgress = useSectionScroll(heroRef);

  // Advanced Cinematic Reveal Logic
  // Mapped to the LOCAL scroll of this specific section (0 to 1)

  // Appear phase: 0 to 0.4
  // Stable phase: 0.4 to 0.7
  // Fade phase: 0.7 to 1.0
  const revealEnd = 0.4;
  const stableEnd = 0.7;

  let opacity = 0;
  let translateY = 100;
  let blur = 15;
  let scale = 0.9;
  let rotateX = 20;

  if (scrollProgress <= revealEnd) {
    // Reveal & Rise
    const factor = scrollProgress / revealEnd;
    opacity = factor;
    translateY = 100 - (factor * 100);
    blur = 15 - (factor * 15);
    scale = 0.9 + (factor * 0.1);
    rotateX = 20 - (factor * 20);
  } else if (scrollProgress > revealEnd && scrollProgress <= stableEnd) {
    // Sharp & Stable
    opacity = 1;
    translateY = 0;
    blur = 0;
    scale = 1;
    rotateX = 0;
  } else {
    // Fade Out & Continue Rise
    const factor = (scrollProgress - stableEnd) / (1 - stableEnd);
    opacity = 1 - factor;
    translateY = -(factor * 50);
    blur = factor * 4;
    scale = 1 + (factor * 0.05);
  }

  return (
    <section className="hero-scroll-container" ref={heroRef}>
      <div className="hero-sticky-inner">
        <div className="hero-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://gdmspl.s3.us-east-1.amazonaws.com/Landing_Page_Video_after_effects_2.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div
          className="container-fluid hero-content"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
            opacity: opacity,
            filter: `blur(${blur}px)`
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
      </div>
    </section>
  );
};

export default Hero;
