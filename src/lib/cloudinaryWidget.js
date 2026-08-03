// src/lib/cloudinaryWidget.js
export function openCloudinaryWidget({ folder, onSuccess }) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!window.cloudinary) {
    alert('Cloudinary widget not loaded')
    return
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      folder, // e.g. 'portfolio/projects'
      sources: ['local', 'url', 'camera'],
      multiple: false,
      resourceType: 'auto',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      maxFileSize: 10 * 1024 * 1024, // 10 MB
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result.info) // result.info.secure_url, result.info.public_id, etc.
      }
    }
  )

  widget.open()
}