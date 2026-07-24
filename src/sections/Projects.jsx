"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSectionScroll from "@/hooks/useSectionScroll";
import ProjectCard from "@/components/ui/ProjectCard";
import InteractiveHoverButton from "@/components/ui/InteractiveHoverButton";
import {
  fetchPublicProjects,
  normalizePublicProject,
} from "@/services/projects";

const bentoSizes = [
  "bento-hero", "bento-standard", "bento-standard", "bento-tall",
  "bento-wide", "bento-standard", "bento-standard", "bento-tall",
  "bento-wide", "bento-standard", "bento-standard", "bento-tall",
];

const LANDING_LIMIT = 12;

export default function Projects({ standalone = false }) {
  const containerRef = useRef(null);
  const router = useRouter();
  const scrollProgress = useSectionScroll(containerRef);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchPublicProjects({ page: 1, page_size: LANDING_LIMIT });
        if (cancelled) return;
        const items = (data.items || []).map(normalizePublicProject).slice(0, LANDING_LIMIT);
        setProjects(items);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = projects.map((project, index) => ({
    id: project.id,
    title: project.title,
    category: Array.isArray(project.category) ? project.category[0] || "" : project.category || "",
    image: project.image,
    size: bentoSizes[index % bentoSizes.length],
  }));

  const translateX = standalone ? 0 : scrollProgress * 76;

  return (
    <section
      id="projects"
      ref={containerRef}
      className={
        standalone
          ? "relative bg-canvas py-12"
          : "relative h-screen-280 bg-canvas max-md:h-auto"
      }
    >
      <div
        className={
          standalone
            ? "relative w-full overflow-x-auto px-6 pb-8"
            : "sticky top-0 flex h-screen w-full items-center overflow-hidden max-md:relative max-md:h-auto"
        }
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 10% 10%, rgba(99,102,241,0.05) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(236,72,153,0.05) 0%, transparent 50%)",
          }}
        />

        <div
          className={`projects-track ${standalone ? "projects-track-standalone" : ""}`}
          style={standalone ? undefined : { transform: `translateX(-${translateX}%)` }}
        >
          {loading && !displayItems.length ? (
            <div className="flex h-[35vh] min-w-[280px] items-center justify-center px-8 text-sm text-charcoal/60">
              Loading projects…
            </div>
          ) : null}

          {!loading && !displayItems.length ? (
            <div className="flex h-[35vh] min-w-[280px] items-center justify-center px-8 text-sm text-charcoal/60">
              No published projects yet.
            </div>
          ) : null}

          {displayItems.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[0.98] ${item.size}`}
            >
              <ProjectCard
                title={item.title}
                category={item.category}
                image={item.image}
                onClick={() => router.push(`/project/${item.id}`)}
              />
            </div>
          ))}

          <div className="explore-column">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-border bg-[rgba(240,240,237,0.45)] p-8 text-center shadow-sm backdrop-blur-xl transition-all duration-normal hover:-translate-y-1 hover:border-accent hover:bg-[rgba(240,240,237,0.65)] hover:shadow-md">
              <span className="mb-2 font-inter text-[10px] font-extrabold tracking-[2px] text-accent">OUR PORTFOLIO</span>
              <h3 className="mb-3 font-sans text-2xl font-extrabold leading-tight text-charcoal">Looking for more?</h3>
              <p className="mb-8 max-w-[85%] font-inter text-xs leading-relaxed text-charcoal">
                Explore our full collection of architectural masterpieces, premium interiors, and landscape designs.
              </p>
              <div onClick={() => router.push("/projects/all")}>
                <InteractiveHoverButton>EXPLORE ALL PROJECTS</InteractiveHoverButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
