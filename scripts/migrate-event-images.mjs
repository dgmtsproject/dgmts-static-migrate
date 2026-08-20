/**
 * One-off: copy event images still hosted on Supabase Storage onto the VPS
 * media API, then rewrite events.image_url / additional_images in Postgres.
 *
 *   node scripts/migrate-event-images.mjs
 */
const API_BASE = (process.env.VITE_DGMTS_API_URL || 'https://imsite.dullesgeotechnical.com').replace(/\/$/, '')

const SUPABASE_STORAGE_RE =
  /^https?:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/i

function toVpsUrl (supabaseUrl) {
  const m = supabaseUrl.match(SUPABASE_STORAGE_RE)
  if (!m) return supabaseUrl
  const bucket = m[1]
  const objectPath = m[2].split('/').map((p) => encodeURIComponent(decodeURIComponent(p))).join('/')
  return `${API_BASE}/api/dgmts-static/media/${encodeURIComponent(bucket)}/${objectPath}`
}

async function apiData (body) {
  const r = await fetch(`${API_BASE}/api/dgmts-static/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const j = await r.json()
  if (!r.ok || j.error) {
    throw new Error(j?.error?.message || `API ${r.status}`)
  }
  return j.data
}

async function copyToVps (supabaseUrl) {
  const m = supabaseUrl.match(SUPABASE_STORAGE_RE)
  if (!m) return toVpsUrl(supabaseUrl)
  const bucket = m[1]
  const objectPath = decodeURIComponent(m[2])
  const dest = toVpsUrl(supabaseUrl)

  const head = await fetch(dest, { method: 'HEAD' })
  if (head.ok) {
    console.log(`  exists  ${objectPath}`)
    return dest
  }

  const src = await fetch(supabaseUrl)
  if (!src.ok) {
    throw new Error(`download ${src.status} ${supabaseUrl}`)
  }
  const buf = Buffer.from(await src.arrayBuffer())
  const type = src.headers.get('content-type') || 'application/octet-stream'
  const blob = new Blob([buf], { type })
  const form = new FormData()
  form.append('file', blob, objectPath.split('/').pop())
  form.append('path', objectPath)

  const up = await fetch(`${API_BASE}/api/dgmts-static/storage/${encodeURIComponent(bucket)}`, {
    method: 'POST',
    body: form
  })
  const j = await up.json().catch(() => ({}))
  if (!up.ok || j.error) {
    throw new Error(j?.error?.message || `upload ${up.status} ${objectPath}`)
  }
  console.log(`  copied  ${objectPath} (${buf.length} bytes)`)
  return dest
}

function collectUrls (event) {
  const urls = []
  if (typeof event.image_url === 'string') urls.push(event.image_url)
  if (Array.isArray(event.additional_images)) urls.push(...event.additional_images)
  return [...new Set(urls.filter((u) => SUPABASE_STORAGE_RE.test(u)))]
}

const events = await apiData({
  action: 'select',
  table: 'events',
  columns: 'id,slug,image_url,additional_images',
  filters: [],
  order: []
})

let updated = 0
for (const event of events) {
  const supabaseUrls = collectUrls(event)
  if (supabaseUrls.length === 0) {
    console.log(`skip ${event.slug}`)
    continue
  }
  console.log(`event ${event.slug} (${supabaseUrls.length} supabase files)`)
  for (const url of supabaseUrls) {
    await copyToVps(url)
  }
  const patch = {}
  if (typeof event.image_url === 'string' && SUPABASE_STORAGE_RE.test(event.image_url)) {
    patch.image_url = toVpsUrl(event.image_url)
  }
  if (Array.isArray(event.additional_images) && event.additional_images.some((u) => SUPABASE_STORAGE_RE.test(u))) {
    patch.additional_images = event.additional_images.map((u) =>
      typeof u === 'string' && SUPABASE_STORAGE_RE.test(u) ? toVpsUrl(u) : u
    )
  }
  if (Object.keys(patch).length === 0) continue
  await apiData({
    action: 'update',
    table: 'events',
    patch,
    filters: [{ op: 'eq', col: 'id', val: event.id }],
    returning: true
  })
  updated += 1
  console.log(`  updated row ${event.id}`)
}

console.log(`done. events updated: ${updated}`)
