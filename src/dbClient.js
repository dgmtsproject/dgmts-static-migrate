/**
 * Drop-in replacement for @supabase/supabase-js used by the static site.
 * Talks to Flask on the VPS: /api/dgmts-static/data, /storage, /functions/...
 */
const API_BASE = (import.meta.env.VITE_DGMTS_API_URL || 'https://imsite.dullesgeotechnical.com').replace(/\/$/, '')

async function postJson (path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  let j = null
  try {
    j = await r.json()
  } catch {
    j = null
  }
  return { ok: r.ok, j }
}

class QueryBuilder {
  constructor (state) {
    this.s = {
      filters: [],
      order: [],
      ...state
    }
  }

  select (columns = '*') {
    if (this.s.op === 'insert' && this.s.insertRows) {
      return new QueryBuilder({ ...this.s, insertReturning: true, returnColumns: columns || '*' })
    }
    if (this.s.op === 'update' && this.s.patch) {
      return new QueryBuilder({ ...this.s, updateReturning: true, returnColumns: columns || '*' })
    }
    if (this.s.op === 'delete') {
      return new QueryBuilder({ ...this.s, deleteReturning: true, returnColumns: columns || '*' })
    }
    return new QueryBuilder({ ...this.s, op: 'select', columns: columns || '*' })
  }

  insert (rows) {
    const data = Array.isArray(rows) ? rows : [rows]
    return new QueryBuilder({ ...this.s, op: 'insert', insertRows: data })
  }

  update (patch) {
    return new QueryBuilder({ ...this.s, op: 'update', patch: patch || {} })
  }

  delete () {
    return new QueryBuilder({ ...this.s, op: 'delete' })
  }

  upsert (rows, { onConflict } = {}) {
    const data = Array.isArray(rows) ? rows : [rows]
    return new QueryBuilder({ ...this.s, op: 'upsert', insertRows: data, onConflict: onConflict || '' })
  }

  eq (col, val) {
    return new QueryBuilder({
      ...this.s,
      filters: [...this.s.filters, { op: 'eq', col, val }]
    })
  }

  in (col, vals) {
    return new QueryBuilder({
      ...this.s,
      filters: [...this.s.filters, { op: 'in', col, vals: [...vals] }]
    })
  }

  order (col, { ascending = true } = {}) {
    return new QueryBuilder({
      ...this.s,
      order: [...(this.s.order || []), { col, asc: !!ascending }]
    })
  }

  limit (n) {
    return new QueryBuilder({ ...this.s, limit: n })
  }

  single () {
    return new QueryBuilder({ ...this.s, wantSingle: true })
  }

  maybeSingle () {
    return new QueryBuilder({ ...this.s, wantMaybeSingle: true })
  }

  then (resolve, reject) {
    return this._run().then(resolve, reject)
  }

  catch (reject) {
    return this._run().catch(reject)
  }

  async _run () {
    const s = this.s
    if (!s.table) {
      return { data: null, error: { message: 'Missing table' } }
    }

    try {
      if (s.op === 'select') {
        const { ok, j } = await postJson('/api/dgmts-static/data', {
          action: 'select',
          table: s.table,
          columns: s.columns || '*',
          filters: s.filters,
          order: s.order || [],
          limit: s.limit,
          single: s.wantSingle,
          maybe_single: s.wantMaybeSingle
        })
        if (!ok) {
          return { data: null, error: { message: j?.error?.message || 'Request failed' } }
        }
        if (j && j.error) {
          return { data: j.data ?? null, error: { message: j.error.message || String(j.error) } }
        }
        return { data: j.data, error: null }
      }

      if (s.op == null) {
        return { data: null, error: { message: 'Incomplete query: call .select() or a mutation after .from()' } }
      }

      if (s.op === 'insert') {
        const { ok, j } = await postJson('/api/dgmts-static/data', {
          action: 'insert',
          table: s.table,
          rows: s.insertRows,
          returning: !!s.insertReturning
        })
        if (!ok) {
          return { data: null, error: { message: j?.error?.message || 'Insert failed' } }
        }
        if (j.error?.message) {
          return { data: null, error: { message: j.error.message } }
        }
        let d = j.data
        if (s.insertReturning && s.wantSingle) {
          d = Array.isArray(d) ? (d[0] ?? null) : d
        }
        return { data: d, error: null }
      }

      if (s.op === 'update') {
        const { ok, j } = await postJson('/api/dgmts-static/data', {
          action: 'update',
          table: s.table,
          patch: s.patch,
          filters: s.filters,
          returning: !!s.updateReturning
        })
        if (!ok) {
          return { data: null, error: { message: j?.error?.message || 'Update failed' } }
        }
        if (j.error?.message) {
          return { data: null, error: { message: j.error.message } }
        }
        return { data: j.data, error: null }
      }

      if (s.op === 'delete') {
        const { ok, j } = await postJson('/api/dgmts-static/data', {
          action: 'delete',
          table: s.table,
          filters: s.filters,
          returning: !!s.deleteReturning
        })
        if (!ok) {
          return { data: null, error: { message: j?.error?.message || 'Delete failed' } }
        }
        if (j.error?.message) {
          return { data: null, error: { message: j.error.message } }
        }
        return { data: j.data, error: null }
      }

      if (s.op === 'upsert') {
        const { ok, j } = await postJson('/api/dgmts-static/data', {
          action: 'upsert',
          table: s.table,
          rows: s.insertRows,
          on_conflict: s.onConflict
        })
        if (!ok) {
          return { data: null, error: { message: j?.error?.message || 'Upsert failed' } }
        }
        if (j.error?.message) {
          return { data: null, error: { message: j.error.message } }
        }
        return { data: j.data, error: null }
      }

      return { data: null, error: { message: 'Unsupported query' } }
    } catch (e) {
      return { data: null, error: { message: e?.message || String(e) } }
    }
  }
}

function makeStorage () {
  return {
    from: (bucket) => ({
      upload: async (path, file) => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('path', path)
        const r = await fetch(
          `${API_BASE}/api/dgmts-static/storage/${encodeURIComponent(bucket)}`,
          { method: 'POST', body: fd }
        )
        let j = null
        try {
          j = await r.json()
        } catch {
          j = null
        }
        if (!r.ok || (j && j.error)) {
          return { data: null, error: j?.error || { message: 'Upload failed' } }
        }
        return { data: { path: j.data?.path || path }, error: null }
      },
      getPublicUrl: (objectPath) => {
        const parts = (objectPath || '').split('/').map((p) => encodeURIComponent(p)).join('/')
        const publicUrl = `${API_BASE}/api/dgmts-static/media/${encodeURIComponent(bucket)}/${parts}`
        return { data: { publicUrl } }
      }
    })
  }
}

function makeFunctions () {
  return {
    invoke: async (name, options = {}) => {
      if (name === 'notify-subscribers') {
        const r = await fetch(
          `${API_BASE}/api/dgmts-static/functions/notify-subscribers`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options.body || {})
          }
        )
        const j = await r.json().catch(() => ({}))
        if (!r.ok) {
          return { data: null, error: { message: j.error || j.message || 'Function failed' } }
        }
        return { data: j, error: null }
      }
      return { data: null, error: { message: `Unknown function: ${name}` } }
    }
  }
}

/**
 * @param {string} _url unused (kept for API compatibility)
 * @param {string} _key unused
 */
export function createClient (_url, _key) {
  return {
    from: (table) => new QueryBuilder({ table }),
    storage: makeStorage(),
    get functions () {
      return makeFunctions()
    }
  }
}

export const supabase = createClient()

export default supabase
