import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './AdminPage.css'

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rawHtmlContent, setRawHtmlContent] = useState('') // Store raw HTML separately
  const [imageUrl, setImageUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState('all') // 'all', 'add', 'edit'
  const [isHtmlMode, setIsHtmlMode] = useState(false) // Toggle between rich text and HTML

  // Enhanced ReactQuill modules configuration
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
    if (loggedIn) fetchBlogs()
  }, [loggedIn])

  const fetchBlogs = async () => {
    console.log('Fetching blogs...')
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Fetch blogs error:', error)
      alert('Failed to fetch blogs: ' + error.message)
    } else {
      console.log('Fetched blogs:', data)
      setBlogs(data || [])
    }
  }

  const doLogin = (e) => {
    e.preventDefault()
    const envUser = import.meta.env.VITE_ADMIN_USER
    const envPass = import.meta.env.VITE_ADMIN_PASS
    
    console.log('Environment check:', {
      envUser: envUser ? 'set' : 'not set',
      envPass: envPass ? 'set' : 'not set',
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'set' : 'not set',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'not set'
    })
    
    if (user === envUser && pass === envPass) {
      setLoggedIn(true)
      console.log('Login successful')
    } else {
      alert('Invalid credentials')
    }
  }

  const addOrUpdate = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    
    // Use raw HTML content if in HTML mode, otherwise use rich text content
    const finalContent = isHtmlMode ? rawHtmlContent : content
    
    if (!finalContent.trim() || finalContent.trim() === '<p><br></p>') {
      alert('Content is required')
      return
    }
    
    console.log('Attempting to save:', { title, content: finalContent })
    
    if (editingId) {
      const { data, error } = await supabase.from('blogs').update({ 
        title, 
        content: finalContent, 
        image_url: imageUrl 
      }).eq('id', editingId)
      if (error) {
        console.error('Update error:', error)
        alert('Update failed: ' + error.message)
      } else {
        console.log('Update successful:', data)
        resetForm()
        fetchBlogs()
        setView('all')
      }
    } else {
      const { data, error } = await supabase.from('blogs').insert([{ 
        title, 
        content: finalContent, 
        image_url: imageUrl 
      }])
      if (error) {
        console.error('Insert error:', error)
        alert('Insert failed: ' + error.message)
      } else {
        console.log('Insert successful:', data)
        resetForm()
        fetchBlogs()
        setView('all')
      }
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setRawHtmlContent('')
    setImageUrl('')
    setEditingId(null)
    setIsHtmlMode(false)
  }

  const edit = (b) => {
    setEditingId(b.id)
    setTitle(b.title)
    setContent(b.content)
    setRawHtmlContent(b.content) // Set both content states
    setImageUrl(b.image_url || '')
    setView('edit')
    setIsHtmlMode(false)
  }

  const remove = async (id) => {
    if (!confirm('Delete this blog?')) return
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) alert('Delete failed')
    else fetchBlogs()
  }

  const cancelEdit = () => {
    resetForm()
    setView('all')
  }

  const showAddForm = () => {
    resetForm()
    setView('add')
  }

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to Rich Text
      // Update the rich text editor with the raw HTML content
      setContent(rawHtmlContent)
    } else {
      // Switching from Rich Text to HTML
      // Update the raw HTML with the rich text content
      setRawHtmlContent(content)
    }
    setIsHtmlMode(!isHtmlMode)
  }

  const handleRichTextChange = (value) => {
    setContent(value)
    setRawHtmlContent(value) // Keep both in sync
  }

  const handleRawHtmlChange = (value) => {
    setRawHtmlContent(value)
    // Don't sync back to rich text to avoid ReactQuill sanitization
  }

  if (!loggedIn) return (
    <div className="admin-login container">
      <h2>Admin Login</h2>
      <form onSubmit={doLogin}>
        <label>Username</label>
        <input value={user} onChange={e => setUser(e.target.value)} />
        <label>Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  )

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <button onClick={() => setView('all')} className={view === 'all' ? 'active' : ''}>All Blogs</button>
          <button onClick={showAddForm} className={view === 'add' ? 'active' : ''}>Add New Blog</button>
        </nav>
      </aside>
      <main className="content">
        {view === 'all' && (
          <div className="blogs-list">
            <h2>All Blogs</h2>
            {blogs.map(b => (
              <div key={b.id} className="blog-row">
                <div>
                  <strong>{b.title}</strong>
                  <div className="muted">{new Date(b.created_at).toLocaleString()}</div>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => edit(b)}>Edit</button>
                  <button className="btn" onClick={() => remove(b.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(view === 'add' || view === 'edit') && (
          <div className="blog-form-container">
            <h2>{view === 'edit' ? 'Edit Blog' : 'Add New Blog'}</h2>
            <form onSubmit={addOrUpdate} className="blog-form">
              <input 
                placeholder="Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
              <input 
                placeholder="Featured Image URL (optional)" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)}
                type="url"
              />
              
              {/* Editor Mode Toggle */}
              <div className="editor-controls">
                <button 
                  type="button" 
                  className={`btn mode-toggle ${isHtmlMode ? 'active' : ''}`}
                  onClick={toggleHtmlMode}
                  title={isHtmlMode ? 'Switch to Rich Text Editor' : 'Switch to HTML Code Editor'}
                >
                  {isHtmlMode ? '📝 Rich Text' : '</> HTML Code'}
                </button>
                {isHtmlMode && (
                  <div className="html-help">
                    <small>
                      💡 <strong>Tip:</strong> You can add images with: 
                      <code>&lt;img src="your-image-url" alt="description" /&gt;</code>
                    </small>
                  </div>
                )}
              </div>

              <div className="content-editor">
                {isHtmlMode ? (
                  // HTML Code Editor
                  <div className="html-editor">
                    <textarea
                      className="html-textarea"
                      value={rawHtmlContent}
                      onChange={e => handleRawHtmlChange(e.target.value)}
                      placeholder="Enter HTML content here...

Examples:
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<img src='https://example.com/image.jpg' alt='Description' />
<a href='https://example.com'>Link text</a>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>"
                      rows={20}
                    />
                  </div>
                ) : (
                  // Rich Text Editor
                  <div className="quill-container">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={handleRichTextChange}
                      placeholder="Write your blog content here..."
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                )}
              </div>

              {/* Preview Section */}
              {isHtmlMode && rawHtmlContent && (
                <div className="html-preview">
                  <h4>Preview:</h4>
                  <div 
                    className="preview-content" 
                    dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
                  />
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update Blog' : 'Add Blog'}
                </button>
                {(view === 'edit' || view === 'add') && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminPage