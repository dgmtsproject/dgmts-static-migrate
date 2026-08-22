import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Eye, EyeOff, Upload, Trash2, Edit, Plus, ArrowLeft } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import { slugifyName } from '../../utils/aboutLeaders'
import '../TeamEmployeesAdminPage/TeamEmployeesAdminPage.css'
import './TeamLeadersAdminPage.css'

async function uploadLeaderImage (file) {
  const fileExt = file.name.split('.').pop() || 'jpg'
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
  const attempts = [
    { bucket: 'employee-images', path: `leaders/${unique}` },
    { bucket: 'blog-images', path: `leaders/${unique}` }
  ]

  for (const { bucket, path } of attempts) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)
    if (!error && data) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      if (urlData?.publicUrl) return { url: urlData.publicUrl, error: null }
    }
  }
  return { url: null, error: { message: 'Upload failed for all buckets' } }
}

const emptyForm = {
  name: '',
  role: '',
  personType: 'department_head',
  degree: '',
  bio: '',
  about: '',
  imageUrl: '',
  slug: '',
  contactAddress: '',
  contactPhone: '',
  contactEmail: '',
  contactWebsite: '',
  sortOrder: 0,
  isActive: true
}

function TeamLeadersAdminPage () {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [view, setView] = useState('list')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (checkAdminSession()) setLoggedIn(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loggedIn) fetchRows()
  }, [loggedIn])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const fetchRows = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('about_leaders').select('*')
      if (error) throw error
      const list = data || []
      list.sort((a, b) => {
        if (a.person_type !== b.person_type) {
          return a.person_type === 'president' ? -1 : 1
        }
        return (a.sort_order || 0) - (b.sort_order || 0)
      })
      setRows(list)
    } catch (err) {
      console.error(err)
      setMessage({
        type: 'error',
        text: 'Could not load leadership. Run sql/create_about_leaders.sql on the VPS Postgres (dgmts_static_db) and allow table about_leaders in the Flask API, then reload.'
      })
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    if (await verifyAdminPassword(password)) {
      setLoggedIn(true)
      setPassword('')
    } else {
      setMessage({ type: 'error', text: 'Invalid password' })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setForm({
      name: row.name || '',
      role: row.role || '',
      personType: row.person_type || 'department_head',
      degree: row.degree || '',
      bio: row.bio || '',
      about: row.about || '',
      imageUrl: row.image_url || '',
      slug: row.slug || '',
      contactAddress: row.contact_address || '',
      contactPhone: row.contact_phone || '',
      contactEmail: row.contact_email || '',
      contactWebsite: row.contact_website || '',
      sortOrder: row.sort_order ?? 0,
      isActive: row.is_active !== false
    })
    setView('edit')
    setMessage({ type: '', text: '' })
  }

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Choose an image file' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Max file size 10MB' })
      return
    }
    setUploading(true)
    setMessage({ type: '', text: '' })
    const { url, error } = await uploadLeaderImage(file)
    setUploading(false)
    if (error || !url) {
      setMessage({ type: 'error', text: error?.message || 'Upload failed' })
      return
    }
    setField('imageUrl', url)
    setMessage({ type: 'success', text: 'Image uploaded' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) {
      setMessage({ type: 'error', text: 'Name and title are required' })
      return
    }
    if (!form.imageUrl.trim()) {
      setMessage({ type: 'error', text: 'Add a photo (upload or paste a URL)' })
      return
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      person_type: form.personType,
      degree: form.degree.trim() || null,
      bio: form.bio.trim() || null,
      about: form.about.trim() || null,
      image_url: form.imageUrl.trim(),
      banner_url: form.imageUrl.trim(),
      slug: (form.slug.trim() || slugifyName(form.name)) || null,
      contact_address: form.contactAddress.trim() || null,
      contact_phone: form.contactPhone.trim() || null,
      contact_email: form.contactEmail.trim() || null,
      contact_website: form.contactWebsite.trim() || null,
      sort_order: Number(form.sortOrder) || 0,
      is_active: !!form.isActive
    }

    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      if (editingId != null) {
        const { error } = await supabase.from('about_leaders').update(payload).eq('id', editingId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated' })
      } else {
        const { error } = await supabase.from('about_leaders').insert([payload])
        if (error) throw error
        setMessage({ type: 'success', text: 'Added' })
      }
      resetForm()
      setView('list')
      await fetchRows()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || String(err) })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this person from the About leadership section?')) return
    try {
      const { error } = await supabase.from('about_leaders').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Deleted' })
      await fetchRows()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || String(err) })
    }
  }

  if (!loggedIn) {
    return (
      <div className="team-employees-admin-page">
        <div className="team-employees-login">
          <h2>About — President &amp; department heads</h2>
          <p className="login-hint">Admin password required</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="pw">Password</label>
              <div className="password-row">
                <input
                  id="pw"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button type="button" className="icon-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {message.text && <div className={`banner banner-${message.type}`}>{message.text}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? '…' : 'Login'}</button>
          </form>
          <Link to="/admin" className="back-dash">← Admin dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="team-employees-admin-page team-leaders-admin-page">
      <div className="team-employees-inner">
        <header className="team-employees-header">
          <div>
            <Link to="/admin" className="back-link"><ArrowLeft size={18} /> Dashboard</Link>
            <h1>About — President &amp; department heads</h1>
            <p>
              Edits the large President card and the Department Heads carousel on the About page, plus each <code>/team/…</code> profile.
              Photos go to VPS storage. Until this table has rows, the site still shows the built-in photos and bios.
            </p>
          </div>
          {view === 'list' && (
            <button type="button" className="btn-primary" onClick={() => { resetForm(); setView('add'); setMessage({ type: '', text: '' }) }}>
              <Plus size={18} /> Add person
            </button>
          )}
        </header>

        {message.text && view === 'list' && (
          <div className={`banner banner-${message.type}`}>{message.text}</div>
        )}

        {view === 'list' && (
          <div className="panel">
            {loading ? (
              <p className="muted">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="muted">No leadership rows yet. Add the President and each department head here to replace the hardcoded About section.</p>
            ) : (
              <table className="team-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Section</th>
                    <th>Active</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="thumb-cell">
                        {row.image_url ? (
                          <img src={row.image_url} alt="" className="thumb" />
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>{row.name}</td>
                      <td>{row.role}</td>
                      <td>{row.person_type === 'president' ? 'President card' : 'Department heads'}</td>
                      <td>{row.is_active === false ? 'No' : 'Yes'}</td>
                      <td className="actions">
                        <button type="button" className="btn-ghost" onClick={() => handleEdit(row)} aria-label="Edit"><Edit size={18} /></button>
                        <button type="button" className="btn-ghost danger" onClick={() => handleDelete(row.id)} aria-label="Delete"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(view === 'add' || view === 'edit') && (
          <div className="panel form-panel">
            <h2>{editingId ? 'Edit' : 'Add'} leader</h2>
            {message.text && <div className={`banner banner-${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name *</label>
                <input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Title / role *</label>
                <input value={form.role} onChange={(e) => setField('role', e.target.value)} placeholder="President, Director Operations, …" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>About section</label>
                  <select value={form.personType} onChange={(e) => setField('personType', e.target.value)}>
                    <option value="president">President card</option>
                    <option value="department_head">Department heads carousel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Display order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setField('sortOrder', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Degree / credentials line</label>
                <input value={form.degree} onChange={(e) => setField('degree', e.target.value)} placeholder="Ph.D. in Civil Engineering" />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} />
                  Active (shown on site)
                </label>
              </div>
              <div className="form-group">
                <label>Short bio (card text)</label>
                <textarea rows={4} value={form.bio} onChange={(e) => setField('bio', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Full profile (HTML allowed)</label>
                <textarea rows={10} value={form.about} onChange={(e) => setField('about', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Profile URL slug</label>
                <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="tariq-hamid" />
              </div>
              <div className="form-group">
                <label>Photo URL</label>
                <input value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="https://…" />
              </div>
              <div className="form-group">
                <label>Upload photo</label>
                {form.imageUrl ? <img src={form.imageUrl} alt="" className="leader-preview" /> : null}
                <label className="file-upload">
                  <Upload size={18} />
                  {uploading ? 'Uploading…' : 'Choose file'}
                  <input type="file" accept="image/*" onChange={handleImageFile} disabled={uploading} />
                </label>
              </div>
              <div className="form-group">
                <label>Contact address</label>
                <input value={form.contactAddress} onChange={(e) => setField('contactAddress', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input value={form.contactWebsite} onChange={(e) => setField('contactWebsite', e.target.value)} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" className="btn-secondary" onClick={() => { resetForm(); setView('list'); setMessage({ type: '', text: '' }) }}>
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

export default TeamLeadersAdminPage
