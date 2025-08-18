import './ServiceMap.css';

const locations = [
  { name: 'Virginia', icon: '🏛️' },
  { name: 'Maryland', icon: '🌊' },
  { name: 'Washington DC', icon: '🏛️' },
];

export default function ServiceMap() {
  return (
    <div className="service-locations-container">
      <div className="locations-grid">
        {locations.map((location, index) => (
          <div key={location.name} className="location-chip" style={{ animationDelay: `${index * 0.2}s` }}>
            <span className="sp-location-icon">{location.icon}</span>
            <span className="sp-location-name">{location.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
