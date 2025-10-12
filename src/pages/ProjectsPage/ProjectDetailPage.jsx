import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './ProjectDetailPage.css';

// Import project images
import project1_1 from '../../assets/projects/project1_1.png';
import project1_2 from '../../assets/projects/project1_2.png';
import project2_1 from '../../assets/projects/project2_1.png';
import project2_2 from '../../assets/projects/project2_2.png';
import project3_1 from '../../assets/projects/project3_1.png';
import project3_2 from '../../assets/projects/project3_2.png';
import project4_1 from '../../assets/projects/project4_1.png';
import project4_2 from '../../assets/projects/project4_2.png';
import project4_3 from '../../assets/projects/project4_3.png';
import project5_1 from '../../assets/projects/project5_1.png';
import project5_2 from '../../assets/projects/project5_2.png';

const ProjectDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image mapping
  const imageMap = {
    '/src/assets/projects/project1_1.png': project1_1,
    '/src/assets/projects/project1_2.png': project1_2,
    '/src/assets/projects/project2_1.png': project2_1,
    '/src/assets/projects/project2_2.png': project2_2,
    '/src/assets/projects/project3_1.png': project3_1,
    '/src/assets/projects/project3_2.png': project3_2,
    '/src/assets/projects/project4_1.png': project4_1,
    '/src/assets/projects/project4_2.png': project4_2,
    '/src/assets/projects/project4_3.png': project4_3,
    '/src/assets/projects/project5_1.png': project5_1,
    '/src/assets/projects/project5_2.png': project5_2,
  };

  // Get project from location state
  const project = location.state?.project;

  // If no project data, redirect to projects page
  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Project Not Found</h2>
            <p>The requested project could not be found.</p>
            <Link to="/projects" className="btn btn-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const projectImages = project.images || ['/src/assets/projects/project1_1.png'];
  const resolvedImages = projectImages.map(path => imageMap[path] || project1_1);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === resolvedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? resolvedImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="project-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/projects">Projects</Link>
            <span>/</span>
            <span>{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="project-hero">
        <div className="container">
          <div className="project-hero-content">
            <div className="project-hero-text">
              <h1>{project.title}</h1>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{project.location}</span>
                </div>
                {project.client && (
                  <div className="meta-item">
                    <span className="meta-label">Client:</span>
                    <span className="meta-value">{project.client}</span>
                  </div>
                )}
                {project.completionDate && (
                  <div className="meta-item">
                    <span className="meta-label">Status:</span>
                    <span className="meta-value status">{project.completionDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Image Gallery */}
            <div className="project-gallery">
              <div className="gallery-main">
                <img 
                  src={resolvedImages[currentImageIndex]} 
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                />
                
              </div>
              {resolvedImages.length > 1 && (
                <div className="gallery-thumbnails">
                  {resolvedImages.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="project-details-section">
        <div className="container">
          <div className="project-details-grid">
            
            {/* Main Content */}
            <div className="project-main-content">
              {project.description && (
                <div className="detail-section">
                  <h2>Project Overview</h2>
                  <p>{project.description}</p>
                </div>
              )}

              {project.scopeOfServices && project.scopeOfServices.length > 0 && (
                <div className="detail-section">
                  <h2>Scope of Services</h2>
                  <ul className="services-list">
                    {project.scopeOfServices.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.results && project.results.length > 0 && (
                <div className="detail-section">
                  <h2>Project Results</h2>
                  <ul className="results-list">
                    {project.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.keyPersonnel && project.keyPersonnel.length > 0 && (
                <div className="detail-section">
                  <h2>Key Personnel</h2>
                  <div className="personnel-grid">
                    {project.keyPersonnel.map((person, index) => (
                      <div key={index} className="personnel-card">
                        <h4>{person.name}</h4>
                        <p>{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="project-sidebar">
              <div className="sidebar-card">
                <h3>Project Information</h3>
                
                {project.projectOwner && (
                  <div className="info-item">
                    <span className="info-label">Project Owner:</span>
                    <span className="info-value">{project.projectOwner}</span>
                  </div>
                )}
                
                {project.projectDesigner && (
                  <div className="info-item">
                    <span className="info-label">Designer:</span>
                    <span className="info-value">{project.projectDesigner}</span>
                  </div>
                )}
                
                {project.generalContractor && (
                  <div className="info-item">
                    <span className="info-label">General Contractor:</span>
                    <span className="info-value">{project.generalContractor}</span>
                  </div>
                )}
                
                {project.projectCost && (
                  <div className="info-item">
                    <span className="info-label">Project Cost:</span>
                    <span className="info-value">{formatCurrency(project.projectCost)}</span>
                  </div>
                )}
                
                {project.taskBudget && (
                  <div className="info-item">
                    <span className="info-label">DGMTS Budget:</span>
                    <span className="info-value">{formatCurrency(project.taskBudget)}</span>
                  </div>
                )}
                
                {project.dgmtsValue && (
                  <div className="info-item">
                    <span className="info-label">DGMTS Value:</span>
                    <span className="info-value">{formatCurrency(project.dgmtsValue)}</span>
                  </div>
                )}
              </div>

              {project.servicesProvided && project.servicesProvided.length > 0 && (
                <div className="sidebar-card">
                  <h3>Services Provided</h3>
                  <div className="services-tags">
                    {project.servicesProvided.map((service, index) => (
                      <span key={index} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.contact && (
                <div className="sidebar-card">
                  <h3>Project Contact</h3>
                  <div className="contact-info">
                    <div className="contact-name">{project.contact.name}</div>
                    {project.contact.phone && (
                      <div className="contact-item">
                        <span>📞</span>
                        <a href={`tel:${project.contact.phone}`}>{project.contact.phone}</a>
                      </div>
                    )}
                    {project.contact.email && (
                      <div className="contact-item">
                        <span>✉️</span>
                        <a href={`mailto:${project.contact.email}`}>{project.contact.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="project-navigation">
        <div className="container">
          <div className="nav-actions">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              ← Back to Projects
            </button>
            <Link to="/contact" className="btn btn-primary">
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;