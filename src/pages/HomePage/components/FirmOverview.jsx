import React from 'react';
import './FirmOverview.css';

const FirmOverview = () => {
  return (
    <React.Fragment>
    <section className="firm-overview home-section bg-texture" aria-labelledby="firm-overview-heading">
      <div className="">
        <div className="firm-overview__inner">
          <h2 id="firm-overview-heading" className="firm-overview__heading">Established in 2012</h2>
          <p className="firm-overview__lead">
            Established in 2012 and headquartered in <strong>Chantilly, VA</strong>, <strong className="text-primary">Dulles Geotechnical and Materials Testing Services, Inc. (DGMTS)</strong> is a certified <strong>SWaM</strong> and <strong>MBE/DBE</strong> firm specializing in geotechnical engineering and materials testing. We serve Loudoun County, Fairfax County, Northern Virginia, Maryland, and Washington, DC with instrumentation, drilling, laboratory testing, and QA/QC for public and private infrastructure projects.
          </p>
        </div>
      </div>
    </section>
    </React.Fragment>
  );
};

export default FirmOverview;
