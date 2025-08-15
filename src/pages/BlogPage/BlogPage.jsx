import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './BlogPage.css'

function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ""
  }

  const getExcerpt = (content, maxLength = 150) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="loading">Loading blogs...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="error">Error loading blogs: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <div className="container">
        <header className="blog-header">
          <h1>Our Blog</h1>
          <p>Stay updated with the latest news, insights, and technical articles from our team.</p>
        </header>

        {blogs.length === 0 ? (
          <div className="no-blogs">
            <h3>No blogs available yet</h3>
            <p>Check back soon for our latest articles and insights.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                {blog.image_url && (
                  <div className="blog-card-image">
                    <img src={blog.image_url} alt={blog.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-date">{formatDate(blog.created_at)}</span>
                  </div>
                  <h2 className="blog-title">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>
                  <p className="blog-excerpt">{getExcerpt(blog.content)}</p>
                  <Link to={`/blog/${blog.id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
