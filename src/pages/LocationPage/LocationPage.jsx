import React, { useState } from 'react';
import './LocationPage.css';
import { locations } from './locationsData';
import { Building, Landmark, Building2, Warehouse, Award, MapPin, Phone } from 'lucide-react';

const iconMap = {
  Building: Building,
  Landmark: Landmark,
  Building2: Building2,
  Warehouse: Warehouse,
};

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <div className="location-page-container bg-texture">
      {/* Header Section */}
      <div className="location-page-header">
        <div className="location-page-header-content">
          <div className="location-page-header-text">
            <h1 className="location-page-title">Our Locations</h1>
            <p className="location-page-subtitle">
              Find our offices across Virginia, Washington DC, and Maryland.
              We're here to serve you with convenient locations and professional service.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="location-page-main-content">
        <div className="location-page-grid">

          {/* Column 1: Location Tabs */}
          <div className="location-tabs-column">
            <h2 className="location-tabs-title">Select Location</h2>
            {locations.map((location, index) => {
              const Icon = iconMap[location.icon];
              return (
                <div
                  key={index}
                  className={`location-tab ${selectedLocation.address === location.address ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="location-tab-content">
                    <div className={`location-tab-icon ${selectedLocation.address === location.address ? 'active' : ''}`}>
                      {Icon && <Icon size={16} />}
                    </div>
                    <div className="location-tab-text">
                      <h3 className={`location-tab-name ${selectedLocation.address === location.address ? 'active' : ''}`}>
                        {location.name}
                      </h3>
                      <p className={`location-tab-office-type ${selectedLocation.address === location.address ? 'active' : ''}`}>
                        {location.officeType}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Location Details */}
          <div className="location-details-column">
            <div className="location-details-card">
              <div className="location-details-header">
                <div className="location-details-title-group">
                  <div className="location-details-icon-wrapper">
                    {React.createElement(iconMap[selectedLocation.icon], { className: "location-details-icon" })}
                  </div>
                  <div>
                    <h2 className="location-details-name">{selectedLocation.name}</h2>
                    <p className="location-details-office-type">{selectedLocation.officeType}</p>
                  </div>
                </div>

                {selectedLocation.certification && (
                  <div className="location-certification-badge">
                    <Award size={16} />
                    <span>{selectedLocation.certification}</span>
                  </div>
                )}
              </div>

              <div className="location-info-group">
                {/* Address */}
                <div className="info-item-group">
                  <div className="info-item">
                    <div className="info-item-icon-wrapper address">
                      <MapPin className="info-item-icon" />
                    </div>
                    <div className="info-item-text">
                      <h4 className="info-item-title">Address</h4>
                      <a
                        href={selectedLocation.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-item-link"
                      >
                        {selectedLocation.address}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="info-item-group">
                  <div className="info-item">
                    <div className="info-item-icon-wrapper phone">
                      <Phone className="info-item-icon" />
                    </div>
                    <div className="info-item-text">
                      <h4 className="info-item-title">Phone</h4>
                      <a
                        href={`tel:${selectedLocation.phone}`}
                        className="info-item-link phone"
                      >
                        {selectedLocation.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Map */}
          <div className="location-map-column">
            <div className="location-map-card">
              <div className="location-map-header">
                <h3 className="location-map-title">Location Map</h3>
                <p className="location-map-subtitle">Interactive map of {selectedLocation.name}</p>
              </div>
              <div className="location-map-container">
                <iframe
                  title={`Map of ${selectedLocation.name}`}
                  src={(() => {
                    const hasEmbed = selectedLocation.googleMapsLink &&
                      (selectedLocation.googleMapsLink.includes('/embed') || selectedLocation.googleMapsLink.includes('output=embed'));
                    if (hasEmbed) {
                      return selectedLocation.googleMapsLink;
                    }
                    // Add location name as label in the query
                    const query = `${selectedLocation.name}, ${selectedLocation.address}`;
                    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
                  })()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="location-map-iframe"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
