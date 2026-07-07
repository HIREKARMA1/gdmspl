import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { teamMembers } from '../../data/team';
import './TeamPage.css';

const TeamPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const rows = document.querySelectorAll('.team-page-row');
    rows.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="team-page-container">
      <button className="back-to-home-btn" onClick={() => navigate('/#team')}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="team-page-header">
        <h1>Meet Our Full Team</h1>
        <p>The visionaries behind our architectural excellence.</p>
      </div>
      
      <div className="team-page-list">
        {teamMembers.map((member, index) => (
          <div key={member.id} className="team-page-row">


            {/* 2. Name & Designation */}
            <div className="team-page-row-meta">
              <h3 className="team-page-row-name">{member.name}</h3>
              <span className="team-page-row-role">{member.role}</span>
            </div>

            {/* 3. Portrait Image */}
            <div className="team-page-row-image-container">
              <img src={member.image} alt={member.name} className="team-page-row-image" />
            </div>

            {/* 4. Full Biography (Splits Paragraphs dynamically!) */}
            <div className="team-page-row-bio">
              {member.bio.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
