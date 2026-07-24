"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppImage from "@/components/ui/AppImage";
import { ArrowLeft } from "lucide-react";
import { fetchPublicProjectCategories } from "@/services/projectCategories";
import {
  fetchPublicProjects,
  normalizePublicProject,
} from "@/services/projects";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryParam]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [cats, projectData] = await Promise.all([
          fetchPublicProjectCategories().catch(() => []),
          fetchPublicProjects({ page: 1, page_size: 100 }),
        ]);
        if (cancelled) return;

        const normalized = (projectData.items || []).map(normalizePublicProject);
        setProjects(normalized);

        let categoryNames = (cats || [])
          .map((c) => (typeof c === "string" ? c : c.name))
          .filter(Boolean);

        if (!categoryNames.length) {
          categoryNames = [
            ...new Set(normalized.flatMap((p) => p.category || [])),
          ];
        }

        setCategories(categoryNames);

        const initial =
          categoryParam && categoryNames.includes(categoryParam)
            ? categoryParam
            : categoryNames[0] || null;
        setSelectedCategory(initial);
      } catch {
        if (!cancelled) {
          setCategories([]);
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [categoryParam]);

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter((p) =>
      (p.category || []).some(
        (c) => String(c).toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [projects, selectedCategory]);

  return (
    <div className="categories-page">
      <div className="categories-header-bg" />

      <div className="container">
        <header className="page-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={18} />
            <span>BACK TO HOME</span>
          </Link>
          <h1 className="page-title">OUR PORTFOLIO BY CATEGORY</h1>
          <p className="page-subtitle">Exploring architectural excellence across diverse sectors.</p>
        </header>

        {loading ? (
          <p className="py-16 text-center text-sm text-[#666]">Loading portfolio…</p>
        ) : null}

        {!loading && categories.length > 0 ? (
          <nav className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {cat}
              </button>
            ))}
          </nav>
        ) : null}

        <section className="categories-list">
          {!loading && selectedCategory ? (
            <div key={selectedCategory} className="category-section">
              <div className="category-info">
                <h2 className="category-name">{selectedCategory}</h2>
              </div>

              <div className="projects-grid">
                {filteredProjects.map((project, pIdx) => (
                  <div key={project.id} className="category-project-card">
                    <div className="project-image-wrapper relative aspect-[4/3] w-full overflow-hidden">
                      <AppImage
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="category-project-image object-cover"
                      />
                      <div className="project-card-overlay">
                        <Link href={`/project/${project.id}`} className="view-details-btn">
                          VIEW DETAILS
                        </Link>
                      </div>
                    </div>
                    <div className="project-card-info">
                      <div className="project-card-header">
                        <span className="project-card-number">0{pIdx + 1}</span>
                        <h3 className="project-card-title">{project.title}</h3>
                      </div>
                      <p className="project-card-desc">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!filteredProjects.length ? (
                <div className="no-projects">
                  <p>No projects found in this category.</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {!loading && !categories.length ? (
            <div className="no-projects">
              <p>No published projects yet.</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="categories-page min-h-screen" />}>
      <CategoriesContent />
    </Suspense>
  );
}
