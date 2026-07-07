import React from 'react';
import { Link } from 'react-router-dom';
import './Career.css';

const Career = () => {
  const roles = [
    { icon: '🏛️', name: 'Architects', count: 3 },
    { icon: '🏗️', name: 'PMC Roles (Project Management)', count: 2 },
    { icon: '💼', name: 'Administration', count: 4 },
    { icon: '🛋️', name: 'Interior Designers', count: 1 },
    { icon: '📐', name: 'Draftsmen', count: 2 },
  ];

  const featuredJobs = [
    {
      id: 1,
      tag: 'Architecture',
      title: 'Senior Project Architect',
      location: 'New Delhi · Full-time',
      snippet:
        'Lead high-profile commercial and residential projects from concept through to site execution, shaping the built environment of tomorrow.',
    },
    {
      id: 2,
      tag: 'Project Management',
      title: 'Project Manager (PMC)',
      location: 'Remote / Mumbai · Contract',
      snippet:
        'Coordinate project schedules, budgets, and quality control guidelines, ensuring design vision meets execution integrity.',
    },
  ];

  return (
    <section id="career" className="career-section">
      <div className="career-container">
        {/* Header */}
        <div className="career-header">
          <div className="career-header-left">
            <span className="career-label">Careers</span>
            <h2>
              Build With Us. <br />
              <span>Shape What's Next.</span>
            </h2>
          </div>
          <Link to="/careers" className="career-view-all">
            View All Openings →
          </Link>
        </div>

        {/* Role Category Chips */}
        <div className="career-roles-strip">
          {roles.map((role, i) => (
            <Link to="/careers" key={i} className="role-chip" style={{ textDecoration: 'none' }}>
              <span className="chip-icon">{role.icon}</span>
              {role.name}
              <span className="chip-count">{role.count}</span>
            </Link>
          ))}
        </div>

        {/* Featured Job Cards */}
        <div className="career-featured">
          {featuredJobs.map((job) => (
            <div key={job.id} className="featured-job-card">
              <span className="job-tag">{job.tag}</span>
              <h3>{job.title}</h3>
              <span className="job-location">{job.location}</span>
              <p className="job-snippet">{job.snippet}</p>
              <Link to="/careers" className="card-apply-link">
                Apply Now <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="career-cta">
          <div className="cta-text">
            <h3>Don't see the right role?</h3>
            <p>Send us your portfolio. We're always looking for exceptional talent.</p>
          </div>
          <Link to="/careers" className="cta-button">
            Explore Careers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Career;
