"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projectData } from "@/data/projects";
import AppImage from "@/components/ui/AppImage";
import {
  fetchPublicProject,
  fetchPublicProjects,
  normalizePublicProject,
} from "@/services/projects";
import {
  ArrowLeft, MapPin, Calendar, Briefcase, IndianRupee, Maximize, X, ChevronLeft, ChevronRight,
} from "lucide-react";

export default function ProjectDetail({ projectId }) {
  const router = useRouter();
  const staticProject = projectData.find((p) => p.id === projectId);
  const [project, setProject] = useState(staticProject || null);
  const [loading, setLoading] = useState(!staticProject);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  useEffect(() => {
    const fromStatic = projectData.find((p) => p.id === projectId);
    if (fromStatic) {
      setProject(fromStatic);
      setLoading(false);
      setNotFound(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setProject(null);

    async function load() {
      try {
        const data = await fetchPublicProject(projectId);
        if (cancelled) return;
        setProject(normalizePublicProject(data));
      } catch {
        try {
          const list = await fetchPublicProjects({ page: 1, page_size: 100 });
          if (cancelled) return;
          const match = (list.items || []).find(
            (p) => p.slug === projectId || String(p.id) === projectId
          );
          if (match) {
            setProject(normalizePublicProject(match));
          } else {
            setNotFound(true);
          }
        } catch {
          if (!cancelled) setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="not-found flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-sm text-[#666]">Loading project…</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="not-found flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <h2>Project Not Found</h2>
        <Link href="/projects" className="text-accent underline">Back to Portfolio</Link>
      </div>
    );
  }

  const gallery = project.gallery?.length ? project.gallery : project.image ? [project.image] : [];

  const showNextImage = (e) => {
    e.stopPropagation();
    if (!gallery.length) return;
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    if (!gallery.length) return;
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="project-detail-page">
      <div className="detail-hero">
        <AppImage
          src={project.image}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <div onClick={() => router.back()} className="detail-back-link" style={{ cursor: "pointer" }}>
            <ArrowLeft size={20} />
            <span>BACK</span>
          </div>
          <div>
            <div className="detail-header-top">
              <div className="detail-tags">
                {(project.scope || "")
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span key={i} className="detail-tag">{tag}</span>
                  ))}
              </div>
            </div>
            <h1 className="detail-title" title={project.title}>{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="container detail-main-content">
        <div className="detail-grid">
          <div className="detail-info-panel">
            <h2 className="section-label">PROJECT OVERVIEW</h2>
            <p className="detail-long-desc">{project.details}</p>

            <div className="detail-specs">
              {[
                { icon: Briefcase, label: "Client", value: project.client },
                { icon: Maximize, label: "Area", value: project.area },
                { icon: IndianRupee, label: "Project Cost", value: project.cost },
                { icon: MapPin, label: "Location", value: project.location || "N/A" },
                { icon: Calendar, label: "Status", value: project.status },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="spec-item">
                  <Icon size={18} />
                  <div>
                    <span className="spec-label">{label}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-gallery-column">
            <h2 className="section-label">PROJECT GALLERY</h2>
            <div className="detail-gallery-grid">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="gallery-item"
                  onClick={() => setLightboxIndex(idx)}
                  style={{ cursor: "pointer" }}
                >
                  <AppImage
                    src={img}
                    alt={`${project.title} gallery ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="gallery-image"
                  />
                  <div className="gallery-item-hover">
                    <Maximize size={20} color="white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && gallery.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close lightbox">
            <X size={28} />
          </button>
          <button className="lightbox-prev" onClick={showPrevImage} aria-label="Previous image">
            <ChevronLeft size={36} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <AppImage
              src={gallery[lightboxIndex]}
              alt={`${project.title} gallery full ${lightboxIndex + 1}`}
              width={1400}
              height={900}
              className="lightbox-img !h-auto !max-h-[75vh] !w-auto !max-w-full object-contain"
            />
            <span className="lightbox-counter">{lightboxIndex + 1} / {gallery.length}</span>
          </div>
          <button className="lightbox-next" onClick={showNextImage} aria-label="Next image">
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}
