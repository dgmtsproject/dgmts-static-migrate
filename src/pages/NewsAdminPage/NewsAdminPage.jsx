import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Eye, EyeOff, Upload, X, ExternalLink, Newspaper, Trash2, Edit, Plus } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import './NewsAdminPage.css'

function NewsAdminPage() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(true)

    const [newsList, setNewsList] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [picture, setPicture] = useState('')
    const [slug, setSlug] = useState('')
    const [newsDate, setNewsDate] = useState(new Date().toISOString().split('T')[0])
    const [editingId, setEditingId] = useState(null)
    const [view, setView] = useState('list') // 'list', 'add', 'edit'
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
            fetchNews()
        }
    }, [loggedIn])

    const fetchNews = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('news_date', { ascending: false })

            if (error) throw error
            setNewsList(data || [])
        } catch (err) {
            console.error('Error fetching news:', err)
            setMessage({ type: 'error', text: 'Failed to load news: ' + err.message })
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

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' })
            return
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64 storage
            setMessage({ type: 'error', text: 'Image size must be less than 2MB for optimized loading' })
            return
        }

        setUploading(true)
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64data = reader.result
            setPicture(base64data)
            setImagePreview(base64data)
            setMessage({ type: 'success', text: 'Image loaded successfully!' })
            setUploading(false)
        }
        reader.onerror = () => {
            setMessage({ type: 'error', text: 'Failed to read image file' })
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }

    const getPreviewUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('data:') || url.startsWith('http')) return url;

        // Handle names that are mapped to specific assets
        if (url === 'drill-rig-news') return 'https://dullesgeotechnical.com/src/assets/drill-rig-news.jpeg';
        if (url === 'exhibition_news') return 'https://dullesgeotechnical.com/src/assets/exhibition_news.jpeg';

        // Clean up the URL: remove leading slash, then prefix with domain
        const cleanPath = url.replace(/^\/+/, '');
        if (cleanPath.startsWith('src/assets/')) {
            return `https://dullesgeotechnical.com/${cleanPath}`;
        }

        return url;
    }

    const removeImage = () => {
        setPicture('')
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

        /* Content is now optional
        if (!content.trim() || content.trim() === '<p><br></p>') {
            setMessage({ type: 'error', text: 'Content is required' })
            return
        }
        */

        if (!slug.trim()) {
            setMessage({ type: 'error', text: 'Slug is required' })
            return
        }

        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const newsData = {
                news_title: title.trim(),
                news_content: content.trim(),
                picture: picture.trim() || null,
                news_route: slug.trim(),
                news_date: newsDate
            }

            if (editingId) {
                const { error } = await supabase
                    .from('news')
                    .update(newsData)
                    .eq('id', editingId)

                if (error) throw error
                setMessage({ type: 'success', text: 'News item updated successfully!' })
            } else {
                const { error } = await supabase
                    .from('news')
                    .insert([newsData])

                if (error) throw error
                setMessage({ type: 'success', text: 'News item added successfully!' })
            }

            resetForm()
            fetchNews()
            setView('list')
        } catch (err) {
            console.error('Error saving news:', err)
            setMessage({ type: 'error', text: 'Failed to save news: ' + err.message })
        } finally {
            setSaving(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setContent('')
        setPicture('')
        setImagePreview('')
        setSlug('')
        setNewsDate(new Date().toISOString().split('T')[0])
        setEditingId(null)
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setTitle(item.news_title || '')
        setContent(item.news_content || '')
        setPicture(item.picture || '')
        setImagePreview(item.picture || '')
        setSlug(item.news_route || '')

        // Standardize date to YYYY-MM-DD for the html5 date picker
        let formattedDate = new Date().toISOString().split('T')[0];
        if (item.news_date) {
            // Take the first 10 characters (YYYY-MM-DD) from the stored string
            formattedDate = String(item.news_date).substring(0, 10);
        }
        setNewsDate(formattedDate)

        setView('edit')
        setMessage({ type: '', text: '' })
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this news item?')) return

        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id)

            if (error) throw error
            setMessage({ type: 'success', text: 'News item deleted successfully!' })
            fetchNews()
        } catch (err) {
            console.error('Error deleting news:', err)
            setMessage({ type: 'error', text: 'Failed to delete news: ' + err.message })
        }
    }

    if (loading && !loggedIn) {
        return (
            <div className="news-admin-page">
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    if (!loggedIn) {
        return (
            <div className="news-admin-page">
                <div className="news-admin-login">
                    <h2>News Management</h2>
                    <p>Please enter your admin password</p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
                        <button type="submit" className="btn-primary">Login</button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="news-admin-page">
            <div className="news-admin-container">
                <header className="news-admin-header">
                    <div className="header-info">
                        <h1>News Dashboard</h1>
                        <p>Manage announcements and company updates</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className={`btn-nav ${view === 'list' ? 'active' : ''}`}
                            onClick={() => { setView('list'); resetForm(); }}
                        >
                            All News
                        </button>
                        <button
                            className={`btn-nav ${view === 'add' ? 'active' : ''}`}
                            onClick={() => { setView('add'); resetForm(); }}
                        >
                            <Plus size={18} /> Add News
                        </button>
                        <Link to="/admin" className="btn-back">Back to Dashboard</Link>
                    </div>
                </header>

                {message.text && (
                    <div className={`message-banner ${message.type}`}>
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })}><X size={16} /></button>
                    </div>
                )}

                {view === 'list' && (
                    <div className="news-list-view">
                        {newsList.length === 0 ? (
                            <div className="empty-state">
                                <Newspaper size={48} />
                                <p>No news articles found. Start by adding one!</p>
                                <button className="btn-primary" onClick={() => setView('add')}>Add New News</button>
                            </div>
                        ) : (
                            <div className="news-table-wrapper">
                                <table className="news-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Route / Slug</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newsList.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="title-cell">
                                                        {item.picture && <img src={getPreviewUrl(item.picture)} alt="" className="mini-thumb" />}
                                                        <span>{item.news_title}</span>
                                                    </div>
                                                </td>
                                                <td><code>{item.news_route}</code></td>
                                                <td>{item.news_date ? (() => {
                                                    const [y, m, d] = String(item.news_date).split('-').map(Number);
                                                    return new Date(y, m - 1, d).toLocaleDateString();
                                                })() : ''}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <Link to={`/news/${item.news_route}`} target="_blank" className="btn-icon view" title="View Article">
                                                            <ExternalLink size={18} />
                                                        </Link>
                                                        <button className="btn-icon edit" onClick={() => handleEdit(item)} title="Edit Article">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button className="btn-icon delete" onClick={() => handleDelete(item.id)} title="Delete Article">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {(view === 'add' || view === 'edit') && (
                    <div className="news-form-view">
                        <h2>{view === 'edit' ? 'Edit News Article' : 'Create New News Article'}</h2>
                        <form onSubmit={handleSave} className="news-form">
                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter article title"
                                        required
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Date *</label>
                                    <input
                                        type="date"
                                        value={newsDate}
                                        onChange={(e) => setNewsDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Route / Slug *</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="auto-generated-from-title"
                                    required
                                />
                                <small>This determines the URL: {window.location.origin}/news/<strong>{slug || 'slug'}</strong></small>
                            </div>

                            <div className="form-group">
                                <label>Featured Image</label>
                                <div className="image-management">
                                    {imagePreview ? (
                                        <div className="preview-box">
                                            <img src={getPreviewUrl(imagePreview)} alt="Preview" />
                                            <button type="button" className="remove-img" onClick={removeImage}><X size={20} /></button>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <input
                                                type="file"
                                                id="news-img"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                hidden
                                            />
                                            <label htmlFor="news-img">
                                                <Upload size={32} />
                                                <span>{uploading ? 'Processing...' : 'Click to upload image'}</span>
                                                <small>Max size 2MB</small>
                                            </label>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={picture.startsWith('data:') ? '' : picture}
                                        onChange={(e) => {
                                            setPicture(e.target.value)
                                            setImagePreview(e.target.value)
                                        }}
                                        placeholder="Or paste external image URL here"
                                        className="url-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <div className="editor-container">
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Write your news article here..."
                                        modules={quillModules}
                                        formats={quillFormats}
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button type="button" className="btn-secondary" onClick={() => setView('list')}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingId ? 'Update Article' : 'Publish Article')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewsAdminPage
