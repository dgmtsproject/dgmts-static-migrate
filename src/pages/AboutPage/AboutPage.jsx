import TeamGrid from './TeamGrid';
import ServiceMap from './components/ServiceMap';
import ServicesSection from './components/ServicesSection';
import CertificationsSection from '../HomePage/components/CertificationsSection';
import './AboutPage.css';

const AboutPage = () => {
  const aboutPageCertificationsData = {
    certifications: [
      'Virginia Department of Transportation (VDOT)',
      'District Department of Transportation (DDOT)',
      'Metropolitan Washington Airport Authority (MWAA)',
      'Washington Metropolitan Area Transit Authority (WMATA)',
      'Maryland Department of Transportation (MDOT)',
      'Maryland Transit Administration (MTA)',
      'Maryland Transportation Authority (MDTA)'
    ],
    secondCard: {
      title: 'CLIENTELE',
      items: [
        'Virginia Department of Transportation (VDOT)',
        'District Department of Transportation (DDOT)',
        'Maryland Department of Transportation (MDOT)',
        'Washington Metropolitan Area Transit Authority (WMATA)',
        'District of Columbia Water and Sewer Authority (DC Water)',
        'Howard University (HU)',
        'George Mason University (GMU)',
        'Towson University (TU)',
        'Churches',
        'Schools',
        'Private Developers'
      ]
    }
  };

  return (
  <main className="about-page bg-texture">
    <section className="about-section who-we-are">
      <h1 className="about-heading">Who We Are?</h1>
      <div className="about-content">
        <p>Established in 2012, <strong>Dulles Geotechnical and Materials Testing Services, Inc. (DGMTS)</strong> is a SWaM, MBE and DBE certified firm that offers a wide range of engineering services including geotechnical engineering and QA/QC testing to both the private sector and public agencies. Our team of certified engineers, highly trained inspectors and field technicians have the experience and expertise to take on any size project, large or small.</p>
        <p><strong>Our STAFF</strong> includes geotechnical engineers, geoscientists, geologists, structural engineers, project managers, construction engineers and inspectors, technicians, designers and administrative support staff who offer extensive experience in engineering consulting and site services.</p>
        <p><strong>Laboratories:</strong> DGMTS provides independent construction materials testing at our two in-house testing laboratory facilities in Chantilly and Hampton, ensuring efficiency and cost savings for our clients. Our laboratories are accredited by the American Association of State Highway and Transportation Officials (AASHTO) and we are members of the Washington Area Council of Engineering Laboratories, Inc. (WACEL). Our accreditation conforms to the requirements of ASTM D3740, ASTM E329, and AASHTO R-18.</p>
        <p><strong>Fleet:</strong> DGMTS owns a FLEET of ATVs, truck mounted drill rigs with capability of hollow-stem auger, mud rotary and rock coring. Our support equipment consists of service trucks, trailers, light towers, generators, and welding equipment. We also have asphalt and concrete coring machine.</p>
      </div>
    </section>
    
    <TeamGrid />
    
    <ServicesSection />
    
    <CertificationsSection data={aboutPageCertificationsData} />


    <section className="about-section areas-of-service">
    <h2 className="about-heading">Areas of Service</h2>
    <ServiceMap />
    <p style={{textAlign: 'center', marginTop: '1rem', fontWeight: 600, color: 'var(--primary-color)'}}>DGMTS is currently licensed to provide services in Virginia, Maryland and DC Metro Area.</p>
    </section>

    <section className="about-section why-choose-us">
      <h2 className="about-heading">Why Choose Us?</h2>
      <div className="about-content">
  <p>We pride ourselves as the most equipped geotechnical firm in the area, with more than 9 years of experience of design-build and design-bid-build projects. We believe in quality of service, that has earned us our clients&apos; trust, which is why most of our clients are repeat clients. We take a proactive approach to each project and try to identify potential problem areas before they arise.</p>
        <p>DGMTS understands the delicate environment, recognizes project budgetary constraints and works closely with clients to provide responsible, cost effective and timely solutions. Our careful scheduling and deployment of resources enables us to consistently meet project objectives and schedules without compromising professional standards. DGMTS continues to diversify and improve our many services to meet the ever-changing needs and requirements of our clients.</p>
      </div>
    </section>


  </main>
  );
};

export default AboutPage;
