"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export default function GdmSplatLanding() {
  const containerRef = useRef(null);
  const blockerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to(blockerRef.current, {
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
      });

      gsap.fromTo(
        textRef.current,
        { scale: 1, y: 0, opacity: 1 },
        {
          scale: 0.72,
          y: -160,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-[1] h-screen-300 w-full overflow-visible bg-[#f2f2f0] text-charcoal">
      <section
        ref={blockerRef}
        className="pointer-events-none absolute inset-0 z-[500] bg-[#f2f2f0]"
        style={{ opacity: 0.55 }}
      />

      <section className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f2f2f0]">
        <div className="absolute inset-0 -z-10">
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
          <div className="hero-overlay" />
        </div>

        <div
          ref={textRef}
          className="container-fluid relative z-[600] flex w-full max-w-full items-center justify-center overflow-visible text-center will-change-transform"
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
      </section>
    </div>
  );
}
