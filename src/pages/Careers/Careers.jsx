import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Upload, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import './Careers.css';
import heroImg from '../../assets/careers_hero_action_1776496311897.png';

const Careers = ({ embedded = false }) => {
  const [activeJob, setActiveJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const categories = [
    { id: 'arch', name: 'Architects', icon: '🏛️', count: 3, description: 'Shaping the skyline with visionary concepts.' },
    { id: 'eng', name: 'PMC Roles (Project Management)', icon: '🏗️', count: 2, description: 'Ensuring seamless project execution, coordination, and delivery.' },
    { id: 'site', name: 'Administration', icon: '💼', count: 4, description: 'Managing studio operations, finance, and human resources.' },
    { id: 'design', name: 'Interior Designers', icon: '🛋️', count: 1, description: 'Crafting the intimate human experience.' }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Project Architect',
      category: 'arch',
      location: 'New Delhi',
      type: 'Full-time',
      experience: '10+ Years',
      description: {
        intro: "We're looking for a visionary Lead Architect to guide our high-profile commercial and residential projects from concept to completion.",
        responsibilities: [
          "Oversee project development from initial conceptual sketches to site supervision.",
          "Lead a team of junior and mid-level architects.",
          "Coordinate with structural and technical consultants.",
          "Ensure designs align with GDMSPL's minimalist and sustainable aesthetic."
        ],
        requirements: [
          "10+ years of experience in architectural design.",
          "Proficiency in Revit, Rhino, and AutoCAD.",
          "Strong portfolio of executed commercial projects.",
          "Excellent communication and leadership skills."
        ]
      }
    },
    {
      id: 2,
      title: 'Project Manager (PMC)',
      category: 'eng',
      location: 'Remote / Mumbai',
      type: 'Contract',
      experience: '5+ Years',
      description: {
        intro: "Join our PMC team to lead project coordination, scheduling, and site delivery operations.",
        responsibilities: [
          "Coordinate between clients, design architects, and on-site contractors.",
          "Oversee project schedules, budgets, and quality control guidelines.",
          "Ensure site execution complies with design specifications and timelines."
        ],
        requirements: [
          "Degree in Construction Management or Civil Engineering.",
          "5+ years of experience in managing high-end building projects.",
          "Strong leadership and communication skills."
        ]
      }
    },
    {
      id: 3,
      title: 'Studio Administrator',
      category: 'site',
      location: 'New Delhi',
      type: 'Full-time',
      experience: '3+ Years',
      description: {
        intro: "Manage daily studio operations, administrative tasks, and client coordination at our headquarters.",
        responsibilities: [
          "Oversee daily studio operations, logistics, and supply management.",
          "Assist in client billing, coordination, and meeting scheduling.",
          "Manage studio documentation, human resources, and vendor relations."
        ],
        requirements: [
          "Degree in Business Administration or related field.",
          "3+ years of experience in office administration or studio operations.",
          "Proficiency in office software and excellent organizational skills."
        ]
      }
    },
    {
      id: 4,
      title: 'Lead Interior Designer',
      category: 'design',
      location: 'Pune',
      type: 'Full-time',
      experience: '6+ Years',
      description: {
        intro: "Create immersive, minimalist interior spaces that harmonize with our architectural vision.",
        responsibilities: [
          "Conceptualize and execute interior design schemes for luxury residences.",
          "Select materials, finishes, and custom furniture pieces.",
          "Produce detailed 3D visualizations and technical drawings.",
          "Collaborate with architects to ensure a cohesive exterior-interior transition."
        ],
        requirements: [
          "Degree in Interior Design or Architecture.",
          "Exceptional sense of materials, lighting, and spatial arrangement.",
          "Proficiency in 3ds Max, V-Ray/Enscape, and SketchUp."
        ]
      }
    }
  ];

  const handleApplyClick = (jobTitle) => {
    setSelectedRole(jobTitle);
    setShowApplyForm(true);
  };

  const categoriesRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = categoriesRef.current?.querySelectorAll('.category-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`careers-page ${embedded ? 'careers-embedded' : ''}`} id="career">
      {!embedded && (
        <section className="careers-hero">
          <img src={heroImg} alt="Collaborative Studio" className="hero-bg" />
          <div className="hero-content">
            <div className="label">Careers</div>
            <p>Join a collective of visionaries redefining the architectural landscape.</p>
          </div>
        </section>
      )}

      <section className="careers-categories" ref={categoriesRef}>
        <div className="section-header">
          <h2 className="section-title">Evolving Together</h2>
          <p className="section-subtitle">Discover where your expertise fits within our multidisciplinary studio.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={cat.id} className="category-card" style={{ '--delay': `${index * 0.12}s` }}>
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p className="cat-desc">{cat.description}</p>
              <div className="cat-footer">
                <span className="open-roles">{cat.count} Open Roles</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="jobs-section">
        <div className="jobs-container">
          <div className="section-header">
            <h2 className="section-title">Current Openings</h2>
            <div className="filter-hint">Showing all roles across all locations</div>
          </div>
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className={`job-item ${activeJob === job.id ? 'active' : ''}`}>
                <div className="job-header" onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}>
                  <div className="job-title-group">
                    <div className="job-cat-tag">{categories.find(c => c.id === job.category).name}</div>
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="meta-item"><MapPin size={14} /> {job.location}</span>
                      <span className="meta-item"><Clock size={14} /> {job.type}</span>
                      <span className="meta-item"><Briefcase size={14} /> {job.experience}</span>
                    </div>
                  </div>
                  <span className="toggle-icon">
                    {activeJob === job.id ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
                  </span>
                </div>

                <div className="job-details">
                  <div className="job-description">
                    <p className="intro-text">{job.description.intro}</p>

                    <div className="details-grid">
                      <div className="details-col">
                        <h4>Key Responsibilities</h4>
                        <ul>
                          {job.description.responsibilities.map((res, i) => <li key={i}>{res}</li>)}
                        </ul>
                      </div>
                      <div className="details-col">
                        <h4>Requirements</h4>
                        <ul>
                          {job.description.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="apply-btn" onClick={() => handleApplyClick(job.title)}>Apply for this position</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showApplyForm && (
        <div className="modal-overlay">
          <div className="application-form-container">
            <button className="close-modal" onClick={() => setShowApplyForm(false)}>×</button>
            <div className="application-form">
              <div className="form-header">
                <h2>Join the Team</h2>
                <p>Applying for: <strong>{selectedRole}</strong></p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted successfully!'); setShowApplyForm(false); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Portfolio Link / Website</label>
                  <input type="url" placeholder="https://..." />
                </div>

                <div className="form-group">
                  <label>Upload Resume (PDF)</label>
                  <div className="file-upload-wrapper" onClick={() => document.getElementById('resume-upload').click()}>
                    <Upload size={24} />
                    <span>Click to upload or drag and drop</span>
                    <p className="file-hint">PDF format only, max 5MB</p>
                    <input type="file" style={{ display: 'none' }} accept=".pdf" id="resume-upload" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Why do you want to join GDMSPL?</label>
                  <textarea rows="4" placeholder="Briefly describe your vision and how you can contribute to our design philosophy..."></textarea>
                </div>

                <div className="form-footer">
                  <button type="submit" className="submit-btn">Submit Application</button>
                  <p className="privacy-note">By clicking submit, you agree to our recruitment privacy policy.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
