import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
      heading: 'Leading Geotechnical Engineering Solutions',
      content: 'Providing comprehensive geotechnical engineering, materials testing, and construction services across Virginia, Maryland, and Washington DC.',
      buttonText: 'Learn More',
      buttonUrl: '/about',
      position: 'center'
    },
    {
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
      heading: 'Certified SWaM and MBE/DBE Firm',
      content: 'Established in 2012, DGMTS is your trusted partner for quality engineering services and materials testing with industry-leading certifications.',
      buttonText: 'Our Services',
      buttonUrl: '/services',
      position: 'left'
    },
    {
      image: 'https://images.pexels.com/photos/3862379/pexels-photo-3862379.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
      heading: 'Advanced Testing Facilities',
      content: 'Our state-of-the-art laboratories in Chantilly and Hampton provide accurate, reliable testing results for your construction projects.',
      buttonText: 'Contact Us',
      buttonUrl: '/contact',
      position: 'right'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <div className={`slide-inner ${slide.position}`}>
                <div className="slide-text">
                  <h2 className="slide-heading fade-in">{slide.heading}</h2>
                  <p className="slide-description fade-in">{slide.content}</p>
                  <div className="slide-button fade-in">
                    <a href={slide.buttonUrl} className="btn btn-primary">
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <div className="slider-controls">
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;