import React, { useState, useEffect, useRef } from 'react';
import './HeroSlider.css';
import HTMLFlipBook from 'react-pageflip';
import sliderImage1 from "../../../assets/gallery/photo-66.jpg";
import sliderImage2 from "../../../assets/gallery/photo-44.jpg";
import sliderImage3 from "../../../assets/gallery/photo-49.jpg";
import sliderImage4 from "../../../assets/instrumentation/project7_1.png";
import sliderImage5 from "../../../assets/gallery/photo-103.jpg";
import sliderImage6 from "../../../assets/gallery/photo-38.jpg";
import sliderImage7 from "../../../assets/gallery/photo-86.jpg";
import ourClientsImage from "../../../assets/our_clients_section.png";




const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const flipBookRef = useRef(null);
  const isAutoFlipping = useRef(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      image: ourClientsImage,
      heading: 'Trusted by Industry Leaders',
      content: 'DGMTS partners with premier engineering firms, construction companies, and government agencies across the Mid-Atlantic region, delivering exceptional geotechnical engineering and materials testing services.',
      buttonText: 'View Our Clients',
      buttonUrl: '/clients',
      position: 'left',
      hasShadow: true
    },
        {
      image: sliderImage2,
      heading: 'Geotechnical Engineering',
      content: 'DGMTS provides expert design and civil engineering solutions to large-scale projects, including preliminary and design level geotechnical engineering services according to client requirements, environmental considerations and approved plans.',
      buttonText: 'Our Services',
      buttonUrl: '/services/geotechnical',
      position: 'right'
    },
    {
      image: sliderImage3,
      heading: 'Drilling',
      content: 'All of our drill rigs are equipped with 250 to 350 gallons water tanks on-board, state-of-the-art Automatic SPT Hammer to sample subsurface profile and undisturbed sampling soil and NQ rock coring capabilities.',
      buttonText: 'Learn More',
      buttonUrl: '/services/drilling-in-situ-testing',
      position: 'center'
    },
    {
      image: sliderImage4,
      heading: 'Instrumentation',
      content: 'DGMTS has extensive experience in instrumentation and can utilize a wide range of both traditional and advanced sensing technologies. Our instrumentation services include PDAs, Piezometers, Inclinometers, Vibration, Noise & Crack Monitoring.',
      buttonText: 'Our Services',
      buttonUrl: '/services/instrumentation-condition-surveys',
      position: 'left'
    },
    {
      image: sliderImage5,
      heading: 'Special Inspection',
      content: 'DGMTS provides Third-Party and Special Inspection for a wide range of items including single/multi-family dwellings and/or all modifications/renovations for building of any type, conforming to applicable codes and specifications requirements.',
      buttonText: 'Learn More',
      buttonUrl: '/services/construction-inspection-testing',
      position: 'right'
    },

    {
      image: sliderImage6,
      heading: 'Construction Materials Testing',
      content: 'DGMTS handles Quality Assurance/Quality Control and related construction inspection and testing of earthwork, concrete, asphalt, and steel associated with the construction of roads, airports, buildings, and other civil infrastructure.',
      buttonText: 'Learn More',
      buttonUrl: '/services/construction-inspection-testing',
      position: 'center'
    },
    {
      image: sliderImage7,
      heading: 'Laboratory Testing',
      content: 'DGMTS maintains and operates a complete Geotechnical and Materials Testing laboratory accredited by the American Association of State Highway and Transportation Officials (AASHTO). We also offer in-situ and PDA testing.',
      buttonText: 'Our Services',
      buttonUrl: '/services/laboratory-testing',
      position: 'left'
    }
  ];

  // Auto-flip pages effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (flipBookRef.current && flipBookRef.current.pageFlip) {
        try {
          isAutoFlipping.current = true;
          
          setCurrentSlide((prevSlide) => {
            const nextSlide = (prevSlide + 1) % slides.length;
            
            // Use setTimeout to ensure state update happens before flip
            setTimeout(() => {
              if (flipBookRef.current && flipBookRef.current.pageFlip) {
                flipBookRef.current.pageFlip().flip(nextSlide);
              }
              // Reset flag after flip
              setTimeout(() => {
                isAutoFlipping.current = false;
              }, 200);
            }, 10);
            
            return nextSlide;
          });
          
        } catch (error) {
          console.error('Page flip error:', error);
          isAutoFlipping.current = false;
        }
      }
    }, 16000); // Doubled from 8000ms to 16000ms to allow more time to read

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    if (flipBookRef.current && flipBookRef.current.pageFlip) {
      flipBookRef.current.pageFlip().flip(index);
      setCurrentSlide(index);
    }
  };

  return (
    <section className="hero-slider">
      <div className="slider-container">
        <HTMLFlipBook
          ref={flipBookRef}
          width={windowWidth}
          height={windowWidth < 480 ? 500 : windowWidth < 768 ? 550 : windowWidth < 1024 ? 600 : 700}
          size="stretch"
          minWidth={windowWidth}
          maxWidth={windowWidth}
          minHeight={windowWidth < 480 ? 450 : windowWidth < 768 ? 500 : 600}
          maxHeight={windowWidth < 768 ? 600 : 800}
          maxShadowOpacity={0}
          showCover={false}
          mobileScrollSupport={true}
          className="hero-flip-book"
          onFlip={(e) => {
            // Only update state if this was a manual flip
            if (e && e.data !== undefined && !isAutoFlipping.current) {
              setCurrentSlide(e.data);
            }
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="hero-page">
              <img src={slide.image} alt={`Slide ${index + 1}`} className="hero-page-bg-image" />
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className={`slide-inner ${slide.position}`}>
                  <div className="slide-text">
                    <h2 
                      className="slide-heading"
                      style={slide.hasShadow ? { textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' } : {}}
                    >
                      {slide.heading}
                    </h2>
                    <p 
                      className="slide-description"
                      style={slide.hasShadow ? { textShadow: '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)' } : {}}
                    >
                      {slide.content}
                    </p>
                    <div className="slide-button">
                      <a href={slide.buttonUrl} className="btn btn-primary">
                        {slide.buttonText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HTMLFlipBook>
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