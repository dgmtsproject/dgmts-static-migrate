import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Eye, EyeOff, Upload, X, ExternalLink } from 'lucide-react'
import './BlogAdminPage.css'

function BlogAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState('list') // 'list', 'add', 'edit'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [imagePreview, setImagePreview] = useState('')

  const ADMIN_PASSWORD = 'admin@dgmts123'

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
    if (loggedIn) {
      fetchBlogs()
      fetchCategories()
    }
  }, [loggedIn])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setMessage({ type: 'error', text: 'Failed to load blogs: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_name')
      
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true)
      setPassword('')
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Invalid password' })
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 10MB' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      // Try to upload to Supabase Storage first
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (!uploadError && uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          setImageUrl(urlData.publicUrl)
          setImagePreview(urlData.publicUrl)
          setMessage({ type: 'success', text: 'Image uploaded successfully!' })
          setUploading(false)
          return
        }
      }

      // Fallback: Try using a free image hosting service (ImgBB)
      // Note: You need to get a free API key from https://api.imgbb.com
      // For now, we'll use a data URL as fallback
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        // For large images, data URLs might not work well
        // Better to use a proper image hosting service
        setImageUrl(base64data)
        setImagePreview(base64data)
        setMessage({ 
          type: 'success', 
          text: 'Image loaded successfully!' 
        })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Error uploading image:', err)
      // Fallback to data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        setImageUrl(base64data)
        setImagePreview(base64data)
        setMessage({ 
          type: 'success', 
          text: 'Image loaded successfully!' 
        })
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
    // Auto-generate slug if slug is empty or matches the old title
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' })
      return
    }

    if (!content.trim() || content.trim() === '<p><br></p>') {
      setMessage({ type: 'error', text: 'Content is required' })
      return
    }

    if (!slug.trim()) {
      setMessage({ type: 'error', text: 'Slug is required' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        slug: slug.trim(),
        category: category || null
      }

      if (editingId) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingId)

        if (error) throw error
        setMessage({ type: 'success', text: 'Blog updated successfully!' })
      } else {
        // Insert new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert([blogData])
          .select()

        if (error) throw error

        const newBlog = data[0]
        // Notify subscribers
        try {
          await supabase.functions.invoke('notify-subscribers', {
            body: {
              blogId: newBlog.id,
              blogTitle: newBlog.title,
              blogSlug: newBlog.slug || newBlog.id,
              blogExcerpt: newBlog.content?.replace(/<[^>]+>/g, '').slice(0, 120) || '',
              blogAuthor: 'Admin'
            }
          })
          setMessage({ type: 'success', text: 'Blog added and subscribers notified!' })
        } catch (notifyError) {
          console.error('Error notifying subscribers:', notifyError)
          setMessage({ type: 'success', text: 'Blog added, but failed to notify subscribers.' })
        }
      }

      resetForm()
      fetchBlogs()
      setView('list')
    } catch (err) {
      console.error('Error saving blog:', err)
      setMessage({ type: 'error', text: 'Failed to save blog: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setImageUrl('')
    setImagePreview('')
    setSlug('')
    setCategory('')
    setEditingId(null)
  }

  const handleEdit = (blog) => {
    setEditingId(blog.id)
    setTitle(blog.title || '')
    setContent(blog.content || '')
    setImageUrl(blog.image_url || '')
    setImagePreview(blog.image_url || '')
    setSlug(blog.slug || '')
    setCategory(blog.category || blog.category_id || '')
    setView('edit')
    setMessage({ type: '', text: '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Blog deleted successfully!' })
      fetchBlogs()
    } catch (err) {
      console.error('Error deleting blog:', err)
      setMessage({ type: 'error', text: 'Failed to delete blog: ' + err.message })
    }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.category_name : 'Uncategorized'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!loggedIn) {
    return (
      <div className="blog-admin-page">
        <div className="blog-admin-login">
          <h2>Blog Management</h2>
          <p className="login-subtitle">Enter password to access blog management</p>
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
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-admin-page">
      <div className="blog-admin-container">
        <div className="blog-admin-header">
          <h2>Blog Management</h2>
          <p className="admin-subtitle">Create, edit, and manage blog posts</p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="blog-admin-nav">
          <button
            onClick={() => { setView('list'); resetForm(); }}
            className={view === 'list' ? 'active' : ''}
          >
            All Blogs
          </button>
          <button
            onClick={() => { setView('add'); resetForm(); }}
            className={view === 'add' ? 'active' : ''}
          >
            Add New Blog
          </button>
        </div>

        {view === 'list' && (
          <div className="blogs-list-section">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="empty-state">
                <p>No blogs found. Create your first blog post!</p>
              </div>
            ) : (
              <div className="blogs-table">
                <div className="table-header">
                  <div className="table-cell header-cell">Title</div>
                  <div className="table-cell header-cell">Category</div>
                  <div className="table-cell header-cell">Created</div>
                  <div className="table-cell header-cell">Actions</div>
                </div>
                {blogs.map((blog) => (
                  <div key={blog.id} className="table-row">
                    <div className="table-cell">
                      <strong>{blog.title}</strong>
                      <div className="muted">/{blog.slug || blog.id}</div>
                    </div>
                    <div className="table-cell">
                      {getCategoryName(blog.category)}
                    </div>
                    <div className="table-cell">
                      {formatDate(blog.created_at)}
                    </div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <Link
                          to={`/blog/${blog.slug || blog.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-small btn-view"
                        >
                          <ExternalLink size={14} />
                          View
                        </Link>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(blog.id)}
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
          <div className="blog-form-section">
            <h3>
              {view === 'edit' ? 'Edit Blog' : 'Add New Blog'}
              {title && (
                <span className="blog-heading-info">
                  {title}
                  {slug && <span className="blog-slug-display"> / {slug}</span>}
                </span>
              )}
            </h3>
            <form onSubmit={handleSave} className="blog-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter blog title"
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
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={saving}
                >
                  <option value="">Select Category (optional)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>
                <small className="form-hint">Select a category for this blog post</small>
              </div>

              <div className="form-group">
                <label htmlFor="image">Featured Image</label>
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

              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <div className="quill-container">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your blog content here..."
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>
                <small className="form-hint">Use the toolbar to format your content. You can add images, videos, links, and more.</small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || uploading}
                >
                  {saving ? 'Saving...' : (editingId ? 'Update Blog' : 'Create Blog')}
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
      </div>
    </div>
  )
}

export default BlogAdminPage

