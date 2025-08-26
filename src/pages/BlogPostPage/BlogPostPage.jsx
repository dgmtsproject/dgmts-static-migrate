import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './BlogPostPage.css'

function BlogPostPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        setBlog(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching blog:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  // Scroll to top when the page (id) changes so the user starts at the top
  useEffect(() => {
    try {
      window.scrollTo(0, 0)
    } catch {
      // ignore in non-browser environments
    }
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-post-page bg-texture">
        <div className="container">
          <div className="loading">Loading blog post...</div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="blog-post-page bg-texture">
        <div className="container">
          <div className="error">
            {error || 'Blog post not found'}
          </div>
          <div className="back-link">
            <Link to="/blog">← Back to Blog</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page bg-texture">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>→</span>
          <Link to="/blog">Blog</Link>
          <span>→</span>
          <span>{blog.title}</span>
        </nav>

        <article className="blog-post">
          {blog.image_url && (
            <div className="blog-post-image">
              <img src={blog.image_url} alt={blog.title} />
            </div>
          )}
          <header className="blog-post-header">
            <h1 className="blog-post-title">{blog.title}</h1>
            <div className="blog-post-meta">
              <span className="blog-post-date">
                Published on {formatDate(blog.created_at)}
              </span>
              {blog.updated_at !== blog.created_at && (
                <span className="blog-post-updated">
                  • Updated on {formatDate(blog.updated_at)}
                </span>
              )}
            </div>
          </header>

          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        <div className="blog-post-navigation">
          <Link to="/blog" className="back-to-blog">
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
