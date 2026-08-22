import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolioData } from '../context/DataContext'
import { sendAdminAction } from '../lib/scriptApi'

const SESSION_KEY = 'km_admin_key'

const EMPTY_PROJECT = {
  id: '', code: '', category: '', name: '', tagline: '', description: '',
  highlights: '', architecture: '', metrics: '', stack: '', link: '',
  githubLink: '', linkLabel: 'View', date: '', featured: false,
}

const EMPTY_EXPERIENCE = {
  id: '', role: '', org: '', date: '', location: '', type: 'Internship', points: '', skills: '',
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [keyInput, setKeyInput] = useState('')

  useEffect(() => {
    if (adminKey) verifyKey(adminKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyKey = async (key) => {
    setChecking(true)
    setLoginError('')
    const res = await sendAdminAction({ adminKey: key, resource: 'auth', action: 'verify' })
    setChecking(false)
    if (res.ok) {
      sessionStorage.setItem(SESSION_KEY, key)
      setAdminKey(key)
      setVerified(true)
    } else {
      sessionStorage.removeItem(SESSION_KEY)
      setLoginError(res.message || 'Invalid admin key.')
      setVerified(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    verifyKey(keyInput.trim())
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminKey('')
    setVerified(false)
    setKeyInput('')
  }

  if (!verified) {
    return (
      <div className="admin-page">
        <div className="admin-shell admin-login">
          <h1>Portfolio Admin</h1>
          <p>Enter your admin key to manage projects, experience, and messages.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
            {loginError && <div className="admin-login-error">{loginError}</div>}
            <button type="submit" className="btn btn-glow" style={{ width: '100%', justifyContent: 'center' }} disabled={checking}>
              {checking ? 'Checking…' : 'Unlock'}
            </button>
          </form>
          <p style={{ marginTop: 24 }}>
            <Link to="/" className="admin-back-link">← Back to site</Link>
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard adminKey={adminKey} onLogout={logout} />
}

function Dashboard({ adminKey, onLogout }) {
  const { profile, projects, experience, source, loading, refresh } = usePortfolioData()
  const [tab, setTab] = useState('projects')

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-header">
          <div>
            <h1>Portfolio Admin</h1>
            <p>Changes save to your Google Sheet and appear live on the site immediately.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/" className="admin-back-link">← View site</Link>
            <button className="admin-back-link" style={{ cursor: 'pointer' }} onClick={onLogout}>Log out</button>
          </div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-tabs">
            <button className={`admin-tab ${tab === 'projects' ? 'is-active' : ''}`} onClick={() => setTab('projects')}>Projects</button>
            <button className={`admin-tab ${tab === 'experience' ? 'is-active' : ''}`} onClick={() => setTab('experience')}>Experience</button>
            <button className={`admin-tab ${tab === 'profile' ? 'is-active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
            <button className={`admin-tab ${tab === 'messages' ? 'is-active' : ''}`} onClick={() => setTab('messages')}>Messages</button>
          </div>
          <span className={`admin-status-pill ${source === 'live' ? 'is-live' : 'is-seed'}`}>
            {loading ? 'Syncing…' : source === 'live' ? '● Live data (Google Sheet)' : '● Offline fallback data'}
          </span>
        </div>

        {tab === 'projects' && (
          <ProjectsTab adminKey={adminKey} projects={projects} refresh={refresh} />
        )}
        {tab === 'experience' && (
          <ExperienceTab adminKey={adminKey} experience={experience} refresh={refresh} />
        )}
        {tab === 'profile' && (
          <ProfileTab adminKey={adminKey} profile={profile} refresh={refresh} />
        )}
        {tab === 'messages' && (
          <MessagesTab adminKey={adminKey} />
        )}
      </div>
    </div>
  )
}

/* ---------------------------- Projects ---------------------------- */

function ProjectsTab({ adminKey, projects, refresh }) {
  const [editing, setEditing] = useState(null) // null | 'new' | project object
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = (p) => {
    setError('')
    setEditing({
      ...EMPTY_PROJECT,
      ...p,
      highlights: Array.isArray(p?.highlights) ? p.highlights.join('\n') : (p?.highlights || ''),
      architecture: Array.isArray(p?.architecture) ? p.architecture.join('\n') : (p?.architecture || ''),
      stack: Array.isArray(p?.stack) ? p.stack.join(', ') : (p?.stack || ''),
    })
  }

  const remove = async (p) => {
    if (!confirm(`Delete project "${p.name}"? This can't be undone.`)) return
    const res = await sendAdminAction({ adminKey, resource: 'project', action: 'delete', id: p.id })
    if (res.ok) refresh()
    else alert(res.message)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const item = {
      ...editing,
      id: editing.id || slugify(editing.name),
      highlights: splitLines(editing.highlights),
      architecture: splitLines(editing.architecture),
      stack: splitCommas(editing.stack),
    }
    const action = projects.some((p) => p.id === item.id) ? 'update' : 'create'
    const res = await sendAdminAction({ adminKey, resource: 'project', action, item, id: item.id })
    setSaving(false)
    if (res.ok) {
      setEditing(null)
      refresh()
    } else {
      setError(res.message)
    }
  }

  return (
    <div>
      <div className="admin-list">
        {projects.length === 0 && <div className="admin-empty bracket-panel">No projects yet — add your first one below.</div>}
        {projects.map((p) => (
          <div className="admin-row bracket-panel" key={p.id}>
            <div className="admin-row-main">
              <strong>{p.name}</strong>
              <span>{p.category} · {p.date}{p.featured ? ' · Featured' : ''}</span>
            </div>
            <div className="admin-row-actions">
              <button className="admin-btn" onClick={() => startEdit(p)}>Edit</button>
              <button className="admin-btn danger" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <form className="admin-form bracket-panel" onSubmit={save}>
          <div className="full"><strong>{editing.id ? 'Edit project' : 'New project'}</strong></div>

          <div><label>Name</label><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
          <div><label>Category</label><input required placeholder="e.g. AI & RAG" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>

          <div><label>Code (badge)</label><input placeholder="e.g. DWG-04" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></div>
          <div><label>Date</label><input placeholder="e.g. 2026" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>

          <div className="full"><label>Tagline</label><input required value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></div>
          <div className="full"><label>Description</label><textarea required rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>

          <div className="full">
            <label>Highlights (one per line)</label>
            <textarea rows={3} value={editing.highlights} onChange={(e) => setEditing({ ...editing, highlights: e.target.value })} />
          </div>
          <div className="full">
            <label>Architecture notes (one per line)</label>
            <textarea rows={3} value={editing.architecture} onChange={(e) => setEditing({ ...editing, architecture: e.target.value })} />
          </div>

          <div className="full"><label>Metrics line</label><input value={editing.metrics} onChange={(e) => setEditing({ ...editing, metrics: e.target.value })} /></div>
          <div className="full"><label>Tech stack (comma-separated)</label><input value={editing.stack} onChange={(e) => setEditing({ ...editing, stack: e.target.value })} /></div>

          <div><label>Primary link</label><input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} /></div>
          <div><label>Link label</label><input value={editing.linkLabel} onChange={(e) => setEditing({ ...editing, linkLabel: e.target.value })} /></div>
          <div className="full"><label>GitHub link (optional)</label><input value={editing.githubLink} onChange={(e) => setEditing({ ...editing, githubLink: e.target.value })} /></div>

          <div className="full" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" style={{ width: 'auto' }} id="featured" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            <label htmlFor="featured" style={{ margin: 0 }}>Featured project</label>
          </div>

          {error && <div className="full admin-login-error">{error}</div>}

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-glow" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button>
            <button type="button" className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn btn-ghost" onClick={() => startEdit(EMPTY_PROJECT)}>+ Add project</button>
      )}
    </div>
  )
}

/* ---------------------------- Experience ---------------------------- */

function ExperienceTab({ adminKey, experience, refresh }) {
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = (x) => {
    setError('')
    setEditing({
      ...EMPTY_EXPERIENCE,
      ...x,
      points: Array.isArray(x?.points) ? x.points.join('\n') : (x?.points || ''),
      skills: Array.isArray(x?.skills) ? x.skills.join(', ') : (x?.skills || ''),
    })
  }

  const remove = async (x) => {
    if (!confirm(`Delete "${x.role} — ${x.org}"?`)) return
    const res = await sendAdminAction({ adminKey, resource: 'experience', action: 'delete', id: x.id })
    if (res.ok) refresh()
    else alert(res.message)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const item = {
      ...editing,
      id: editing.id || slugify(`${editing.role}-${editing.org}`),
      points: splitLines(editing.points),
      skills: splitCommas(editing.skills),
    }
    const action = experience.some((x) => x.id === item.id) ? 'update' : 'create'
    const res = await sendAdminAction({ adminKey, resource: 'experience', action, item, id: item.id })
    setSaving(false)
    if (res.ok) {
      setEditing(null)
      refresh()
    } else {
      setError(res.message)
    }
  }

  return (
    <div>
      <div className="admin-list">
        {experience.length === 0 && <div className="admin-empty bracket-panel">No experience entries yet.</div>}
        {experience.map((x) => (
          <div className="admin-row bracket-panel" key={x.id || `${x.role}-${x.date}`}>
            <div className="admin-row-main">
              <strong>{x.role}</strong>
              <span>{x.org} · {x.date}</span>
            </div>
            <div className="admin-row-actions">
              <button className="admin-btn" onClick={() => startEdit(x)}>Edit</button>
              <button className="admin-btn danger" onClick={() => remove(x)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <form className="admin-form bracket-panel" onSubmit={save}>
          <div className="full"><strong>{editing.id ? 'Edit experience' : 'New experience'}</strong></div>

          <div><label>Role / title</label><input required value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
          <div><label>Organization</label><input required value={editing.org} onChange={(e) => setEditing({ ...editing, org: e.target.value })} /></div>

          <div><label>Date</label><input placeholder="e.g. June 2024" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>
          <div><label>Location</label><input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>

          <div className="full"><label>Type</label><input placeholder="e.g. Internship, Full-time" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} /></div>

          <div className="full">
            <label>Points (one per line)</label>
            <textarea rows={4} value={editing.points} onChange={(e) => setEditing({ ...editing, points: e.target.value })} />
          </div>
          <div className="full">
            <label>Skills (comma-separated)</label>
            <input value={editing.skills} onChange={(e) => setEditing({ ...editing, skills: e.target.value })} />
          </div>

          {error && <div className="full admin-login-error">{error}</div>}

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-glow" disabled={saving}>{saving ? 'Saving…' : 'Save entry'}</button>
            <button type="button" className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn btn-ghost" onClick={() => startEdit(EMPTY_EXPERIENCE)}>+ Add experience</button>
      )}
    </div>
  )
}

/* ---------------------------- Profile ---------------------------- */

function ProfileTab({ adminKey, profile, refresh }) {
  const [summary, setSummary] = useState(profile.summary || '')
  const [availability, setAvailability] = useState(profile.availability || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSummary(profile.summary || '')
    setAvailability(profile.availability || '')
  }, [profile.summary, profile.availability])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const res = await sendAdminAction({
      adminKey,
      resource: 'profile',
      action: 'update',
      item: { summary, availability },
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      refresh()
    } else {
      setError(res.message)
    }
  }

  return (
    <form className="admin-form bracket-panel" onSubmit={save}>
      <div className="full"><strong>Hero summary &amp; availability</strong></div>
      <p className="full admin-hint">These two fields update the hero section live. Other profile details (name, email, links) stay fixed in the codebase.</p>

      <div className="full">
        <label>Summary blurb</label>
        <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div className="full">
        <label>Availability status</label>
        <input value={availability} onChange={(e) => setAvailability(e.target.value)} />
      </div>

      {error && <div className="full admin-login-error">{error}</div>}
      {saved && <div className="full" style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>Saved.</div>}

      <div className="admin-form-actions">
        <button type="submit" className="btn btn-glow" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      </div>
    </form>
  )
}

/* ---------------------------- Messages ---------------------------- */

function MessagesTab({ adminKey }) {
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async () => {
    setError('')
    const res = await sendAdminAction({ adminKey, resource: 'messages', action: 'list' })
    if (res.ok) setMessages(res.data || [])
    else setError(res.message)
  }

  return (
    <div>
      <div className="admin-toolbar">
        <span className="admin-hint">Every submission is also logged as a row in your Google Sheet.</span>
        <button className="admin-btn" onClick={load}>Refresh</button>
      </div>
      {error && <div className="admin-login-error">{error}</div>}
      {messages === null && !error && <div className="admin-empty">Loading…</div>}
      {messages?.length === 0 && <div className="admin-empty bracket-panel">No messages yet.</div>}
      <div className="admin-messages-list">
        {messages?.map((m, i) => (
          <div className="bracket-panel admin-message-card" key={i}>
            <div className="meta">
              <span>{m.name} · {m.email}</span>
              <span>{m.timestamp}</span>
            </div>
            {m.budget && <p style={{ marginBottom: 8, color: 'var(--paper-dim)' }}>Budget/timeline: {m.budget}</p>}
            <p>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------- helpers ---------------------------- */

function splitLines(str) {
  return (str || '').split('\n').map((s) => s.trim()).filter(Boolean)
}
function splitCommas(str) {
  return (str || '').split(',').map((s) => s.trim()).filter(Boolean)
}
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `item-${Date.now()}`
}
