import React, { useState, useEffect } from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Mark Reynolds',
      designation: 'Project Engineer',
      company: '',
      comment: 'Worked with DGMTS on a road expansion project in Fairfax... the geotech team was on top of everything. Fast turnaround on lab reports and the field guys really knew what they were doing. Saved us from a couple delays. Solid group to work with.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Sarah Collins',
      designation: 'Site Supervisor',
      company: 'Clark Construction',
      comment: 'Honestly... inspections can be a headache, but the team from DGMTS made it feel smooth. They explained test results in plain english, not just numbers on paper. That\'s rare. Felt like I could actually trust the ground under my feet, no pun intended.',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'David Kim',
      designation: 'Site Superintendent',
      company: '',
      comment: 'Well, I wasn\'t expecting the level of detail we got. Their drilling crew came out last summer for subsurface work... neat, efficient, and left the site clean. Reports were thorough too. Big thanks to the Chantilly office!',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'James Whitfield',
      designation: 'Residential Builder',
      company: '',
      comment: 'Small jobs don\'t always get the same respect as big contracts, but Dulles treated ours seriously. Their field tech came out on time (in the rain!) and got the soil compaction tests done without fuss.',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Lisa Carter',
      designation: 'Construction Manager',
      company: '',
      comment: 'We\'ve hired them a few times now for materials testing and inspections... they show up on time, keep things professional, and actually explain stuff without all the jargon. That\'s rare in this line of work. Highly recommend.',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToTestimonial = (index) => {
    setActiveTestimonial(index);
  };

  return (
    <section 
      className="testimonials-section bg-texture"
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