import { useState, useRef, useEffect } from 'react'; // referenced for environments not using automatic runtime
import './MeetTheTeam.css';
import { Link } from 'react-router-dom';
import { teamMembers } from '../../pages/TeamMemberPage/teamData.js';

const MeetTheTeam = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const teamRef = useRef(null);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const president = teamMembers.find(member => member.role === 'President');
  const team = teamMembers.filter(member => member.id !== president.id);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (isInView && !isHovering) {
      const interval = setInterval(() => {
        setActiveTeamMember(prev => (prev + 1) % team.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
      } else {
        setIsInView(false);
      }
    }, {
        threshold: 0.5 // Now animation triggers at 50% visibility
    });
    
    if (teamRef.current) {
      observer.observe(teamRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveTeamMember(prev => (prev + 1) % team.length);
    } else if (isRightSwipe) {
      setActiveTeamMember(prev => (prev - 1 + team.length) % team.length);
    }
  };

  const getCardAnimationClass = (index) => {
    if (index === activeTeamMember) return "scale-100 opacity-100 z-20";
    if (index === (activeTeamMember + 1) % team.length) return "translate-x-[80%] scale-95 opacity-60 z-10";
    if (index === (activeTeamMember - 1 + team.length) % team.length) return "translate-x-[-80%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };
  
  return (
    <>
      <div 
          ref={teamRef}
          className={`team-header ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
        <h2 className="team-carousel-title">
          Meet Our Department Heads
        </h2>
        <p className="team-carousel-subtitle">
          Our department heads bring extensive expertise and leadership to drive innovation and excellence in geotechnical engineering and related services.
        </p>
      </div>
      
      <div 
          className="team-carousel-wrapper" 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="team-carousel-inner">
            {team.map((member, index) => (
              <Link to={`/team/${member.id}`} key={member.id} className={`team-card-wrapper ${getCardAnimationClass(index)}`} style={{ transitionDelay: `${index * 50}ms` }}>
                <div className="team-card">
                  <div 
                    className="team-card-image"
                    style={{
                      backgroundImage: `url(${member.imageUrl})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  >
                  </div>
                  
                  <div className="team-card-content">
                    <div className="team-card-info">
                      <h4 className="team-info-name">
                        {member.name}
                      </h4>
                      <p className="team-info-role">{member.role}</p>
                    </div>
                    
                    <p className="team-member-bio">{member.bio}</p>
                    
                    <div className="team-card-footer">
                      <div className="team-tags-wrapper">
                        {member.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="team-tag" 
                            style={{ animationDelay: `${idx * 300}ms` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <span className="visit-profile-link">Visit Profile &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="team-dots">
            {team.map((_, idx) => (
              <button 
                key={idx} 
                className={`team-dot ${activeTeamMember === idx ? 'active' : ''}`} 
                onClick={() => setActiveTeamMember(idx)}
                aria-label={`Go to ${team[idx].name}`}
              />
            ))}
          </div>
        </div>
    </>
  );
};

export default MeetTheTeam;
