"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Upload, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import heroImg from "@/assets/updateImages/Team Discussion.png";
import AppImage from "@/components/ui/AppImage";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { fetchPublicJobOpenings, submitJobApplication } from "@/services/jobOpenings";

const CAREER_CATEGORIES = [
  {
    id: "arch",
    name: "Architects",
    icon: "🏛️",
    count: 3,
    description: "Shaping the skyline with visionary concepts.",
  },
  {
    id: "eng",
    name: "PMC Roles (Project Management)",
    icon: "🏗️",
    count: 2,
    description: "Ensuring seamless project execution, coordination, and delivery.",
  },
  {
    id: "site",
    name: "Administration",
    icon: "💼",
    count: 4,
    description: "Managing studio operations, finance, and human resources.",
  },
  {
    id: "design",
    name: "Interior Designers",
    icon: "🛋️",
    count: 1,
    description: "Crafting the intimate human experience.",
  },
];

export default function Careers({ embedded = false }) {
  const router = useRouter();
  const categoriesRef = useRef(null);
  const [activeJob, setActiveJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applyForm, setApplyForm] = useState({
    full_name: "",
    email: "",
    portfolio_url: "",
    message: "",
    resume: null,
  });
  const [resumeName, setResumeName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPublicJobOpenings();
        if (!cancelled) setJobs(data.items);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Unable to load current openings. Please try again later."));
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

  useEffect(() => {
    if (!embedded) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = categoriesRef.current?.querySelectorAll(".category-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [embedded]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
    setApplyError("");
    setApplySuccess("");
    setApplyForm({
      full_name: "",
      email: "",
      portfolio_url: "",
      message: "",
      resume: null,
    });
    setResumeName("");
  };

  const closeApplyForm = () => {
    if (submitting) return;
    setShowApplyForm(false);
    setSelectedJob(null);
    setApplyError("");
    setApplySuccess("");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setApplyError("Resume must be a PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setApplyError("Resume must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    setApplyError("");
    setApplyForm((prev) => ({ ...prev, resume: file }));
    setResumeName(file.name);
  };

  const resetApplyForm = () => {
    setApplyForm({
      full_name: "",
      email: "",
      portfolio_url: "",
      message: "",
      resume: null,
    });
    setResumeName("");
    const input = document.getElementById("resume-upload");
    if (input) input.value = "";
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob?.id) return;
    if (!applyForm.resume) {
      setApplyError("Please upload your resume (PDF).");
      return;
    }
    if (applyForm.resume.size > 5 * 1024 * 1024) {
      setApplyError("Resume must be 5MB or smaller.");
      return;
    }

    setSubmitting(true);
    setApplyError("");
    setApplySuccess("");

    try {
      const body = new FormData();
      body.append("job_opening_id", selectedJob.id);
      body.append("full_name", applyForm.full_name.trim());
      body.append("email", applyForm.email.trim().toLowerCase());
      body.append("resume", applyForm.resume);
      if (applyForm.portfolio_url.trim()) {
        body.append("portfolio_url", applyForm.portfolio_url.trim());
      }
      if (applyForm.message.trim()) {
        body.append("message", applyForm.message.trim());
      }

      const result = await submitJobApplication(body);
      setApplySuccess(result.message || "Application submitted successfully");
      resetApplyForm();
      setTimeout(() => {
        setShowApplyForm(false);
        setSelectedJob(null);
        setApplySuccess("");
      }, 1600);
    } catch (err) {
      setApplyError(getApiErrorMessage(err, "Failed to submit application."));
    } finally {
      setSubmitting(false);
    }
  };

  const bgImage =
    typeof heroImg === "object" && heroImg?.src ? heroImg.src : heroImg;

  return (
    <div className={`careers-page ${embedded ? "careers-embedded" : ""}`} id="career">
      {!embedded && (
        <section className="careers-hero">
          <AppImage src={heroImg} alt="GDMSPL Team" fill sizes="100vw" className="hero-bg object-cover" />
          <div className="hero-content">
            <h1>Careers</h1>
            <p>Join a collective of visionaries redefining the architectural landscape.</p>
          </div>
        </section>
      )}

      {embedded ? (
        <section className="careers-categories" ref={categoriesRef}>
          <div
            className="categories-bg"
            style={{ backgroundImage: `url("${bgImage}")` }}
          />
          <div className="categories-overlay" />
          <div className="categories-content">
            <div className="section-header">
              <h2 className="section-title">Evolving Together</h2>
              <p className="section-subtitle">
                Discover where your expertise fits within our multidisciplinary studio.
              </p>
            </div>
            <div className="categories-grid">
              {CAREER_CATEGORIES.map((cat, index) => (
                <button
                  key={cat.id}
                  type="button"
                  className="category-card"
                  style={{ "--delay": `${index * 0.12}s` }}
                  onClick={() => router.push("/careers")}
                >
                  <span className="category-icon" aria-hidden>
                    {cat.icon}
                  </span>
                  <h3>{cat.name}</h3>
                  <p className="cat-desc">{cat.description}</p>
                  <div className="cat-footer">
                    <span className="open-roles">
                      {cat.count} Open Role{cat.count === 1 ? "" : "s"}
                    </span>
                    <ArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="jobs-section">
        <div className="jobs-container">
          <div className="section-header">
            <h2 className="section-title">Current Openings</h2>
            <div className="filter-hint">
              {loading ? "Loading openings…" : `Showing ${jobs.length} role${jobs.length === 1 ? "" : "s"} across all locations`}
            </div>
          </div>

          {error ? (
            <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          {loading ? (
            <p className="py-12 text-center text-sm text-[#666]">Loading current openings…</p>
          ) : null}

          {!loading && !error && jobs.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#666]">No openings at the moment. Please check back soon.</p>
          ) : null}

          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className={`job-item ${activeJob === job.id ? "active" : ""}`}>
                <div
                  className="job-header"
                  onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                >
                  <div className="job-title-group">
                    <div className="job-cat-tag">{job.category?.name || "General"}</div>
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="meta-item">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="meta-item">
                        <Clock size={14} /> {job.employment_type}
                      </span>
                      <span className="meta-item">
                        <Briefcase size={14} /> {job.experience}
                      </span>
                    </div>
                  </div>
                  <span className="toggle-icon">
                    {activeJob === job.id ? (
                      <Minus size={20} strokeWidth={1.5} />
                    ) : (
                      <Plus size={20} strokeWidth={1.5} />
                    )}
                  </span>
                </div>

                <div className="job-details">
                  <div className="job-description">
                    <p className="intro-text">{job.description?.intro}</p>

                    <div className="details-grid">
                      <div className="details-col">
                        <h4>Key Responsibilities</h4>
                        <ul>
                          {(job.description?.responsibilities || []).map((res, i) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="details-col">
                        <h4>Requirements</h4>
                        <ul>
                          {(job.description?.requirements || []).map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="apply-btn" onClick={() => handleApplyClick(job)}>
                      Apply for this position
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showApplyForm && selectedJob ? (
        <div className="modal-overlay">
          <div className="application-form-container">
            <button className="close-modal" onClick={closeApplyForm} type="button">
              ×
            </button>
            <div className="application-form">
              <div className="form-header">
                <h2>Join the Team</h2>
                <p>
                  Applying for: <strong>{selectedJob.title}</strong>
                </p>
              </div>

              <form onSubmit={handleApplySubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={applyForm.full_name}
                      onChange={(e) => setApplyForm((p) => ({ ...p, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Portfolio Link / Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={applyForm.portfolio_url}
                    onChange={(e) => setApplyForm((p) => ({ ...p, portfolio_url: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Upload Resume (PDF)</label>
                  <div
                    className="file-upload-wrapper"
                    onClick={() => document.getElementById("resume-upload")?.click()}
                  >
                    <Upload size={24} />
                    <span>{resumeName || "Click to upload or drag and drop"}</span>
                    <p className="file-hint">PDF format only, max 5MB</p>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf,application/pdf"
                      id="resume-upload"
                      onChange={handleResumeChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Why do you want to join GDMSPL?</label>
                  <textarea
                    rows="4"
                    placeholder="Briefly describe your vision and how you can contribute to our design philosophy..."
                    value={applyForm.message}
                    onChange={(e) => setApplyForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>

                {applyError ? (
                  <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {applyError}
                  </p>
                ) : null}
                {applySuccess ? (
                  <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {applySuccess}
                  </p>
                ) : null}

                <div className="form-footer">
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                  <p className="privacy-note">By clicking submit, you agree to our recruitment privacy policy.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
