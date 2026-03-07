import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Search, MapPin, Clock, Calendar, Video } from 'lucide-react'
import './EventsPage.css'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all') // all, upcoming, past, online

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by type
    const now = new Date()
    if (selectedFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.event_date) >= now)
    } else if (selectedFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.event_date) < now)
    } else if (selectedFilter === 'online') {
      filtered = filtered.filter(event => event.is_online)
    }

    // Sort: upcoming events first (ascending), past events after (descending)
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.event_date)
      const dateB = new Date(b.event_date)
      const nowDate = new Date()

      const aIsUpcoming = dateA >= nowDate
      const bIsUpcoming = dateB >= nowDate

      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1
      if (aIsUpcoming && bIsUpcoming) return dateA - dateB // ascending for upcoming
      return dateB - dateA // descending for past
    })

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedFilter])

  const filterByType = useCallback(() => {
    let filtered = events
    const now = new Date()

    if (selectedFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.event_date) >= now)
    } else if (selectedFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.event_date) < now)
    } else if (selectedFilter === 'online') {
      filtered = filtered.filter(event => event.is_online)
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.event_date)
      const dateB = new Date(b.event_date)
      const nowDate = new Date()

      const aIsUpcoming = dateA >= nowDate
      const bIsUpcoming = dateB >= nowDate

      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1
      if (aIsUpcoming && bIsUpcoming) return dateA - dateB
      return dateB - dateA
    })

    setFilteredEvents(filtered)
  }, [events, selectedFilter])

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterByType()
  }, [filterByType])

  const handleSearch = () => {
    applyFilters()
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter === selectedFilter ? 'all' : filter)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Handle both YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss
    const datePart = String(dateString).split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return '';
    if (!String(dateString).includes('T')) return '00:00 AM';

    // For time, we actually want to preserve the hours/minutes from the string
    // regardless of timezone shift if we are treating the stored time as "floating" 
    // or local to the event location.
    const timePart = String(dateString).split('T')[1];
    const [hours, minutes] = timePart.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date()
  }

  const getExcerpt = (text, maxLength = 150) => {
    if (!text) return ''
    // Strip HTML if any
    const doc = new DOMParser().parseFromString(text, 'text/html')
    const plainText = doc.body.textContent || text
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText
  }

  if (loading) {
    return (
      <div className="events-page bg-texture">
        <div className="container">
          <div className="events-layout">
            <div className="events-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <article key={i} className="event-card skeleton">
                  <div className="event-card-image skeleton-image" />
                  <div className="event-card-content">
                    <div className="event-meta">
                      <span className="event-date"><span className="skeleton-line short" /></span>
                      <span className="event-status"><span className="skeleton-line" style={{ width: '80px' }} /></span>
                    </div>
                    <h2 className="event-title">
                      <span className="skeleton-line title" />
                    </h2>
                    <p className="event-excerpt">
                      <span className="skeleton-line" />
                      <span className="skeleton-line" />
                    </p>
                    <div className="event-details">
                      <span className="skeleton-line small" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="events-sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Search</h3>
                <form className="search-form">
                  <input type="text" placeholder="Search events..." />
                  <button type="submit">Search</button>
                </form>
              </div>
              <div className="sidebar-widget">
                <h3 className="widget-title">Filter Events</h3>
                <ul className="filter-list">
                  <li className="skeleton-line"></li>
                  <li className="skeleton-line"></li>
                  <li className="skeleton-line"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="events-page bg-texture">
        <div className="container">
          <div className="error">Error loading events: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="events-page bg-texture">
      <div className="container">
        <header className="events-header">
          <h1>Events & Workshops</h1>
          <p>DGMTS events, workshops, and webinars to stay connected with the industry.</p>
        </header>

        <div className="events-layout">
          <div className="events-main">
            {filteredEvents.length === 0 ? (
              <div className="no-events">
                <h3>No events found</h3>
                <p>Try adjusting your search or filter options.</p>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <article key={event.id} className={`event-card ${!isUpcoming(event.event_date) ? 'past-event' : ''}`}>
                    {event.image_url && (
                      <div className="event-card-image">
                        <img src={event.image_url} alt={event.title} />
                        {event.is_featured && (
                          <span className="featured-badge">Featured</span>
                        )}
                      </div>
                    )}
                    {!event.image_url && (
                      <div className="event-card-image event-card-image-placeholder">
                        <Calendar size={48} />
                        {event.is_featured && (
                          <span className="featured-badge">Featured</span>
                        )}
                      </div>
                    )}
                    <div className="event-card-content">
                      <div className="event-meta">
                        <span className={`event-status ${isUpcoming(event.event_date) ? 'upcoming' : 'past'}`}>
                          {isUpcoming(event.event_date) ? 'Upcoming' : 'Past Event'}
                        </span>
                        {event.is_online && (
                          <span className="event-type online">
                            <Video size={12} /> Online
                          </span>
                        )}
                      </div>
                      <h2 className="event-title">
                        <Link to={`/events/${event.slug || event.id}`}>{event.title}</Link>
                      </h2>
                      <p className="event-excerpt">{getExcerpt(event.description)}</p>
                      <div className="event-details">
                        <div className="event-detail">
                          <Calendar size={14} />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="event-detail">
                          <Clock size={14} />
                          <span>{formatTime(event.event_date)}{event.duration ? ` • ${event.duration}` : ''}</span>
                        </div>
                        {event.location && (
                          <div className="event-detail">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <Link to={`/events/${event.slug || event.id}`} className="view-event">
                        View Details →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="events-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">Search</h3>
              <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit"><Search size={16} /></button>
              </form>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Filter Events</h3>
              <ul className="filter-list">
                <li
                  className={selectedFilter === 'all' ? 'active' : ''}
                  onClick={() => handleFilterChange('all')}
                >
                  All Events
                </li>
                <li
                  className={selectedFilter === 'upcoming' ? 'active' : ''}
                  onClick={() => handleFilterChange('upcoming')}
                >
                  Upcoming Events
                </li>
                <li
                  className={selectedFilter === 'past' ? 'active' : ''}
                  onClick={() => handleFilterChange('past')}
                >
                  Past Events
                </li>
                <li
                  className={selectedFilter === 'online' ? 'active' : ''}
                  onClick={() => handleFilterChange('online')}
                >
                  Online Events
                </li>
              </ul>
            </div>

            <div className="sidebar-widget event-cta">
              <h3 className="widget-title">Stay Informed</h3>
              <p>Don't miss our upcoming events. Subscribe to our newsletter for updates.</p>
              <Link to="/blog" className="cta-button">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsPage
