"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import {
  fetchPublicProjects,
  normalizePublicProject,
} from "@/services/projects";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPublicProjects({ page: 1, page_size: 100 });
        if (cancelled) return;
        setProjects((data.items || []).map(normalizePublicProject));
      } catch {
        if (!cancelled) {
          setProjects([]);
          setError("Unable to load projects. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {loading ? (
          <p className="py-16 text-center text-sm text-[#666]">Loading projects…</p>
        ) : null}

        {error ? (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#666]">No published projects yet.</p>
        ) : null}

        <section className="all-projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="projects-page-item relative min-h-[280px]">
              <ProjectCard
                title={project.title}
                category={
                  Array.isArray(project.category)
                    ? project.category[0] || ""
                    : project.category || ""
                }
                image={project.image}
                onClick={() => router.push(`/project/${project.id}`)}
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
