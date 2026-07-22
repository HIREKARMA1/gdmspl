"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projectData } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";
import {
  fetchPublicProjects,
  mergeStaticAndApiProjects,
  normalizePublicProject,
} from "@/services/projects";

export default function ProjectsPage() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [apiProjects, setApiProjects] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchPublicProjects({ page: 1, page_size: 100 });
        if (cancelled || !data.items?.length) return;
        setApiProjects(data.items.map(normalizePublicProject));
      } catch {
        // Keep hardcoded projects if API is unavailable
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const allProjects = useMemo(
    () => mergeStaticAndApiProjects(projectData, apiProjects),
    [apiProjects]
  );

  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 12);

  return (
    <div className="projects-page-container">
      <div className="projects-page-decor">
        <div className="decor-blob blob-1" />
        <div className="decor-blob blob-2" />
        <div className="decor-blob blob-3" />
      </div>

      <div className="container">
        <header className="projects-page-header">
          <div className="header-left">
            <button className="back-to-home-btn" onClick={() => router.back()}>
              <ArrowLeft size={18} />
              <span>BACK TO HOME</span>
            </button>
            <h1 className="page-title">
              <span className="title-bold">ALL</span>
              <span className="title-outline">PROJECTS</span>
            </h1>
          </div>
        </header>

        <section className="all-projects-grid">
          {displayedProjects.map((project) => (
            <div key={project.id} className="projects-page-item relative min-h-[280px]">
              <ProjectCard
                title={project.title}
                category=""
                image={project.image}
                onClick={() => router.push(`/project/${project.id}`)}
              />
            </div>
          ))}
        </section>

        {!showAll && allProjects.length > 12 && (
          <div className="view-more-container">
            <button className="view-more-btn" onClick={() => setShowAll(true)}>
              VIEW MORE PROJECTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
