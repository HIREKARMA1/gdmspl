import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectData } from '../../data/projects';
import './Services.css';

// Importing images for the creative preview as fallbacks
import img1 from '../../assets/project_urban.png';
import img2 from '../../assets/project_desert.png';
import img3 from '../../assets/project_mountain.png';
import img4 from '../../assets/project_modern.png';
import img5 from '../../assets/project1.png';
import img6 from '../../assets/project2.png';
import img7 from '../../assets/project3.png';

const Services = () => {
  const navigate = useNavigate();

  const services = useMemo(() => [
    {
      id: "01",
      title: "Architecture",
      category: "Architecture",
      image: projectData.find(p => p.id === 'delhi-haat')?.image || img3,
      description: "Creating innovative and sustainable architectural solutions for diverse built environments."
    },
    {
      id: "02",
      title: "Project Management",
      category: "Project Management",
      image: projectData.find(p => p.category.includes("Project Management"))?.image || img2,
      description: "Ensuring seamless project execution from inception to completion with expert oversight."
    },
    {
      id: "03",
      title: "Urban Design",
      category: "Urban Design",
      image: projectData.find(p => p.category.includes("Urban Design"))?.image || img1,
      description: "Designing large-scale urban and regional developments with long-term vision."
    },
    {
      id: "04",
      title: "Interiors",
      category: "Interiors",
      image: projectData.find(p => p.category.includes("Interiors"))?.image || img4,
      description: "Crafting bespoke interior spaces that balance aesthetics with functional excellence."
    },
    {
      id: "05",
      title: "Landscape",
      category: "Landscape",
      image: projectData.find(p => p.category.includes("Landscape"))?.image || img5,
      description: "Integrating natural elements to create harmonious and engaging outdoor environments."
    },
    {
      id: "06",
      title: "BIM",
      category: "BIM",
      image: projectData.find(p => p.id === "bps-medical")?.image || img1,
      description: "Leveraging Building Information Modeling for precise planning and coordination."
    },
    {
      id: "07",
      title: "Engineering",
      category: "Engineering",
      image: projectData.find(p => p.category.includes("Engineering"))?.image || img7,
      description: "Engineering robust and innovative systems for architectural stability and performance."
    },
    {
      id: "08",
      title: "Conservation and restoration",
      category: "Conservation and restoration",
      image: projectData.find(p => p.category.includes("Conservation and restoration"))?.image || img6,
      description: "Preserving architectural heritage through sensitive and expert restoration techniques."
    },
    {
      id: "09",
      title: "Sustainable Design",
      category: "Sustainable Design",
      image: projectData.find(p => p.category.includes("Sustainable Design"))?.image || img4,
      description: "Integrating eco-friendly practices and materials to minimize environmental impact."
    }
  ], []);

  const [activeService, setActiveService] = useState(() => services[0]);

  const handleServiceClick = (category) => {
    navigate('/categories', { state: { scrollTo: category } });
  };

  return (
    <section id="services" className="services-section-creative">
      <div className="blueprint-overlay"></div>
      
      <div className="container-fluid services-container reverse">
        {/* Left Side: Image Preview */}
        <div className="services-preview-side">
          <div className="sticky-preview" onClick={() => handleServiceClick(activeService.category)}>
            <div className="preview-frame">
              <div className="frame-corners top-left"></div>
              <div className="frame-corners top-right"></div>
              <div className="frame-corners bottom-left"></div>
              <div className="frame-corners bottom-right"></div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeService.id}
                  className="preview-image-wrapper"
                  initial={{ opacity: 0, scale: 1.1, filter: 'grayscale(100%) brightness(0.5)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'grayscale(0%) brightness(1)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'grayscale(100%) brightness(1.5)' }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img src={activeService.image} alt={activeService.title} />
                  <div className="image-overlay-blueprint"></div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="active-service-info">
              <motion.div 
                 key={activeService.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
              >
                <h4 className="info-title">{activeService.title}</h4>
                <div className="view-more-cta">CLICK TO EXPLORE PORTFOLIO</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side: Services List */}
        <div className="services-list-side">
          <motion.div 
            className="services-header-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="creative-title">Design <br /> <span className="text-outline">Integrity</span></h2>
          </motion.div>

          <div className="services-list-creative">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className={`service-item-creative ${activeService.id === service.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveService(service)}
                onClick={() => handleServiceClick(service.category)}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: parseInt(service.id) * 0.05 }}
              >
                <span className="item-number">{service.id}</span>
                <div className="item-content">
                  <h3 className="item-title">{service.title}</h3>
                </div>
                <div className="item-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
