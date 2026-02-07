import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, FileJson, Upload } from 'lucide-react'
import { Image } from '@unpic/react'
import type { CharacterLock, ImageMeta, Scene, Subject } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { ASPECT_RATIOS, STYLE_TAGS } from '@/lib/schema'
import { confirmUpload, uploadImage } from '@/server/functions/upload'

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

function UploadPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [meta, setMeta] = useState<ImageMeta>({
    quality: 'ultra',
    resolution: '4K',
    camera: '',
    lens: '',
    aspect_ratio: '1:1',
    style: [],
  })

  const [characterLock] = useState<CharacterLock | null>({
    age_range: '',
    ethnicity: '',
    hair_color: '',
    hair_style: '',
    hair_length: '',
    eye_description: '',
    face_shape: '',
    nose: '',
    lips: '',
    skin: '',
    body_type: '',
    distinguishing_features: [],
  })

  const [scene] = useState<Scene>({
    location_type: '',
    setting_details: '',
    time_of_day: 'day',
    lighting_description: '',
    atmospheric_qualities: [],
  })

  const [subject] = useState<Subject>({
    pose_description: '',
    outfit_details: '',
    product_placement: '',
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0] as File | undefined
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const metadata = {
        meta,
        character_lock: characterLock,
        scene,
        subject,
      }

      // Step 1: Get pre-signed upload URL
      const { uploadUrl, publicUrl } = await uploadImage({
        data: {
          filename: file.name,
          metadata,
        },
      })

      // Step 2: Upload file directly to R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) throw new Error('Failed to upload file to R2')

      // Step 3: Confirm upload and create DB records
      await confirmUpload({
        data: {
          filename: file.name,
          r2_url: publicUrl,
          metadata,
        },
      })

      setUploadComplete(true)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Upload Complete!
          </h2>
          <p className="text-text-secondary mb-6">
            Your image has been uploaded successfully.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            View Gallery
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-text-primary mb-8">
          Upload Image
        </h1>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                step >= 1
                  ? 'bg-accent-primary text-white'
                  : 'bg-secondary text-text-secondary',
              )}
            >
              1
            </div>
            <div
              className={cn(
                'w-12 h-1',
                step > 1 ? 'bg-accent-primary' : 'bg-secondary',
              )}
            />
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                step >= 2
                  ? 'bg-accent-primary text-white'
                  : 'bg-secondary text-text-secondary',
              )}
            >
              2
            </div>
            <div
              className={cn(
                'w-12 h-1',
                step > 2 ? 'bg-accent-primary' : 'bg-secondary',
              )}
            />
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                step >= 3
                  ? 'bg-accent-primary text-white'
                  : 'bg-secondary text-text-secondary',
              )}
            >
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center transition-colors',
                preview
                  ? 'border-accent-primary'
                  : 'border-border-default hover:border-accent-primary',
              )}
            >
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview of uploaded image"
                    layout="constrained"
                    width={600}
                    height={400}
                    className="max-h-96 mx-auto rounded-lg object-contain"
                    loading="eager"
                  />
                  <button
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                    className="absolute top-4 right-4 p-2 bg-secondary rounded-full text-text-secondary hover:text-text-primary"
                    aria-label="Remove image"
                  >
                    x
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-primary mb-2">
                    Drag and drop your image here
                  </p>
                  <p className="text-text-muted mb-4">or</p>
                  <label className="px-6 py-3 bg-accent-primary text-white rounded-lg cursor-pointer hover:bg-accent-hover transition-colors">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!file}
                className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary/30 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Metadata
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">
                    Quality
                  </label>
                  <select
                    value={meta.quality}
                    onChange={(e) =>
                      setMeta({ ...meta, quality: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-secondary border border-border-default rounded-lg text-text-primary"
                  >
                    <option value="ultra">Ultra</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={meta.aspect_ratio}
                    onChange={(e) =>
                      setMeta({ ...meta, aspect_ratio: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-secondary border border-border-default rounded-lg text-text-primary"
                  >
                    {ASPECT_RATIOS.map((ratio) => (
                      <option key={ratio} value={ratio}>
                        {ratio}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Style Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const newStyles = meta.style.includes(tag)
                          ? meta.style.filter((t) => t !== tag)
                          : [...meta.style, tag]
                        setMeta({ ...meta, style: newStyles })
                      }}
                      className={cn(
                        'px-3 py-1 text-sm rounded-lg transition-colors',
                        meta.style.includes(tag)
                          ? 'bg-accent-primary text-white'
                          : 'bg-secondary text-text-secondary hover:bg-secondary/80',
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-secondary text-text-primary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary/30 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                  Review & Submit
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                  <FileJson className="w-4 h-4" />
                  Preview JSON
                </button>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 text-sm font-mono text-text-secondary overflow-auto max-h-64">
                {JSON.stringify(
                  { meta, character_lock: characterLock, scene, subject },
                  null,
                  2,
                )}
              </div>

              {uploadError && (
                <p className="text-red-400 text-sm text-center">
                  {uploadError}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-secondary text-text-primary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Submit Upload'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
