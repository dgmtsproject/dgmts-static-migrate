import React, { useState, useEffect } from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'John Smith',
      designation: 'Project Manager',
      company: 'Metropolitan Construction',
      comment: 'DGMTS has consistently delivered exceptional geotechnical engineering services for our projects. Their attention to detail and professional approach has made them our go-to partner for all materials testing and inspection needs.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Sarah Johnson',
      designation: 'Engineering Director',
      company: 'Virginia Infrastructure Group',
      comment: 'The team at DGMTS brings unmatched expertise to every project. Their comprehensive testing services and timely reporting have helped us maintain project schedules while ensuring quality and compliance.',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Michael Rodriguez',
      designation: 'Senior Engineer',
      company: 'DMV Development Solutions',
      comment: 'Working with DGMTS has been a game-changer for our construction projects. Their certified professionals and state-of-the-art laboratory facilities provide the reliability and accuracy we need for critical infrastructure work.',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToTestimonial = (index) => {
    setActiveTestimonial(index);
  };

  return (
    <section 
      className="testimonials-section"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600')`
      }}
    >
      <div className="testimonials-overlay"></div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title text-white">What Our Clients Say</h2>
          <p className="section-subtitle text-white">
            Trusted by leading construction companies and government agencies across the region
          </p>
        </div>

        <div className="testimonials-carousel">
          <div className="testimonials-wrapper">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-item ${index === activeTestimonial ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M14.017 21V9.5C14.017 4.253 18.27 0 23.517 0V2.5C19.427 2.5 16.017 5.91 16.017 10V12.5H23.017V21H14.017ZM0 21V9.5C0 4.253 4.253 0 9.5 0V2.5C5.41 2.5 2 5.91 2 10V12.5H9V21H0Z" fill="currentColor" opacity="0.3"/>
                    </svg>
                  </div>
                  <p className="testimonial-text">{testimonial.comment}</p>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img src={testimonial.photo} alt={testimonial.name} />
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-title">
                        {testimonial.designation}
                        {testimonial.company && <span> - {testimonial.company}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-controls">
            <div className="testimonials-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;