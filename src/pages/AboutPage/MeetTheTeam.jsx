import { useState, useEffect } from 'react';
import './MeetTheTeam.css';
import { Link } from 'react-router-dom';
import { profilePath } from '../../utils/aboutLeaders';

const MeetTheTeam = ({ members = [] }) => {
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const team = members;
  const minSwipeDistance = 50;

  useEffect(() => {
    setActiveTeamMember(0);
  }, [team.length]);

  useEffect(() => {
    if (team.length === 0) return undefined;
    const interval = setInterval(() => {
      setActiveTeamMember(prev => (prev + 1) % team.length);
    }, 2700);
    return () => clearInterval(interval);
  }, [team.length]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || team.length === 0) return;

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
    if (team.length === 0) return 'scale-90 opacity-0';
    if (index === activeTeamMember) return "scale-100 opacity-100 z-20";
    if (index === (activeTeamMember + 1) % team.length) return "translate-x-[80%] scale-95 opacity-60 z-10";
    if (index === (activeTeamMember - 1 + team.length) % team.length) return "translate-x-[-80%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };

  return (
    <>
      <div className="team-header opacity-100 translate-y-0">
        <h2 className="team-carousel-title">
          Meet Our Department Heads
        </h2>
        <p className="team-carousel-subtitle">
          Our department heads bring extensive expertise and leadership to drive innovation and excellence in geotechnical engineering and related services.
        </p>
      </div>

      {team.length > 0 && (
      <div
          className="team-carousel-wrapper"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="team-carousel-inner">
            {team.map((member, index) => (
              <Link to={profilePath(member)} key={member.id} className={`team-card-wrapper ${getCardAnimationClass(index)}`} style={{ transitionDelay: `${index * 50}ms` }}>
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
      )}
    </>
  );
};

export default MeetTheTeam;
