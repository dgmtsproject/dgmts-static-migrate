import React from 'react';
import './LocationPage.css';
import Footer from '../../components/Footer/Footer';
import { locations } from './locationsData';
import { MapPin, Phone } from 'lucide-react';

const LocationPage = () => {
  return (
    <div className="location-page">
      <div className="location-container">
        <div className="location-header">
          <h1 className="location-title">Our Locations</h1>
          <p className="location-intro">
            Find our offices in Virginia, Washington DC, and Maryland.
          </p>
        </div>

        <div className="locations-list">
          {locations.map((location, index) => (
            <div key={index} className="location-card">
              <div className="location-card-content">
                <div className="location-card-header">
                  <h2 className="location-name">{location.name}</h2>
                  {location.certification && (
                    <p className="location-certification">{location.certification}</p>
                  )}
                  <p className="location-office-type">{location.officeType}</p>
                </div>
                <div className="location-card-body">
                  <div className="location-info">
                    <MapPin className="location-icon" />
                    <a href={location.googleMapsLink} target="_blank" rel="noopener noreferrer">
                      {location.address}
                    </a>
                  </div>
                  <div className="location-info">
                    <Phone className="location-icon" />
                    <span>{location.phone}</span>
                  </div>
                </div>
              </div>
              <div className="location-map">
                {(() => {
                  // Prefer an explicit embed link if provided, otherwise build a simple embed using the address
                  const hasEmbed = location.googleMapsLink && (location.googleMapsLink.includes('/embed') || location.googleMapsLink.includes('output=embed'));
                  const src = hasEmbed
                    ? location.googleMapsLink
                    : `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;
                  return (
                    <iframe
                      title={`Map of ${location.name}`}
                      src={src}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationPage;
