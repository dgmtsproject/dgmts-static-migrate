import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import sliderImage1 from "../../../assets/gallery/photo-107.jpg";
import sliderImage2 from "../../../assets/gallery/photo-44.jpg";
import sliderImage3 from "../../../assets/gallery/photo-49.jpg";
import sliderImage4 from "../../../assets/gallery/photo-54.jpg";
import sliderImage5 from "../../../assets/gallery/photo-103.jpg";
import sliderImage6 from "../../../assets/gallery/photo-38.jpg";
import sliderImage7 from "../../../assets/gallery/photo-86.jpg";




const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: sliderImage1,
      heading: 'A SWaM and MBE/DBE Certified Firm',
      content: 'DGMTS geotechnical engineering team complements specialized expertise with knowledge of local and regional regulations and conditions.',
      buttonText: 'About Us',
      buttonUrl: '/about',
      position: 'center'
    },
        {
      image: sliderImage2,
      heading: 'Geotechnical Engineering',
      content: 'DGMTS provides expert design and civil engineering solutions to large-scale projects, including preliminary and design level geotechnical engineering services according to client requirements, environmental considerations and approved plans.',
      buttonText: 'Our Services',
      buttonUrl: '/services/geotechnical',
      position: 'left'
    },
    {
      image: sliderImage3,
      heading: 'Drilling',
      content: 'All of our drill rigs are equipped with 250 to 350 gallons water tanks on-board, state-of-the-art Automatic SPT Hammer to sample subsurface profile and undisturbed sampling soil and NQ rock coring capabilities.',
      buttonText: 'Learn More',
      buttonUrl: '/services/drilling-in-situ-testing',
      position: 'right'
    },
    {
      image: sliderImage4,
      heading: 'Instrumentation',
      content: 'DGMTS has extensive experience in instrumentation and can utilize a wide range of both traditional and advanced sensing technologies. Our instrumentation services include PDAs, Piezometers, Inclinometers, Vibration, Noise & Crack Monitoring.',
      buttonText: 'Our Services',
      buttonUrl: '/services/instrumentation-condition-surveys',
      position: 'center'
    },
    {
      image: sliderImage5,
      heading: 'Special Inspection',
      content: 'DGMTS provides Third-Party and Special Inspection for a wide range of items including single/multi-family dwellings and/or all modifications/renovations for building of any type, conforming to applicable codes and specifications requirements.',
      buttonText: 'Learn More',
      buttonUrl: '/services/construction-inspection-testing',
      position: 'left'
    },

    {
      image: sliderImage6,
      heading: 'Construction Materials Testing',
      content: 'DGMTS handles Quality Assurance/Quality Control and related construction inspection and testing of earthwork, concrete, asphalt, and steel associated with the construction of roads, airports, buildings, and other civil infrastructure.',
      buttonText: 'Learn More',
      buttonUrl: '/services/construction-inspection-testing',
      position: 'right'
    },
    {
      image: sliderImage7,
      heading: 'Laboratory Testing',
      content: 'DGMTS maintains and operates a complete Geotechnical and Materials Testing laboratory accredited by the American Association of State Highway and Transportation Officials (AASHTO). We also offer in-situ and PDA testing.',
      buttonText: 'Our Services',
      buttonUrl: '/services/laboratory-testing',
      position: 'center'
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