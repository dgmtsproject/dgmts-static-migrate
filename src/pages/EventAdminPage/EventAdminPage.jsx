import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Eye, EyeOff, Upload, ExternalLink, Calendar, MapPin, Clock, Video } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import './EventAdminPage.css'

function EventAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [duration, setDuration] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [registrationUrl, setRegistrationUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [additionalImages, setAdditionalImages] = useState([])
  
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState('list') // 'list', 'add', 'edit', 'preview'
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [imagePreview, setImagePreview] = useState('')

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': ['1', '2', '3', false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video', 'blockquote', 'code-block'
  ]

  useEffect(() => {
    const isAuthenticated = checkAdminSession()
    if (isAuthenticated) {
      setLoggedIn(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchEvents()
    }
  }, [loggedIn])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })
      
      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setMessage({ type: 'error', text: 'Failed to load events: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const isValid = await verifyAdminPassword(password)
    if (isValid) {
      setLoggedIn(true)
      setPassword('')
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Invalid password' })
    }
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 10MB' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`

      // Try uploading to event-images bucket first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
      }

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)

        if (urlData?.publicUrl) {
          setImageUrl(urlData.publicUrl)
          setImagePreview(urlData.publicUrl)
          setMessage({ type: 'success', text: 'Image uploaded successfully!' })
          setUploading(false)
          return
        }
      }

      // Fallback: Try blog-images bucket
      const { data: blogUploadData, error: blogUploadError } = await supabase.storage
        .from('blog-images')
        .upload(`events/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (blogUploadError) {
        console.error('Blog bucket upload error:', blogUploadError)
      }

      if (!blogUploadError && blogUploadData) {
        const { data: blogUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(`events/${fileName}`)

        if (blogUrlData?.publicUrl) {
          setImageUrl(blogUrlData.publicUrl)
          setImagePreview(blogUrlData.publicUrl)
          setMessage({ type: 'success', text: 'Image uploaded successfully!' })
          setUploading(false)
          return
        }
      }

      // Final fallback: Use data URL
      console.warn('Storage upload failed, falling back to base64')
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        setImageUrl(base64data)
        setImagePreview(base64data)
        setMessage({ type: 'warning', text: 'Image loaded locally (storage upload failed)' })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Error uploading image:', err)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        setImageUrl(base64data)
        setImagePreview(base64data)
        setMessage({ type: 'success', text: 'Image loaded successfully!' })
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl('')
    setImagePreview('')
  }

  const uploadImageToStorage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`

    // Try uploading to event-images bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName)

      if (urlData?.publicUrl) {
        return { url: urlData.publicUrl, error: null }
      }
    }

    // Fallback: Try blog-images bucket
    const { data: blogUploadData, error: blogUploadError } = await supabase.storage
      .from('blog-images')
      .upload(`events/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (!blogUploadError && blogUploadData) {
      const { data: blogUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`events/${fileName}`)

      if (blogUrlData?.publicUrl) {
        return { url: blogUrlData.publicUrl, error: null }
      }
    }

    // Final fallback: Use data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({ url: reader.result, error: null })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      setMessage({ type: 'error', text: 'Please select only image files' })
      return
    }

    const largeFiles = files.filter(file => file.size > 10 * 1024 * 1024)
    if (largeFiles.length > 0) {
      setMessage({ type: 'error', text: 'All images must be less than 10MB' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const uploadPromises = files.map(file => uploadImageToStorage(file))
      const results = await Promise.all(uploadPromises)
      
      const newImages = results.map(result => result.url).filter(Boolean)
      setAdditionalImages([...additionalImages, ...newImages])
      setMessage({ type: 'success', text: `${newImages.length} image(s) uploaded successfully!` })
    } catch (err) {
      console.error('Error uploading images:', err)
      setMessage({ type: 'error', text: 'Failed to upload some images: ' + err.message })
    } finally {
      setUploading(false)
    }
  }

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index)
    setAdditionalImages(newImages)
  }

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const combineDateAndTime = (date, time) => {
    if (!date) return null
    if (!time) time = '00:00'
    return `${date}T${time}:00`
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' })
      return
    }

    if (!eventDate) {
      setMessage({ type: 'error', text: 'Event date is required' })
      return
    }

    if (!slug.trim()) {
      setMessage({ type: 'error', text: 'Slug is required' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const eventData = {
        title: title.trim(),
        description: description.trim() || null,
        content: content.trim() || null,
        image_url: imageUrl.trim() || null,
        additional_images: additionalImages.length > 0 ? additionalImages : null,
        slug: slug.trim(),
        location: location.trim() || null,
        event_date: combineDateAndTime(eventDate, eventTime),
        end_date: endDate ? combineDateAndTime(endDate, endTime) : null,
        duration: duration.trim() || null,
        is_online: isOnline,
        registration_url: registrationUrl.trim() || null,
        is_featured: isFeatured,
        is_published: isPublished
      }

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId)

        if (error) throw error
        setMessage({ type: 'success', text: 'Event updated successfully!' })
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData])
          .select()

        if (error) throw error
        setMessage({ type: 'success', text: 'Event created successfully!' })
      }

      resetForm()
      fetchEvents()
      setView('list')
    } catch (err) {
      console.error('Error saving event:', err)
      setMessage({ type: 'error', text: 'Failed to save event: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setContent('')
    setImageUrl('')
    setImagePreview('')
    setAdditionalImages([])
    setSlug('')
    setLocation('')
    setEventDate('')
    setEventTime('')
    setEndDate('')
    setEndTime('')
    setDuration('')
    setIsOnline(false)
    setRegistrationUrl('')
    setIsFeatured(false)
    setIsPublished(true)
    setEditingId(null)
  }

  const extractDateAndTime = (isoString) => {
    if (!isoString) return { date: '', time: '' }
    const dateObj = new Date(isoString)
    const date = dateObj.toISOString().split('T')[0]
    const time = dateObj.toTimeString().slice(0, 5)
    return { date, time }
  }

  const handleEdit = (event) => {
    setEditingId(event.id)
    setTitle(event.title || '')
    setDescription(event.description || '')
    setContent(event.content || '')
    setImageUrl(event.image_url || '')
    setImagePreview(event.image_url || '')
    setAdditionalImages(event.additional_images || [])
    setSlug(event.slug || '')
    setLocation(event.location || '')
    
    const startDateTime = extractDateAndTime(event.event_date)
    setEventDate(startDateTime.date)
    setEventTime(startDateTime.time)
    
    const endDateTime = extractDateAndTime(event.end_date)
    setEndDate(endDateTime.date)
    setEndTime(endDateTime.time)
    
    setDuration(event.duration || '')
    setIsOnline(event.is_online || false)
    setRegistrationUrl(event.registration_url || '')
    setIsFeatured(event.is_featured || false)
    setIsPublished(event.is_published !== false)
    
    setView('edit')
    setMessage({ type: '', text: '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Event deleted successfully!' })
      fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
      setMessage({ type: 'error', text: 'Failed to delete event: ' + err.message })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date()
  }

  if (loading) {
    return (
      <div className="event-admin-page">
        <div className="event-admin-login">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div className="event-admin-page">
        <div className="event-admin-login">
          <h2>Event Management</h2>
          <p className="login-subtitle">Enter password to access event management</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoFocus
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {message.type === 'error' && (
              <div className="message message-error">{message.text}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="event-admin-page">
      <div className="event-admin-container">
        <div className="event-admin-header">
          <h2>Event Management</h2>
          <p className="admin-subtitle">Create, edit, and manage events and workshops</p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="event-admin-nav">
          <button
            onClick={() => { setView('list'); resetForm(); }}
            className={view === 'list' ? 'active' : ''}
          >
            All Events
          </button>
          <button
            onClick={() => { setView('add'); resetForm(); }}
            className={view === 'add' ? 'active' : ''}
          >
            Add New Event
          </button>
        </div>

        {view === 'list' && (
          <div className="events-list-section">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <p>No events found. Create your first event!</p>
              </div>
            ) : (
              <div className="events-table">
                <div className="table-header">
                  <div className="table-cell header-cell">Event</div>
                  <div className="table-cell header-cell">Date & Time</div>
                  <div className="table-cell header-cell">Status</div>
                  <div className="table-cell header-cell">Actions</div>
                </div>
                {events.map((event) => (
                  <div key={event.id} className="table-row">
                    <div className="table-cell">
                      <strong>{event.title}</strong>
                      <div className="muted">/{event.slug || event.id}</div>
                      {event.location && (
                        <div className="event-location-text">
                          <MapPin size={12} /> {event.location}
                        </div>
                      )}
                    </div>
                    <div className="table-cell">
                      <div className="event-date-info">
                        <Calendar size={14} />
                        {formatDate(event.event_date)}
                      </div>
                      {event.duration && (
                        <div className="muted">
                          <Clock size={12} /> {event.duration}
                        </div>
                      )}
                    </div>
                    <div className="table-cell">
                      <div className="status-badges">
                        <span className={`status-badge ${isUpcoming(event.event_date) ? 'upcoming' : 'past'}`}>
                          {isUpcoming(event.event_date) ? 'Upcoming' : 'Past'}
                        </span>
                        {event.is_online && (
                          <span className="status-badge online">
                            <Video size={12} /> Online
                          </span>
                        )}
                        {event.is_featured && (
                          <span className="status-badge featured">Featured</span>
                        )}
                        {!event.is_published && (
                          <span className="status-badge draft">Draft</span>
                        )}
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <Link
                          to={`/events/${event.slug || event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-small btn-view"
                        >
                          <ExternalLink size={14} />
                          View
                        </Link>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(view === 'add' || view === 'edit') && (
          <div className="event-form-section">
            <h3>
              {view === 'edit' ? 'Edit Event' : 'Add New Event'}
              {title && (
                <span className="event-heading-info">
                  {title}
                  {slug && <span className="event-slug-display"> / {slug}</span>}
                </span>
              )}
            </h3>
            <form onSubmit={handleSave} className="event-form">
              {/* Basic Info Section */}
              <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>
                
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter event title"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="slug">Slug *</label>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                    disabled={saving}
                  />
                  <small className="form-hint">URL-friendly identifier (auto-generated from title)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Short Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description for event cards"
                    rows={3}
                    disabled={saving}
                  />
                  <small className="form-hint">This appears on event cards in the listing page</small>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="form-section">
                <h4 className="form-section-title">Date & Time</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="eventDate">Start Date *</label>
                    <input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventTime">Start Time</label>
                    <input
                      id="eventTime"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    id="duration"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 Hours, Full Day, 3 Days"
                    disabled={saving}
                  />
                  <small className="form-hint">Human-readable duration (optional)</small>
                </div>
              </div>

              {/* Location Section */}
              <div className="form-section">
                <h4 className="form-section-title">Location</h4>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      disabled={saving}
                    />
                    <span>This is an online event</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location / Venue</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={isOnline ? "e.g., Zoom, Microsoft Teams" : "e.g., Conference Center, Riyadh"}
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="registrationUrl">Registration URL</label>
                  <input
                    id="registrationUrl"
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://example.com/register"
                    disabled={saving}
                  />
                  <small className="form-hint">External registration link (optional)</small>
                </div>
              </div>

              {/* Image Section */}
              <div className="form-section">
                <h4 className="form-section-title">Event Image</h4>
                
                <div className="form-group">
                  <div className="image-upload-section">
                    {imagePreview ? (
                      <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={removeImage}
                          disabled={saving || uploading}
                          aria-label="Remove image"
                          title="Remove image"
                        >
                          <span className="remove-icon-text">×</span>
                        </button>
                      </div>
                    ) : (
                      <div className="image-upload-area">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={saving || uploading}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="image" className="image-upload-label">
                          <Upload size={24} />
                          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        </label>
                        <small className="form-hint">Click to upload or paste image URL below</small>
                      </div>
                    )}
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value)
                        setImagePreview(e.target.value)
                      }}
                      placeholder="Or enter image URL directly"
                      disabled={saving || uploading || !!imagePreview}
                      className="image-url-input"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Images Section */}
              <div className="form-section">
                <h4 className="form-section-title">Additional Images Gallery</h4>
                
                <div className="form-group">
                  <div className="additional-images-upload-section">
                    <input
                      id="additionalImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImageUpload}
                      disabled={saving || uploading}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="additionalImages" className="image-upload-label secondary">
                      <Upload size={20} />
                      <span>{uploading ? 'Uploading...' : 'Upload Multiple Images'}</span>
                    </label>
                    <small className="form-hint">Select multiple images to create an event gallery</small>
                  </div>

                  {additionalImages.length > 0 && (
                    <div className="additional-images-grid">
                      {additionalImages.map((imgUrl, index) => (
                        <div key={index} className="additional-image-item">
                          <img src={imgUrl} alt={`Additional ${index + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-additional-image"
                            onClick={() => removeAdditionalImage(index)}
                            disabled={saving || uploading}
                            aria-label="Remove image"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="form-section">
                <h4 className="form-section-title">Event Details</h4>
                
                <div className="form-group">
                  <label htmlFor="content">Full Content</label>
                  <div className="quill-container">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      placeholder="Write detailed event information here..."
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                  <small className="form-hint">Detailed description shown on the event detail page</small>
                </div>
              </div>

              {/* Settings Section */}
              <div className="form-section">
                <h4 className="form-section-title">Settings</h4>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      disabled={saving}
                    />
                    <span>Featured Event</span>
                  </label>
                  <small className="form-hint">Featured events are highlighted in the listing</small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      disabled={saving}
                    />
                    <span>Published</span>
                  </label>
                  <small className="form-hint">Unpublished events are saved as drafts</small>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || uploading}
                >
                  {saving ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => setView('preview')}
                  disabled={saving || !title}
                >
                  Preview Event
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setView('list'); resetForm(); }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'preview' && (
          <div className="event-preview-section">
            <div className="event-preview-header">
              <h3>Event Preview</h3>
              <div className="preview-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setView(editingId ? 'edit' : 'add')}
                >
                  ← Back to Edit
                </button>
              </div>
            </div>
            
            <div className="event-preview-content">
              {/* Simulated Event Detail Page */}
              <div className="event-detail-preview-card">
                {imagePreview && (
                  <div className="event-detail-image">
                    <img src={imagePreview} alt={title} />
                    {isFeatured && (
                      <span className="featured-badge">Featured Event</span>
                    )}
                  </div>
                )}
                
                <header className="event-detail-header">
                  <div className="event-status-badge-container">
                    <span className={`event-status-badge ${isUpcoming(eventDate) ? 'upcoming' : 'past'}`}>
                      {isUpcoming(eventDate) ? 'Upcoming Event' : 'Past Event'}
                    </span>
                    {isOnline && (
                      <span className="event-type-badge online">
                        <Video size={14} /> Online Event
                      </span>
                    )}
                  </div>
                  
                  <h1 className="event-detail-title">{title || 'Event Title'}</h1>
                  
                  <div className="event-info-grid">
                    {eventDate && (
                      <div className="event-info-item">
                        <Calendar size={20} />
                        <div>
                          <strong>Date & Time</strong>
                          <span>{formatDate(combineDateAndTime(eventDate, eventTime))}</span>
                        </div>
                      </div>
                    )}
                    
                    {duration && (
                      <div className="event-info-item">
                        <Clock size={20} />
                        <div>
                          <strong>Duration</strong>
                          <span>{duration}</span>
                        </div>
                      </div>
                    )}
                    
                    {location && (
                      <div className="event-info-item">
                        <MapPin size={20} />
                        <div>
                          <strong>Location</strong>
                          <span>{location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {registrationUrl && isUpcoming(eventDate) && (
                    <a 
                      href={registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="register-button"
                    >
                      Register Now <ExternalLink size={16} />
                    </a>
                  )}
                </header>

                {description && (
                  <div className="event-description">
                    <p>{description}</p>
                  </div>
                )}

                {content && (
                  <div 
                    className="event-detail-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}

                {additionalImages.length > 0 && (
                  <div className="event-images-gallery">
                    <h3>Event Gallery</h3>
                    <div className="event-images-grid">
                      {additionalImages.map((imgUrl, index) => (
                        <div key={index} className="event-gallery-item">
                          <img src={imgUrl} alt={`${title} - Image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventAdminPage
