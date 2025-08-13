import React from 'react';
import './FirmOverview.css';

const FirmOverview = () => {
  return (
    <React.Fragment>
    <section className="firm-overview home-section" aria-labelledby="firm-overview-heading">
      <div className="container">
        <div className="firm-overview__inner">
          <h2 id="firm-overview-heading" className="firm-overview__heading">Established in 2012</h2>
          <p className="firm-overview__lead">
            Established in 2012, <strong className="text-primary">Dulles Geotechnical and Materials Testing Services, Inc. (DGMTS)</strong> is a certified <strong>SWaM</strong> and <strong>MBE/DBE</strong> firm, specializing in a wide range of engineering services and a major contributor to the country&apos;s infrastructure and materials testing industry. We provide comprehensive geotechnical engineering—including instrumentation, drilling and QA/QC testing services—to both the public and private sectors in Virginia, Maryland and the Washington DC area.
          </p>
        </div>
      </div>
    </section>
    </React.Fragment>
  );
};

export default FirmOverview;
