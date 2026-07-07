import aboutImg from '../../assets/About.png';
import './About.css';
import { TextAnimate } from "@/registry/magicui/text-animate";

import { motion } from 'framer-motion';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <div className="about-header">
          <h2 className="about-title">
            Designing with clarity.<br />
            <span className="about-title-sub">Building with purpose.</span>
          </h2>
        </div>

        <div className="about-content">
          <div className="about-image-well">
            <img src={aboutImg} alt="About Geometric Design" className="about-image" />
          </div>

          <div className="about-text-well">
            <div className="about-description">
              <TextAnimate animation="blurInUp" by="word" once className="description-lead">
                Geometric Design is a versatile architectural and allied works’ service provider with its
                head office based in New Delhi, and a team of professional designers with the best
                expertise in the field.
              </TextAnimate>
              <p>
                We deal with architectural, urban design, interiors, landscape design, building
                information modelling and project management services including engineering
                services for structural, electrical, plumbing, HVAC, Public Health engineering
                and Automation systems.
              </p>
            </div>

            <div className="locations-section">
              <TextAnimate animation="fadeIn" by="word" className="section-subtitle">
                Our Presence
              </TextAnimate>
              <motion.div 
                className="locations-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {['Delhi', 'Mumbai', 'Nepal', 'Muscat'].map((location, index) => (
                  <motion.div 
                    key={index} 
                    className="location-tag"
                    variants={itemVariants}
                  >
                    <span className="dot"></span>
                    {location}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
