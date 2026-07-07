import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSectionScroll from '../../hooks/useSectionScroll';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import InteractiveHoverButton from '../../components/InteractiveHoverButton/InteractiveHoverButton';
import { projectData } from '../../data/projects';
import './Projects.css';

const Projects = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const scrollProgress = useSectionScroll(containerRef);
  const bentoSizes = [
    'bento-hero',      // Index 0: EPFO Housing (2x2)
    'bento-standard',  // Index 1: Lakshadweep (1x1)
    'bento-standard',  // Index 2: Pratyaksha (1x1)
    'bento-tall',      // Index 3: Central University (1x2)
    'bento-wide',      // Index 4: GPOA-2 (2x1)
    'bento-standard',  // Index 5: IPU Auditorium (1x1)
    'bento-standard',  // Index 6: Delhi Haat (1x1)
    'bento-tall',      // Index 7: BPS Medical (1x2)
    'bento-wide',      // Index 8: Jodhpur Airport (2x1)
    'bento-standard',  // Index 9: Taj Safaris (1x1)
    'bento-standard',  // Index 10: Restoration (1x1)
    'bento-tall'       // Index 11: Chaudhary Farmhouse (1x2)
  ];

  // Map first 12 projects to bento layout
  const displayItems = projectData.slice(0, 12).map((project, index) => ({
    id: project.id,
    title: project.title,
    category: '', // No sub-category needed as per request
    image: project.image,
    size: bentoSizes[index]
  }));

  // Calibrated to 76% to perfectly eliminate trailing space for the current Bento track width
  const translateX = scrollProgress * 76; 

  return (
    <section className="projects-wrapper" id="projects" ref={containerRef}>
      <div className="sticky-inner">
        <div className="projects-bg"></div>

        <div 
          className="horizontal-track"
          style={{ transform: `translateX(-${translateX}%)` }}
        >

          {/* Bento Grid Items */}
          {displayItems.map((item, index) => (
            <div key={index} className={`project-item ${item.size}`}>
              <ProjectCard 
                title={item.title} 
                category={item.category} 
                image={item.image} 
                onClick={() => navigate(`/project/${item.id}`)}
              />
            </div>
          ))}

          {/* Outro CTA */}
          <div className="explore-column">
            <div className="explore-card">
              <span className="explore-card-subtitle">OUR PORTFOLIO</span>
              <h3 className="explore-card-title">Looking for more?</h3>
              <p className="explore-card-text">
                Explore our full collection of architectural masterpieces, premium interiors, and landscape designs.
              </p>
              <div className="explore-btn-wrapper" onClick={() => navigate('/projects')}>
                <InteractiveHoverButton>EXPLORE ALL PROJECTS</InteractiveHoverButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
