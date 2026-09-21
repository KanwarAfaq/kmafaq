let cloudinaryScriptPromise = null

function loadCloudinaryWidget() {
  if (window.cloudinary) return Promise.resolve(window.cloudinary)
  if (cloudinaryScriptPromise) return cloudinaryScriptPromise

  cloudinaryScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://upload-widget.cloudinary.com/global/all.js"]'
    )

    if (existing) {
      existing.addEventListener('load', () => resolve(window.cloudinary), { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => resolve(window.cloudinary)
    script.onerror = () => reject(new Error('Failed to load Cloudinary upload widget'))
    document.head.appendChild(script)
  })

  return cloudinaryScriptPromise
}

export async function openCloudinaryWidget({ folder, onSuccess }) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    alert('Cloudinary upload configuration is missing')
    return
  }

  try {
    const cloudinary = await loadCloudinaryWidget()
    if (!cloudinary) throw new Error('Cloudinary widget did not initialize')

    const widget = cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'auto',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
        maxFileSize: 10 * 1024 * 1024,
      },
      (error, result) => {
        if (!error && result?.event === 'success') {
          onSuccess(result.info)
        }
      }
    )

    widget.open()
  } catch (error) {
    console.error('Cloudinary widget error:', error)
    alert('Cloudinary upload widget could not be loaded')
  }
}
