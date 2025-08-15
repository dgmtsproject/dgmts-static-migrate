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
  const [imageUrl, setImageUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState('all') // 'all', 'add', 'edit'

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
    if (!content.trim() || content.trim() === '<p><br></p>') {
      alert('Content is required')
      return
    }
    
    console.log('Attempting to save:', { title, content })
    
    if (editingId) {
      const { data, error } = await supabase.from('blogs').update({ title, content, image_url: imageUrl }).eq('id', editingId)
      if (error) {
        console.error('Update error:', error)
        alert('Update failed: ' + error.message)
      } else {
        console.log('Update successful:', data)
        setTitle('')
        setContent('')
        setImageUrl('')
        setEditingId(null)
        fetchBlogs()
        setView('all')
      }
    } else {
      const { data, error } = await supabase.from('blogs').insert([{ title, content, image_url: imageUrl }])
      if (error) {
        console.error('Insert error:', error)
        alert('Insert failed: ' + error.message)
      } else {
        console.log('Insert successful:', data)
        setTitle('')
        setContent('')
        setImageUrl('')
        fetchBlogs()
        setView('all')
      }
    }
  }

  const edit = (b) => {
    setEditingId(b.id)
    setTitle(b.title)
    setContent(b.content)
    setImageUrl(b.image_url || '')
    setView('edit')
  }

  const remove = async (id) => {
    if (!confirm('Delete this blog?')) return
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) alert('Delete failed')
    else fetchBlogs()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setImageUrl('')
    setView('all')
  }

  const showAddForm = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setImageUrl('')
    setView('add')
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
              <div className="quill-container">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  placeholder="Write your blog content here..."
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>
              <div>
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update' : 'Add'}
                </button>
                {(view === 'edit' || view === 'add') && (
                  <button type="button" className="btn" onClick={cancelEdit}>
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