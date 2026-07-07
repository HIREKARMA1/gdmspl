import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { categoryData } from '../../data/projects';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const { state } = useLocation();
  
  // Use state initializer to pick up the navigation state immediately
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return state?.scrollTo || (categoryData.length > 0 ? categoryData[0].name : null);
  });

  // Keep state in sync if location state changes
  useEffect(() => {
    if (state?.scrollTo) {
      setSelectedCategory(state.scrollTo);
    }
    window.scrollTo(0, 0);
  }, [state]);

  const activeCategory = useMemo(() => {
    return categoryData.find(cat => cat.name === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="categories-page">
      <div className="categories-header-bg"></div>
      
      <div className="container">
        <header className="page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>BACK TO HOME</span>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="page-title"
          >
            OUR PORTFOLIO BY CATEGORY
          </motion.h1>
          <p className="page-subtitle">Exploring architectural excellence across diverse sectors.</p>
        </header>

        <nav className="category-tabs">
            {categoryData.map((cat) => (
                <button 
                    key={cat.name} 
                    className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => {
                        setSelectedCategory(cat.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    {cat.name}
                </button>
            ))}
        </nav>

        <section className="categories-list">
          <AnimatePresence mode="wait">
            {activeCategory ? (
              <motion.div 
                key={activeCategory.name}
                className="category-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="category-info">
                  <span className="category-index">VIEWING SECTOR</span>
                  <h2 className="category-name">{activeCategory.name}</h2>
                </div>

                <div className="projects-grid">
                  {activeCategory.projects.map((project, pIdx) => (
                    <motion.div 
                      key={project.id}
                      className="category-project-card"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: pIdx * 0.05 }}
                    >
                      <div className="project-image-wrapper">
                        <img src={project.image} alt={project.title} className="category-project-image" />
                        <div className="project-card-overlay">
                          <Link to={`/project/${project.id}`} className="view-details-btn">
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
                <motion.div 
                  key="no-projects" 
                  className="no-projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                    <p>No projects found in this category.</p>
                </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default Categories;
