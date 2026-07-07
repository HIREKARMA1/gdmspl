import React from 'react';
import { ArrowRight } from 'lucide-react';
import './InteractiveHoverButton.css';

const InteractiveHoverButton = ({ children, className = '', ...props }) => {
  return (
    <button className={`interactive-hover-button ${className}`} {...props}>
      <div className="button-text-container">
        <span className="button-text-default">{children}</span>
      </div>
      
      <div className="button-overlay">
        <span className="button-text-hover">
          {children}
          <ArrowRight className="button-icon" size={20} />
        </span>
      </div>
    </button>
  );
};

export default InteractiveHoverButton;
