/**
 * Map leftover Supabase Storage URLs onto the VPS media API.
 * Event rows were migrated with image_url still pointing at
 * fvnuefwtrkiutnomremi.supabase.co/storage/...; new uploads already
 * use /api/dgmts-static/media/{bucket}/...
 */
const API_BASE = (import.meta.env.VITE_DGMTS_API_URL || 'https://imsite.dullesgeotechnical.com').replace(/\/$/, '')

const SUPABASE_STORAGE_RE =
  /https?:\/\/[^/\s"'\\]+\.supabase\.co\/storage\/v1\/object\/public\/([^/\s"'\\]+)\/([^\s"'\\]+)/gi

export function rewriteSupabaseStorageUrl (url) {
  if (typeof url !== 'string' || !url) return url
  SUPABASE_STORAGE_RE.lastIndex = 0
  return url.replace(SUPABASE_STORAGE_RE, (_match, bucket, objectPath) => {
    const parts = String(objectPath).split('/').map((p) => {
      try {
        return encodeURIComponent(decodeURIComponent(p))
      } catch {
        return encodeURIComponent(p)
      }
    }).join('/')
    return `${API_BASE}/api/dgmts-static/media/${encodeURIComponent(bucket)}/${parts}`
  })
}

export function rewriteSupabaseStorageValue (value) {
  if (typeof value === 'string') return rewriteSupabaseStorageUrl(value)
  if (Array.isArray(value)) return value.map(rewriteSupabaseStorageValue)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, nested] of Object.entries(value)) {
      out[key] = rewriteSupabaseStorageValue(nested)
    }
    return out
  }
  return value
}

export default rewriteSupabaseStorageUrl
