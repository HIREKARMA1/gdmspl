import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ title, category, image, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
        onClick();
        return;
    }
    navigate('/categories', { state: { scrollTo: category } });
  };

  return (
    <div className="project-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="project-image-container">
        <img src={image} alt={title} className="project-image" />
        <div className="project-overlay">
          <div className="project-info">
            {category && <span className="project-category">{category}</span>}
            <h3 className="project-title">{title}</h3>
            <span className="project-action">
              <span>View Project</span>
              <svg className="project-action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
