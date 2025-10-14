import React from 'react';
import './ProjectsList.css';

const ProjectsList = ({ title, subtitle, projects }) => {
  return (
    <section className="projects-list-section">
      <div className="projects-list-container">
        {(title || subtitle) && (
          <div className="projects-list-header">
            {title && <h2 className="projects-list-title">{title}</h2>}
            {subtitle && <p className="projects-list-subtitle">{subtitle}</p>}
          </div>
        )}
        
        <div className="projects-list-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-list-item">
              <div className="project-list-marker">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="project-list-content">
                <h4 className="project-list-item-title">{project.title}</h4>
                <p className="project-list-location">{project.location}</p>
                {project.owner && <p className="project-list-owner"><strong>Project Owner:</strong> {project.owner}</p>}
                {project.client && <p className="project-list-client"><strong>Client:</strong> {project.client}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsList;
