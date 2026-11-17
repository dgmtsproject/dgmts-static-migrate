// Event dates are stored as "floating" wall-clock times: the admin types
// 3:00 PM and that is what must be shown, regardless of the viewer's timezone.
//
// The API can return them either as ISO ("2026-11-13T15:00:00") or as the
// Flask/RFC-822 form ("Fri, 13 Nov 2026 15:00:00 GMT"). For the second form the
// clock fields are read as-is (UTC fields) so no timezone shift is applied.

const pad = (n) => String(n).padStart(2, '0')

export function parseEventDateTime (value) {
  if (!value) return null
  const raw = String(value).trim()

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/)
  if (iso) {
    return {
      year: Number(iso[1]),
      month: Number(iso[2]),
      day: Number(iso[3]),
      hours: iso[4] !== undefined ? Number(iso[4]) : 0,
      minutes: iso[5] !== undefined ? Number(iso[5]) : 0,
      hasTime: iso[4] !== undefined
    }
  }

  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    hasTime: true
  }
}

export function formatEventDate (value, { weekday = 'short', month = 'long' } = {}) {
  const p = parseEventDateTime(value)
  if (!p) return ''
  return new Date(p.year, p.month - 1, p.day).toLocaleDateString('en-US', {
    weekday: weekday || undefined,
    year: 'numeric',
    month,
    day: 'numeric'
  })
}

export function formatEventTime (value) {
  const p = parseEventDateTime(value)
  if (!p) return ''
  if (!p.hasTime) return '00:00 AM'
  const h12 = p.hours % 12 || 12
  return `${h12}:${pad(p.minutes)} ${p.hours < 12 ? 'AM' : 'PM'}`
}

export function formatEventDateTimeShort (value) {
  const p = parseEventDateTime(value)
  if (!p) return 'N/A'
  return new Date(p.year, p.month - 1, p.day, p.hours, p.minutes).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function isSameEventDay (a, b) {
  const pa = parseEventDateTime(a)
  const pb = parseEventDateTime(b)
  return !!pa && !!pb && pa.year === pb.year && pa.month === pb.month && pa.day === pb.day
}

// Values for <input type="date"> / <input type="time"> in the admin form.
export function toEventInputValues (value) {
  const p = parseEventDateTime(value)
  if (!p) return { date: '', time: '' }
  return {
    date: `${p.year}-${pad(p.month)}-${pad(p.day)}`,
    time: `${pad(p.hours)}:${pad(p.minutes)}`
  }
}
