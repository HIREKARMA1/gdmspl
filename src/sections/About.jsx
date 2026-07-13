"use client";

import { useEffect, useRef } from "react";
import aboutImg from "@/assets/About.png";
import AppImage from "@/components/ui/AppImage";
import { TextAnimate } from "@/components/ui/TextAnimate";
import { OFFICE_LOCATIONS, navigateToContactLocation } from "@/data/locations";
import { gsap, registerGsap } from "@/lib/gsap";

export default function About() {
  const locationsRef = useRef(null);

  useEffect(() => {
    registerGsap();
    const el = locationsRef.current;
    if (!el) return;

    const tags = el.querySelectorAll(".location-tag");
    gsap.fromTo(
      tags,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
  }, []);

  return (
    <section id="about" className="relative z-10 bg-[#fcfcfc] py-32 text-charcoal">
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="mb-20">
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-tight tracking-tight">
            Designing with clarity.
            <br />
            <span className="mt-2 block text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold text-muted">
              Building with purpose.
            </span>
          </h2>
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-[450px_1fr]">
          <div className="relative overflow-hidden rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
            <AppImage
              src={aboutImg}
              alt="About Geometric Design"
              width={900}
              height={600}
              className="block h-auto w-full rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="flex flex-col gap-12">
            <div className="text-lg leading-relaxed text-charcoal">
              <TextAnimate animation="blurInUp" by="word" once className="mb-6 text-xl font-semibold text-charcoal">
                Geometric Design is a versatile architectural and allied works' service provider with its
                head office based in New Delhi, and a team of professional designers with the best
                expertise in the field.
              </TextAnimate>
              <p>
                We deal with architectural, urban design, interiors, landscape design, building
                information modelling and project management services including engineering
                services for structural, electrical, plumbing, HVAC, Public Health engineering
                and Automation systems.
              </p>
            </div>

            <div>
              <TextAnimate animation="fadeIn" by="word" className="mb-6 text-[0.8rem] font-bold uppercase tracking-[2px] text-[#999]">
                Our Presence
              </TextAnimate>
              <div ref={locationsRef} className="flex flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
                {OFFICE_LOCATIONS.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => navigateToContactLocation(location)}
                    className="location-tag flex cursor-pointer items-center gap-3 rounded-full border border-accent/50 bg-[#f4f4f4] px-5 py-3 text-left text-sm font-medium text-[#444] transition-colors hover:border-accent hover:bg-white"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
