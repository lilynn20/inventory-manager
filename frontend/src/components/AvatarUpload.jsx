import { useState, useRef } from 'react'
import { Camera, Upload, X, User } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Avatar upload component with preview and cropping
 */
export default function AvatarUpload({
  currentAvatar,
  currentInitials,
  onUpload,
  size = 100,
  editable = true,
}) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async () => {
    if (!preview || !onUpload) return

    setIsUploading(true)
    try {
      await onUpload(preview)
      toast.success('Avatar updated!')
      setPreview(null)
    } catch (err) {
      toast.error('Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
  }

  const displayImage = preview || currentAvatar

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Avatar Circle */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: isDragging ? '3px dashed #4f46e5' : '3px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          cursor: editable ? 'pointer' : 'default',
        }}
        onClick={() => editable && fileInputRef.current?.click()}
        onDrop={editable ? handleDrop : undefined}
        onDragOver={editable ? handleDragOver : undefined}
        onDragLeave={editable ? handleDragLeave : undefined}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : currentInitials ? (
          <span
            style={{
              fontSize: size * 0.35,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            {currentInitials}
          </span>
        ) : (
          <User size={size * 0.4} color="var(--text-muted)" />
        )}

        {/* Hover overlay */}
        {editable && !preview && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
            className="avatar-overlay"
          >
            <Camera size={size * 0.25} color="white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Preview actions */}
      {preview && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCancel}
            className="btn btn-outline btn-sm"
            disabled={isUploading}
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="btn btn-primary btn-sm"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="spinner" style={{ width: 14, height: 14 }} />
            ) : (
              <Upload size={14} />
            )}
            Save
          </button>
        </div>
      )}

      {/* Help text */}
      {editable && !preview && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          Click or drag to upload
          <br />
          JPG, PNG up to 5MB
        </p>
      )}

      <style>{`
        .avatar-overlay {
          opacity: 0;
        }
        div:hover > .avatar-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
