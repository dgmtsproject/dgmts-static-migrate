import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import './UpdateBlogImages.css'

function UpdateBlogImages() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const updateBlogImages = async () => {
    setLoading(true)
    setStatus('Updating blog images...')

    try {
      // Update blog with news-32.jpg
      const { data: blog1, error: error1 } = await supabase
        .from('blogs')
        .update({ image_url: '/assets/uploads/news-32.jpg' })
        .eq('id', 'da783a8f-6f0d-4742-be1d-fcae1802df1e')
        .select()

      if (error1) {
        setStatus(`Error updating blog 1: ${error1.message}`)
        setLoading(false)
        return
      }

      // Update blog with news-27.png
      const { data: blog2, error: error2 } = await supabase
        .from('blogs')
        .update({ image_url: '/assets/uploads/news-27.png' })
        .eq('id', '96ad5c71-7255-4a8d-baa3-3a15ad84ba2d')
        .select()

      if (error2) {
        setStatus(`Error updating blog 2: ${error2.message}`)
        setLoading(false)
        return
      }

      setStatus('✅ Successfully updated both blog images!')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="update-blog-images-container">
      <h1>Update Blog Images</h1>
      <p>This will update the two blog posts to use local asset images:</p>
      <ul>
        <li>Blog ID: da783a8f-6f0d-4742-be1d-fcae1802df1e → /assets/uploads/news-32.jpg</li>
        <li>Blog ID: 96ad5c71-7255-4a8d-baa3-3a15ad84ba2d → /assets/uploads/news-27.png</li>
      </ul>
      <button onClick={updateBlogImages} disabled={loading}>
        {loading ? 'Updating...' : 'Update Blog Images'}
      </button>
      {status && <div className={`status ${status.includes('✅') ? 'success' : 'error'}`}>{status}</div>}
    </div>
  )
}

export default UpdateBlogImages

