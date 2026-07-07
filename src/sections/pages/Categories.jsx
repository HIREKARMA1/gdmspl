"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categoryData } from "@/data/projects";
import AppImage from "@/components/ui/AppImage";
import { ArrowLeft } from "lucide-react";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || (categoryData.length > 0 ? categoryData[0].name : null)
  );

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    window.scrollTo(0, 0);
  }, [categoryParam]);

  const activeCategory = useMemo(
    () => categoryData.find((cat) => cat.name === selectedCategory),
    [selectedCategory]
  );

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

        <nav className="category-tabs">
          {categoryData.map((cat) => (
            <button
              key={cat.name}
              className={`category-tab ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat.name);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        <section className="categories-list">
          {activeCategory ? (
            <div key={activeCategory.name} className="category-section">
              <div className="category-info">
                {/* <span className="category-index">VIEWING SECTOR</span> */}
                <h2 className="category-name">{activeCategory.name}</h2>
              </div>

              <div className="projects-grid">
                {activeCategory.projects.map((project, pIdx) => (
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
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects found in this category.</p>
            </div>
          )}
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
