import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './NewsletterSubscribersList.css';

const NewsletterSubscribersList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, [filterActive]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('subscribers')
        .select('*')
        .order('date_joined', { ascending: false });

      // Filter by active status if needed
      if (filterActive) {
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = subscriber.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = subscriber.email?.toLowerCase().includes(searchLower) || false;
    return nameMatch || emailMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.is_active).length;

  return (
    <main className="newsletter-subscribers-page bg-texture">
      <div className="subscribers-container">
        <div className="subscribers-header">
          <h1 className="subscribers-title">Newsletter Subscribers</h1>
          <p className="subscribers-subtitle">
            Manage and view all newsletter subscribers
          </p>
        </div>

        {/* Stats Section */}
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
            <div className="stat-value">{subscribers.length - activeSubscribers}</div>
            <div className="stat-label">Inactive Subscribers</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="subscribers-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
                className="filter-checkbox"
              />
              Show only active subscribers
            </label>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading subscribers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>Error loading subscribers: {error}</p>
            <button onClick={fetchSubscribers} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {/* Subscribers List */}
        {!loading && !error && (
          <div className="subscribers-list-container">
            {filteredSubscribers.length === 0 ? (
              <div className="empty-state">
                <p>No subscribers found.</p>
              </div>
            ) : (
              <div className="subscribers-table">
                <div className="table-header">
                  <div className="table-cell header-cell">#</div>
                  <div className="table-cell header-cell">Name</div>
                  <div className="table-cell header-cell">Email</div>
                  <div className="table-cell header-cell">Date Joined</div>
                  <div className="table-cell header-cell">Status</div>
                </div>
                {filteredSubscribers.map((subscriber, index) => (
                  <div key={subscriber.id || index} className="table-row">
                    <div className="table-cell">{index + 1}</div>
                    <div className="table-cell name-cell">
                      {subscriber.name || 'N/A'}
                    </div>
                    <div className="table-cell email-cell">
                      <a href={`mailto:${subscriber.email}`} className="email-link">
                        {subscriber.email}
                      </a>
                    </div>
                    <div className="table-cell date-cell">
                      {formatDate(subscriber.date_joined)}
                    </div>
                    <div className="table-cell status-cell">
                      <span className={`status-badge ${subscriber.is_active ? 'active' : 'inactive'}`}>
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default NewsletterSubscribersList;

