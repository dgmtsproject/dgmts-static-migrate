import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
import './BlogsSection.css'

function BlogsSection() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestBlogs()
  }, [])

  const fetchLatestBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, categories(category_name)')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      console.error('Error fetching blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ""
  }

  const getExcerpt = (content, maxLength = 120) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (loading) {
    return (
      <section className="blogs-section bg-texture">
        <div className="container">
          <div className="loading-blogs">Loading latest posts...</div>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null // Don't show the section if no blogs
  }

  return (
    <section className="blogs-section bg-texture">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Latest Blog Posts</h2>
          <p className="section-subtitle">
            Stay updated with our latest insights, news, and technical articles
          </p>
        </div>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="blog-preview-card">
              {blog.image_url && (
                <div className="blog-preview-image">
                  <img src={blog.image_url} alt={blog.title} />
                  {blog.categories && (
                    <span className="blog-category-chip">{blog.categories.category_name}</span>
                  )}
                </div>
              )}
              <div className="blog-preview-content">
                <div className="blog-preview-meta">
                  <span className="blog-preview-date">{formatDate(blog.created_at)}</span>
                </div>
                <h3 className="blog-preview-title">
                  <Link to={`/blog/${blog.slug || blog.id}`}>{blog.title}</Link>
                </h3>
                <p className="blog-preview-excerpt">{getExcerpt(blog.content)}</p>
                <Link to={`/blog/${blog.slug || blog.id}`} className="blog-preview-link">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="blogs-section-footer">
          <Link to="/blog" className="btn btn-primary">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogsSection
