import { supabase } from '../supabaseClient'

export function categoryIdOf (blog) {
  return blog?.category || blog?.category_id || null
}

export async function attachCategoryNames (blogs) {
  const list = Array.isArray(blogs) ? blogs.filter(Boolean) : (blogs ? [blogs] : [])
  if (list.length === 0) return blogs

  const ids = [...new Set(list.map(categoryIdOf).filter(Boolean))]
  let nameById = {}
  if (ids.length > 0) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, category_name')
      .in('id', ids)
    if (!error && data) {
      nameById = Object.fromEntries(data.map((row) => [row.id, row.category_name]))
    }
  }

  const decorate = (blog) => {
    const name = nameById[categoryIdOf(blog)]
    if (!name) return blog
    return { ...blog, categories: { category_name: name } }
  }

  return Array.isArray(blogs) ? blogs.map(decorate) : decorate(blogs)
}
