import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Search } from 'lucide-react'
import './BlogPage.css'

function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newsletterData, setNewsletterData] = useState({ name: '', email: '' })
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setBlogs(data || [])
      setFilteredBlogs(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_name')
      
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = blogs

    // Filter by search term (only applied when search button is clicked)
    if (searchTerm.trim()) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtml(blog.content).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category && blog.category === selectedCategory)
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchTerm, selectedCategory])

  const filterByCategory = useCallback(() => {
    let filtered = blogs

    // Only filter by category, ignore search term
    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category && blog.category === selectedCategory)
    }

    setFilteredBlogs(filtered)
  }, [blogs, selectedCategory])

  useEffect(() => {
    fetchBlogs()
    fetchCategories()
  }, [])

  useEffect(() => {
    // Only filter by category when category changes
    filterByCategory()
  }, [filterByCategory])

  const handleSearch = () => {
    applyFilters()
  }

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId)
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterData.name.trim() || !newsletterData.email.trim()) {
      setNewsletterMessage('Please fill in all fields.')
      return
    }

    try {
      // First, check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('subscribers')
        .select('email, is_active')
        .eq('email', newsletterData.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if email doesn't exist
        throw checkError;
      }

      if (existingSubscriber) {
        if (existingSubscriber.is_active) {
          setNewsletterMessage('This email is already subscribed to our newsletter!')
          return;
        } else {
          // Reactivate inactive subscriber
          const token = `${Date.now()}${Math.random()}`;
          const { error: updateError } = await supabase
            .from('subscribers')
            .update({
              name: newsletterData.name,
              is_active: true,
              token: token,
              date_joined: new Date().toISOString()
            })
            .eq('email', newsletterData.email);

          if (updateError) throw updateError;

          // Send welcome email
          try {
            await supabase.functions.invoke('send-email', {
              method: 'POST',
              body: JSON.stringify({
                type: 'newsletter',
                name: newsletterData.name,
                email: newsletterData.email
              }),
            });
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail the subscription if email fails
          }

          setNewsletterMessage('Welcome back! Your subscription has been reactivated.')
          setNewsletterData({ name: '', email: '' })
        }
      } else {
        // Insert new subscriber
        const token = `${Date.now()}${Math.random()}`;
        const { error } = await supabase
          .from('subscribers')
          .insert([
            {
              name: newsletterData.name,
              email: newsletterData.email,
              date_joined: new Date().toISOString(),
              is_active: true,
              token: token
            }
          ])

        if (error) throw error

        // Send welcome email
        try {
          await supabase.functions.invoke('send-email', {
            method: 'POST',
            body: JSON.stringify({
              type: 'newsletter',
              name: newsletterData.name,
              email: newsletterData.email
            }),
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the subscription if email fails
        }

        setNewsletterMessage('Thank you for subscribing!')
        setNewsletterData({ name: '', email: '' })
      }

    } catch (err) {
      console.error('Error subscribing:', err)
      setNewsletterMessage('Error subscribing. Please try again.')
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.category_name : 'Uncategorized'
  }

  const getExcerpt = (content, maxLength = 150) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (loading) {
    // show skeleton grid that mirrors the blogs-grid layout
    return (
      <div className="blog-page bg-texture">
        <div className="container">
          <div className="blog-layout">
            <div className="blogs-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <article key={i} className="blog-card skeleton">
                  <div className="blog-card-image skeleton-image" />
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <span className="blog-date"><span className="skeleton-line short" /></span>
                      <span className="blog-category"><span className="skeleton-line" style={{width: '80px'}} /></span>
                    </div>
                    <h2 className="blog-title">
                      <span className="skeleton-line title" />
                    </h2>
                    <p className="blog-excerpt">
                      <span className="skeleton-line" />
                      <span className="skeleton-line" />
                    </p>
                    <div className="read-more"><span className="skeleton-line small" /></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="blog-sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Search</h3>
                <form className="search-form">
                  <input type="text" placeholder="Search blogs..." />
                  <button type="submit">Search</button>
                </form>
              </div>
              <div className="sidebar-widget">
                <h3 className="widget-title">Categories</h3>
                <ul className="category-list">
                  <li className="skeleton-line"></li>
                  <li className="skeleton-line"></li>
                  <li className="skeleton-line"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-page bg-texture">
        <div className="container">
          <div className="error">Error loading blogs: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page bg-texture">
      <div className="container">
        <header className="blog-header">
          <h1>Engineering Updates</h1>
          <p>Stay updated with the latest news, insights, and technical articles from our team.</p>
        </header>

        <div className="blog-layout">
          <div className="blogs-main">
            {filteredBlogs.length === 0 ? (
              <div className="no-blogs">
                <h3>No blogs found</h3>
                <p>Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="blogs-grid">
                {filteredBlogs.map((blog) => (
                  <article key={blog.id} className="blog-card">
                    {blog.image_url && (
                      <div className="blog-card-image">
                        <img src={blog.image_url} alt={blog.title} />
                      </div>
                    )}
                    <div className="blog-card-content">
                      <div className="blog-meta">
                        <span className="blog-date">{formatDate(blog.created_at)}</span>
                        {blog.category && (
                          <span className="blog-category">{getCategoryName(blog.category)}</span>
                        )}
                      </div>
                      <h2 className="blog-title">
                        <Link to={`/blog/${blog.slug || blog.id}`}>{blog.title}</Link>
                      </h2>
                      <p className="blog-excerpt">{getExcerpt(blog.content)}</p>
                      <Link to={`/blog/${blog.slug || blog.id}`} className="read-more">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="blog-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">Search</h3>
              <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit"><Search size={16} /></button>
              </form>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Categories</h3>
              <ul className="category-list">
                <li
                  className={selectedCategory === '' ? 'active' : ''}
                  onClick={() => handleCategoryFilter('')}
                >
                  All Categories
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={selectedCategory === category.id ? 'active' : ''}
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    {category.category_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="newsletter-cta">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest insights and updates.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={newsletterData.name}
                onChange={(e) => setNewsletterData({...newsletterData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={newsletterData.email}
                onChange={(e) => setNewsletterData({...newsletterData, email: e.target.value})}
                required
              />
            </div>
            <button type="submit">Subscribe</button>
          </form>
          {newsletterMessage && (
            <div className="newsletter-message">{newsletterMessage}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogPage
