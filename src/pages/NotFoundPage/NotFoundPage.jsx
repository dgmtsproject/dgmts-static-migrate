import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page bg-texture">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="error-actions">
            <Link to="/" className="btn-primary">
              Go to Homepage
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>

          <div className="helpful-links">
            <h3>You might be looking for:</h3>
            <ul>
              <li><Link to="/services/geotechnical">Geotechnical Engineering Services</Link></li>
              <li><Link to="/about">About DGMTS</Link></li>
              <li><Link to="/blog">Our Blog</Link></li>
              <li><Link to="/contact">Contact Information</Link></li>
              <li><Link to="/gallery">Project Gallery</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
