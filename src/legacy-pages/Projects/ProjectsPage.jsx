import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { projectData } from '../../data/projects';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayedProjects = showAll ? projectData : projectData.slice(0, 12);

  return (
    <div className="projects-page-container">
      <div className="projects-page-decor">
        <div className="decor-blob blob-1"></div>
        <div className="decor-blob blob-2"></div>
        <div className="decor-blob blob-3"></div>
      </div>
      
      <div className="container">
        <header className="projects-page-header">
          <div className="header-left">
            <button className="back-to-home-btn" onClick={() => navigate('/#projects')}>
              <ArrowLeft size={18} />
              <span>BACK TO HOME</span>
            </button>
            <motion.h1 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="page-title"
            >
              <span className="title-bold">ALL</span>
              <span className="title-outline">PROJECTS</span>
            </motion.h1>
          </div>
        </header>

        <section className="all-projects-grid">
          {displayedProjects.map((project, pIdx) => (
            <motion.div 
              key={project.id}
              className="projects-page-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (pIdx % 6) * 0.05 }}
            >
              <ProjectCard 
                title={project.title}
                category="" 
                image={project.image}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            </motion.div>
          ))}
        </section>

        {!showAll && projectData.length > 12 && (
          <div className="view-more-container">
            <button className="view-more-btn" onClick={() => setShowAll(true)}>
              VIEW MORE PROJECTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
