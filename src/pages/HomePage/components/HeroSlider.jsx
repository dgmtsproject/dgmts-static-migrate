import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import sliderImage1 from "../../../assets/gallery/photo-107.jpg";
import sliderImage2 from "../../../assets/gallery/photo-44.jpg";
import sliderImage3 from "../../../assets/gallery/photo-64.jpg";




const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: sliderImage1,
      heading: 'Leading Geotechnical Engineering Solutions',
      content: 'Providing comprehensive geotechnical engineering, materials testing, and construction services across Virginia, Maryland, and Washington DC.',
      buttonText: 'Learn More',
      buttonUrl: '/about',
      position: 'center'
    },
    {
      image: sliderImage2,
      heading: 'Certified SWaM and MBE/DBE Firm',
      content: 'Established in 2012, DGMTS is your trusted partner for quality engineering services and materials testing with industry-leading certifications.',
      buttonText: 'Our Services',
      buttonUrl: '/services',
      position: 'left'
    },
    {
      image: sliderImage3,
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