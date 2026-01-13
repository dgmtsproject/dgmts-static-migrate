const StatsSection = ({ totalSubscribers, activeSubscribers, groupCount }) => {
  return (
    <div className="subscribers-stats">
      <div className="stat-card">
        <div className="stat-value">{totalSubscribers}</div>
        <div className="stat-label">Total Subscribers</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{activeSubscribers}</div>
        <div className="stat-label">Active Subscribers</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{totalSubscribers - activeSubscribers}</div>
        <div className="stat-label">Inactive Subscribers</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{groupCount}</div>
        <div className="stat-label">Groups</div>
      </div>
    </div>
  );
};

export default StatsSection;
