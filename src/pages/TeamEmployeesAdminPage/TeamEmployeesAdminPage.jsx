import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Eye, EyeOff, Upload, Trash2, Edit, Plus, ArrowLeft } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import { ABOUT_EMPLOYEE_DEPARTMENTS } from '../../constants/aboutTeamDepartments'
import { ABOUT_EMPLOYEE_CARD_SPEC } from '../../constants/aboutEmployeeCardSpec'
import './TeamEmployeesAdminPage.css'

async function uploadEmployeeImage (file) {
  const fileExt = file.name.split('.').pop() || 'jpg'
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
  const attempts = [
    { bucket: 'employee-images', path: `employees/${unique}` },
    { bucket: 'blog-images', path: `employees/${unique}` }
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

function TeamEmployeesAdminPage () {
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
  const [name, setName] = useState('')
  const [department, setDepartment] = useState(ABOUT_EMPLOYEE_DEPARTMENTS[0])
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (checkAdminSession()) setLoggedIn(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loggedIn) fetchRows()
  }, [loggedIn])

  const departmentListIndex = (dept) => {
    const i = ABOUT_EMPLOYEE_DEPARTMENTS.indexOf(dept)
    return i === -1 ? 999 : i
  }

  const fetchRows = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('about_employees')
        .select('*')

      if (error) throw error
      const list = data || []
      list.sort((a, b) => {
        const d = departmentListIndex(a.department) - departmentListIndex(b.department)
        if (d !== 0) return d
        return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
      })
      setRows(list)
    } catch (err) {
      console.error(err)
      setMessage({
        type: 'error',
        text:
          'Could not load team employees. Create table `about_employees` on the VPS and allow it in the Flask API, or use the static images until then.'
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
    setName('')
    setDepartment(ABOUT_EMPLOYEE_DEPARTMENTS[0])
    setImageUrl('')
    setImagePreview('')
    setIsActive(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setName(row.name || '')
    setDepartment(row.department || ABOUT_EMPLOYEE_DEPARTMENTS[0])
    setImageUrl(row.image_url || '')
    setImagePreview(row.image_url || '')
    setIsActive(row.is_active !== false)
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
    const { url, error } = await uploadEmployeeImage(file)
    setUploading(false)
    if (error || !url) {
      setMessage({ type: 'error', text: error?.message || 'Upload failed' })
      return
    }
    setImageUrl(url)
    setImagePreview(url)
    setMessage({ type: 'success', text: 'Image uploaded' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' })
      return
    }
    if (!imageUrl.trim()) {
      setMessage({ type: 'error', text: 'Add an image URL or upload a file' })
      return
    }

    const payload = {
      name: name.trim(),
      department,
      image_url: imageUrl.trim(),
      sort_order: 0,
      is_active: !!isActive
    }

    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      if (editingId != null) {
        const { error } = await supabase.from('about_employees').update(payload).eq('id', editingId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Updated' })
      } else {
        const { error } = await supabase.from('about_employees').insert([payload])
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
    if (!window.confirm('Remove this team member from the database?')) return
    try {
      const { error } = await supabase.from('about_employees').delete().eq('id', id)
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
          <h2>Team / About — Employees</h2>
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
    <div className="team-employees-admin-page">
      <div className="team-employees-inner">
        <header className="team-employees-header">
          <div>
            <Link to="/admin" className="back-link"><ArrowLeft size={18} /> Dashboard</Link>
            <h1>About — employee grid</h1>
            <p>Photos are stored via the VPS storage API (bucket <code>employee-images</code> preferred). Rows live in <code>about_employees</code>. On the public About page, people are listed <strong>alphabetically by name</strong> within each department.</p>
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
              <p className="muted">No rows yet. The public site will fall back to bundled images under <code>src/assets/employees-pictures/</code> until you add records.</p>
            ) : (
              <table className="team-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Department</th>
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
                      <td>{row.department}</td>
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
            <h2>{editingId ? 'Edit' : 'Add'} employee</h2>
            {message.text && <div className={`banner banner-${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {ABOUT_EMPLOYEE_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  Active (shown on site)
                </label>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value) }} placeholder="https://…" />
              </div>
              <div className="form-group upload-image-section">
                <label>Upload image</label>
                <div className="upload-spec-layout">
                  <div className="card-spec-panel">
                    <p className="card-spec-title">How photos appear on About → Team</p>
                    <p className="card-spec-lead">
                      Grid tiles are at least <strong>{ABOUT_EMPLOYEE_CARD_SPEC.gridMinColPx}px</strong> wide;
                      the photo strip uses a fixed <strong>{ABOUT_EMPLOYEE_CARD_SPEC.photoHeightDefaultPx}px</strong> height on desktop.
                      CSS uses <code>background-size: {ABOUT_EMPLOYEE_CARD_SPEC.fitMode}</code>
                      (whole image stays visible; letterboxing is normal).
                    </p>
                    <p className="card-spec-sub">
                      Photo strip height steps down on smaller viewports (after{' '}
                      <strong>{ABOUT_EMPLOYEE_CARD_SPEC.photoHeightDefaultPx}px</strong> default above 1400px):
                    </p>
                    <ul className="card-spec-breakpoints">
                      {ABOUT_EMPLOYEE_CARD_SPEC.photoHeightsByBreakpoint.map(({ maxWidthPx, heightPx }) => (
                        <li key={maxWidthPx}>
                          viewport ≤ <strong>{maxWidthPx}px</strong> → <strong>{heightPx}px</strong> tall
                        </li>
                      ))}
                    </ul>
                    <p className="card-spec-tip">
                      Tip: square portraits around <strong>400×400px</strong> or wider shots at least{' '}
                      <strong>{ABOUT_EMPLOYEE_CARD_SPEC.gridMinColPx}×{ABOUT_EMPLOYEE_CARD_SPEC.photoHeightDefaultPx}px</strong> look crisp on retina after scaling.
                    </p>
                  </div>
                  <div className="card-preview-column">
                    <p className="card-preview-label">
                      Live preview (desktop slot {ABOUT_EMPLOYEE_CARD_SPEC.gridMinColPx}×{ABOUT_EMPLOYEE_CARD_SPEC.photoHeightDefaultPx}px)
                    </p>
                    <div
                      className="employee-card-preview-frame"
                      style={{
                        width: ABOUT_EMPLOYEE_CARD_SPEC.gridMinColPx,
                        height: ABOUT_EMPLOYEE_CARD_SPEC.photoHeightDefaultPx
                      }}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="" className="employee-card-preview-img" />
                      ) : (
                        <span className="employee-card-preview-placeholder">Upload or paste URL to preview</span>
                      )}
                    </div>
                  </div>
                </div>
                <label className="file-upload file-upload-below-spec">
                  <Upload size={18} />
                  {uploading ? 'Uploading…' : 'Choose file'}
                  <input type="file" accept="image/*" onChange={handleImageFile} disabled={uploading} />
                </label>
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

export default TeamEmployeesAdminPage
