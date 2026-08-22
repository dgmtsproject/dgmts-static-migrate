import { supabase } from '../supabaseClient'
import { teamMembers } from '../pages/TeamMemberPage/teamData.js'

export function slugifyName (name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function mapLeaderRow (row) {
  return {
    id: row.id,
    slug: row.slug || String(row.id),
    name: row.name,
    role: row.role,
    personType: row.person_type,
    degree: row.degree || '',
    bio: row.bio || '',
    about: row.about || '',
    imageUrl: row.image_url,
    bannerUrl: row.banner_url || row.image_url,
    contact: {
      address: row.contact_address || '',
      phone: row.contact_phone || '',
      email: row.contact_email || '',
      website: row.contact_website || ''
    }
  }
}

export function staticLeaders () {
  return teamMembers.map((m) => ({
    id: m.id,
    slug: String(m.id),
    name: m.name,
    role: m.role,
    personType: m.role === 'President' ? 'president' : 'department_head',
    degree: m.degree || '',
    bio: m.bio || '',
    about: m.about || '',
    imageUrl: m.imageUrl,
    bannerUrl: m.bannerUrl || m.imageUrl,
    contact: m.contact || {},
    social: m.social
  }))
}

export function splitLeaders (list) {
  const all = list || []
  const president =
    all.find((m) => m.personType === 'president' || m.role === 'President') || null
  const departmentHeads = all.filter((m) => m !== president)
  return { president, departmentHeads }
}

export function profilePath (member) {
  if (!member) return '/about'
  return `/team/${member.slug || member.id}`
}

export async function fetchAboutLeaders () {
  const { data, error } = await supabase
    .from('about_leaders')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !data?.length) return staticLeaders()
  return data.map(mapLeaderRow)
}
