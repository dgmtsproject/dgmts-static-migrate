// Utility function to update blog images to use local assets
// You can call this from the browser console or create a temporary component

import { supabase } from '../supabaseClient'

export async function updateBlogImages() {
  try {
    // Update blog with news-32.jpg
    const { data: blog1, error: error1 } = await supabase
      .from('blogs')
      .update({ image_url: '/assets/uploads/news-32.jpg' })
      .eq('id', 'da783a8f-6f0d-4742-be1d-fcae1802df1e')
      .select()

    if (error1) {
      console.error('Error updating blog 1:', error1)
      return { success: false, error: error1 }
    } else {
      console.log('✅ Updated blog 1 (news-32.jpg):', blog1)
    }

    // Update blog with news-27.png
    const { data: blog2, error: error2 } = await supabase
      .from('blogs')
      .update({ image_url: '/assets/uploads/news-27.png' })
      .eq('id', '96ad5c71-7255-4a8d-baa3-3a15ad84ba2d')
      .select()

    if (error2) {
      console.error('Error updating blog 2:', error2)
      return { success: false, error: error2 }
    } else {
      console.log('✅ Updated blog 2 (news-27.png):', blog2)
    }

    console.log('✅ Blog image updates completed!')
    return { success: true }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error }
  }
}

