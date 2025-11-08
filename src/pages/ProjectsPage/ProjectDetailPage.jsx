import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './ProjectDetailPage.css';
import { imageMap, defaultImage } from '../../assets/imageMap';

const ProjectDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get project from location state
  const project = location.state?.project;

  // If no project data, redirect to projects page
  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="container">
          <div className="project-detail-page-error-message">
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
  const resolvedImages = projectImages.map(path => imageMap[path] || defaultImage);

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
      <div className="project-detail-page-breadcrumb-section">
        <div className="container">
          <nav className="project-detail-page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/projects">Projects</Link>
            <span>/</span>
            <span>{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="project-detail-page-project-hero">
        <div className="container">
          <div className="project-detail-page-project-hero-content">
            <div className="project-detail-page-project-hero-text">
              <h1>{project.title}</h1>
              <div className="project-detail-page-project-meta">
                <div className="project-detail-page-meta-item">
                  <span className="project-detail-page-meta-label">Location:</span>
                  <span className="project-detail-page-meta-value">{project.location}</span>
                </div>
                {project.client && (
                  <div className="project-detail-page-meta-item">
                    <span className="project-detail-page-meta-label">Client:</span>
                    <span className="project-detail-page-meta-value">{project.client}</span>
                  </div>
                )}
                {project.completionDate && (
                  <div className="project-detail-page-meta-item">
                    <span className="project-detail-page-meta-label">Status:</span>
                    <span className="project-detail-page-meta-value status">{project.completionDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Image Gallery */}
            <div className="project-detail-page-project-gallery">
              <div className="project-detail-page-gallery-main">
                <img 
                  src={resolvedImages[currentImageIndex]} 
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                />
                
              </div>
              {resolvedImages.length > 1 && (
                <div className="project-detail-page-gallery-thumbnails">
                  {resolvedImages.map((image, index) => (
                    <button
                      key={index}
                      className={`project-detail-page-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
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
      <section className="project-detail-page-project-details-section">
        <div className="container">
          <div className="project-detail-page-project-details-grid">
            
            {/* Main Content */}
            <div className="project-detail-page-project-main-content">
              {project.description && (
                <div className="project-detail-page-detail-section">
                  <h2>Project Overview</h2>
                  <p>{project.description}</p>
                </div>
              )}

              {project.scopeOfServices && project.scopeOfServices.length > 0 && (
                <div className="project-detail-page-detail-section">
                  <h2>Services Provided</h2>
                  <ul className="project-detail-page-services-list">
                    {project.scopeOfServices.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.results && project.results.length > 0 && (
                <div className="project-detail-page-detail-section">
                  <h2>Project Results</h2>
                  <ul className="project-detail-page-results-list">
                    {project.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.keyPersonnel && project.keyPersonnel.length > 0 && (
                <div className="project-detail-page-detail-section">
                  <h2>Key Personnel</h2>
                  <div className="project-detail-page-personnel-grid">
                    {project.keyPersonnel.map((person, index) => (
                      <div key={index} className="project-detail-page-personnel-card">
                        <h4>{person.name}</h4>
                        <p>{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="project-detail-page-project-sidebar">
              <div className="project-detail-page-sidebar-card">
                <h3>Project Information</h3>
                
                {project.projectOwner && (
                  <div className="project-detail-page-info-item">
                    <span className="project-detail-page-info-label">Project Owner:</span>
                    <span className="project-detail-page-info-value">{project.projectOwner}</span>
                  </div>
                )}
                
                {project.projectDesigner && (
                  <div className="project-detail-page-info-item">
                    <span className="project-detail-page-info-label">Designer:</span>
                    <span className="project-detail-page-info-value">{project.projectDesigner}</span>
                  </div>
                )}
                
                {project.generalContractor && (
                  <div className="project-detail-page-info-item">
                    <span className="project-detail-page-info-label">General Contractor:</span>
                    <span className="project-detail-page-info-value">{project.generalContractor}</span>
                  </div>
                )}
                
                
                
                {project.dgmtsValue && (
                  <div className="project-detail-page-info-item">
                    <span className="project-detail-page-info-label">DGMTS Value:</span>
                    <span className="project-detail-page-info-value">{formatCurrency(project.dgmtsValue)}</span>
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="project-detail-page-project-navigation">
        <div className="container">
          <div className="project-detail-page-nav-actions">
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