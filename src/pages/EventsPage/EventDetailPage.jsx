import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { MapPin, Clock, Calendar, Video, ExternalLink } from 'lucide-react'
import './EventDetailPage.css'

function EventDetailPage() {
  const { id } = useParams() // This will be either slug or id
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        let data = null
        let fetchError = null

        // First try to fetch by slug
        const slugResponse = await supabase
          .from('events')
          .select('*')
          .eq('slug', id)
          .single()

        if (slugResponse.data) {
          data = slugResponse.data
        } else {
          // If no event found by slug, try by ID (for backward compatibility)
          const idResponse = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single()

          if (idResponse.error) {
            fetchError = idResponse.error
          } else {
            data = idResponse.data
          }
        }
        
        if (fetchError) throw fetchError
        setEvent(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching event:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  // Scroll to top when the page (id) changes
  useEffect(() => {
    try {
      window.scrollTo(0, 0)
    } catch {
      // ignore in non-browser environments
    }
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date()
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    
    if (!end || start.toDateString() === end.toDateString()) {
      // Same day event
      return `${formatDate(startDate)} • ${formatTime(startDate)}${end ? ` - ${formatTime(endDate)}` : ''}`
    } else {
      // Multi-day event
      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }
  }

  if (loading) {
    return (
      <div className="event-detail-page bg-texture">
        <div className="container">
          <div className="loading">Loading event details...</div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="event-detail-page bg-texture">
        <div className="container">
          <div className="error">
            {error || 'Event not found'}
          </div>
          <div className="back-link">
            <Link to="/events">← Back to Events</Link>
          </div>
        </div>
      </div>
    )
  }

  const upcoming = isUpcoming(event.event_date)

  return (
    <div className="event-detail-page bg-texture">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>→</span>
          <Link to="/events">Events</Link>
          <span>→</span>
          <span>{event.title}</span>
        </nav>

        <article className="event-detail-card">
          {event.image_url && (
            <div className="event-detail-image">
              <img src={event.image_url} alt={event.title} />
              {event.is_featured && (
                <span className="featured-badge">Featured Event</span>
              )}
            </div>
          )}
          
          <header className="event-detail-header">
            <div className="event-status-badge-container">
              <span className={`event-status-badge ${upcoming ? 'upcoming' : 'past'}`}>
                {upcoming ? 'Upcoming Event' : 'Past Event'}
              </span>
              {event.is_online && (
                <span className="event-type-badge online">
                  <Video size={14} /> Online Event
                </span>
              )}
            </div>
            
            <h1 className="event-detail-title">{event.title}</h1>
            
            <div className="event-info-grid">
              <div className="event-info-item">
                <Calendar size={20} />
                <div>
                  <strong>Date & Time</strong>
                  <span>{formatDateRange(event.event_date, event.end_date)}</span>
                </div>
              </div>
              
              {event.duration && (
                <div className="event-info-item">
                  <Clock size={20} />
                  <div>
                    <strong>Duration</strong>
                    <span>{event.duration}</span>
                  </div>
                </div>
              )}
              
              {event.location && (
                <div className="event-info-item">
                  <MapPin size={20} />
                  <div>
                    <strong>Location</strong>
                    <span>{event.location}</span>
                  </div>
                </div>
              )}
            </div>

            {event.registration_url && upcoming && (
              <a 
                href={event.registration_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="register-button"
              >
                Register Now <ExternalLink size={16} />
              </a>
            )}
          </header>

          {event.description && (
            <div className="event-description">
              <p>{event.description}</p>
            </div>
          )}

          {event.content && (
            <div 
              className="event-detail-content"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}

          {event.additional_images && event.additional_images.length > 0 && (
            <div className="event-images-gallery">
              <h3>Event Gallery</h3>
              <div className="event-images-grid">
                {event.additional_images.map((imgUrl, index) => (
                  <div key={index} className="event-gallery-item">
                    <img src={imgUrl} alt={`${event.title} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="event-detail-navigation">
          <Link to="/events" className="back-to-events">
            ← Back to All Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
