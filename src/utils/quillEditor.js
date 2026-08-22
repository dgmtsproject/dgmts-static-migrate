import { supabase } from '../supabaseClient'

export const QUILL_FORMATS = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image', 'video', 'blockquote', 'code-block'
]

export const QUILL_TOOLBAR_CONTAINER = [
  [{ header: ['1', '2', '3', false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link', 'image', 'video', 'blockquote', 'code-block'],
  ['clean']
]

export async function uploadContentImage (file, { bucket = 'blog-images', folder = 'content' } = {}) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please select an image file')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB')
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  })
  if (error || !data) {
    throw new Error(error?.message || 'Image upload failed')
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  if (!urlData?.publicUrl) {
    throw new Error('Could not get a public URL for the uploaded image')
  }
  return urlData.publicUrl
}

export function createQuillImageHandler ({ bucket = 'blog-images', folder = 'content', onError } = {}) {
  return function imageHandler () {
    const quill = this.quill
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadContentImage(file, { bucket, folder })
        const range = quill.getSelection(true) || { index: quill.getLength() }
        quill.insertEmbed(range.index, 'image', url, 'user')
        quill.setSelection(range.index + 1, 0, 'user')
      } catch (err) {
        const message = err?.message || 'Image upload failed'
        if (typeof onError === 'function') onError(message)
        else window.alert(message)
      }
    }
  }
}

export function createQuillModules (options = {}) {
  return {
    toolbar: {
      container: QUILL_TOOLBAR_CONTAINER,
      handlers: {
        image: createQuillImageHandler(options)
      }
    },
    clipboard: {
      matchVisual: false
    }
  }
}
