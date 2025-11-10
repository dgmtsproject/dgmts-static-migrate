import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';
import projectsData from './data.json';
import { imageMap, defaultImage } from '../../assets/imageMap';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');

    const getProjectImage = (project, index) => {
    if (project.images && project.images.length > 0) {
      return imageMap[project.images[0]] || defaultImage;
    }
    return defaultImage; // Default fallback image
  };

  // Major service categories only
  const majorCategories = [
    'Engineering Analysis and Design',
    'Instrumentation',
    'Inspection',
    'Drilling',
    'In-Situ Testing',
    'Laboratory Testing',
    'Non-Destructive Testing'
  ];

  // Filter projects
  const filteredProjects = projectsData.projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = filterService === 'all' || 
                          (project.servicesProvided && project.servicesProvided.includes(filterService));
    
    return matchesSearch && matchesService;
  });

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Projects</h1>
            <p>
              Explore our portfolio of successful geotechnical engineering, construction inspection 
              and testing projects across Virginia, Maryland and Washington D.C.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="projects-filters">
        <div className="container">
          <div className="filters-grid">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search projects by title, location, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="service-filter"
              >
                <option value="all">All Services</option>
                {majorCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-grid-section bg-texture">
        <div className="container">
          <div className="projects-stats">
            <p>Showing {filteredProjects.length} of {projectsData.projects.length} projects</p>
          </div>
          
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <Link
                key={index}
                to={`/projects/${generateSlug(project.title)}`}
                state={{ project }}
                className="project-card"
              >
                <div className="project-image">
                  <img
                    src={getProjectImage(project, index)}
                    alt={project.title}
                    loading="lazy"
                  />
                  <div className="project-overlay">
                    <span className="view-project">View Project</span>
                  </div>
                </div>
                
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-meta">
                      <span className="project-location">
                        <i className="location-icon">📍</i>
                        {project.location}
                      </span>
                      {project.completionDate && (
                        <span className="project-status">
                          {project.completionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="project-details">
                    {project.client && (
                      <div className="detail-item">
                        <strong>Client:</strong> {project.client}
                      </div>
                    )}
                    
                    {/* {project.projectCost && (
                      <div className="detail-item">
                        <strong>Project Cost:</strong> {formatCurrency(project.projectCost)}
                      </div>
                    )} */}
                  </div>

                  <div className="project-services">
                    <div className="services-list">
                      {project.servicesProvided && project.servicesProvided.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="service-tag">
                          {service}
                        </span>
                      ))}
                      {project.servicesProvided && project.servicesProvided.length > 3 && (
                        <span className="service-tag more">
                          +{project.servicesProvided.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-projects">
              <h3>No projects found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="projects-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>
              Contact us today to discuss how our expertise can ensure the success of your next project.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;