import React, { useState, useEffect, useRef } from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const [countersStarted, setCountersStarted] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { value: 500, title: 'Projects Completed', suffix: '+' },
    { value: 90, title: 'Team Members', suffix: '+' },
    { value: 12, title: 'Years of Experience', suffix: '' },
    { value: 15, title: 'Certifications', suffix: '+' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [countersStarted]);

  const Counter = ({ value, title, suffix }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (countersStarted) {
        const duration = 2000;
        const increment = value / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [countersStarted, value]);

    return (
      <div className="stat-item">
        <div className="stat-value">
          {count}{suffix}
        </div>
        <div className="stat-title">{title}</div>
      </div>
    );
  };

  return (
    <section 
      className="stats-section"
      ref={sectionRef}
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/3862379/pexels-photo-3862379.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600')`
      }}
    >
      <div className="stats-overlay"></div>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <Counter
              key={index}
              value={stat.value}
              title={stat.title}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;