import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectData } from '../../data/projects';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Layers, Briefcase, IndianRupee, Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projectData.find(p => p.id === projectId);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % project.gallery.length);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  if (!project) {
    return (
      <div className="not-found">
        <h2>Project Not Found</h2>
        <Link to="/projects">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="detail-hero">
        <img src={project.image} alt={project.title} className="detail-hero-img" />
        <div className="detail-hero-overlay"></div>
        <div className="container detail-hero-content">
          <div onClick={() => navigate(-1)} className="detail-back-link" style={{ cursor: 'pointer' }}>
            <ArrowLeft size={20} />
            <span>BACK</span>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="detail-header-top">
              <div className="detail-tags">
                {project.scope.split(',').map((tag, i) => (
                  <span key={i} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            </div>
            <h1 className="detail-title">{project.title}</h1>
          </motion.div>
        </div>
      </div>

      <div className="container detail-main-content">
        <div className="detail-grid">
          <motion.div 
            className="detail-info-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-label">PROJECT OVERVIEW</h2>
            <p className="detail-long-desc">{project.details}</p>
            
            <div className="detail-specs">
              <div className="spec-item">
                <Briefcase size={18} />
                <div>
                  <span className="spec-label">Client</span>
                  <span className="spec-value">{project.client}</span>
                </div>
              </div>
              <div className="spec-item">
                <Maximize size={18} />
                <div>
                  <span className="spec-label">Area</span>
                  <span className="spec-value">{project.area}</span>
                </div>
              </div>
              <div className="spec-item">
                <IndianRupee size={18} />
                <div>
                  <span className="spec-label">Project Cost</span>
                  <span className="spec-value">{project.cost}</span>
                </div>
              </div>
              <div className="spec-item">
                <MapPin size={18} />
                <div>
                  <span className="spec-label">Location</span>
                  <span className="spec-value">{project.location || 'N/A'}</span>
                </div>
              </div>
              <div className="spec-item">
                <Calendar size={18} />
                <div>
                  <span className="spec-label">Status</span>
                  <span className="spec-value">{project.status}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="detail-gallery-column">
            <h2 className="section-label">PROJECT GALLERY</h2>
            <div className="detail-gallery-grid">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => openLightbox(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={img} alt={`${project.title} gallery ${idx}`} />
                  <div className="gallery-item-hover">
                    <Maximize size={20} color="white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
            <X size={28} />
          </button>
          
          <button className="lightbox-prev" onClick={showPrevImage} aria-label="Previous image">
            <ChevronLeft size={36} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={project.gallery[lightboxIndex]} alt={`${project.title} gallery full ${lightboxIndex}`} className="lightbox-img" />
            <span className="lightbox-counter">{lightboxIndex + 1} / {project.gallery.length}</span>
          </div>
          
          <button className="lightbox-next" onClick={showNextImage} aria-label="Next image">
            <ChevronRight size={36} />
          </button>
        </div>
      )}

    </div>
  );
};

export default ProjectDetail;
