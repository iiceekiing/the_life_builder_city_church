import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HiMicrophone, HiVideoCamera, HiDocumentText, HiX, HiUpload, HiStop } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ChurchBackground from '../components/ui/ChurchBackground'
import toast from 'react-hot-toast'

const ShareTestimonyPage = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [testimonyType, setTestimonyType] = useState('text')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaBlob, setMediaBlob] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  const startRecording = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      })

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        })
        setMediaBlob(blob)
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setIsRecording(true)

      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
      toast.error('Failed to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      setMediaBlob(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setTestimonyType(type)
    }
  }

  const onSubmit = async (data) => {
    if (testimonyType !== 'text' && !mediaBlob) {
      toast.error('Please record or upload media file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content || '')
      formData.append('testimony_type', testimonyType)
      formData.append('author_name', user?.full_name || 'Anonymous')
      formData.append('author_email', user?.email || '')

      if (mediaBlob) {
        formData.append('media_file', mediaBlob)
      }

      await api.post('/testimonies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Testimony submitted successfully! It will be reviewed by admin.')
      reset()
      setMediaBlob(null)
      setPreviewUrl('')
      setTestimonyType('text')
      navigate('/testimonies')
    } catch (error) {
      console.error('Error submitting testimony:', error)
      toast.error(error.response?.data?.detail || 'Failed to submit testimony. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearMedia = () => {
    setMediaBlob(null)
    setPreviewUrl('')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  return (
    <div className="min-h-screen relative">
      <ChurchBackground />
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-church-gold to-church-purple bg-clip-text text-transparent">
              Share Your Testimony
            </h1>
            <p className="text-white/70 text-lg">
              Share how God has worked in your life to encourage others in their faith journey
            </p>
          </div>

          {/* Type Selection */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Choose Testimony Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setTestimonyType('text')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  testimonyType === 'text'
                    ? 'border-church-gold bg-church-gold/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <HiDocumentText className="w-8 h-8 mx-auto mb-2 text-church-gold" />
                <h3 className="text-white font-medium">Written Testimony</h3>
                <p className="text-white/60 text-sm mt-1">Share your story in words</p>
              </button>

              <button
                onClick={() => setTestimonyType('audio')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  testimonyType === 'audio'
                    ? 'border-church-gold bg-church-gold/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <HiMicrophone className="w-8 h-8 mx-auto mb-2 text-church-gold" />
                <h3 className="text-white font-medium">Audio Testimony</h3>
                <p className="text-white/60 text-sm mt-1">Record or upload audio</p>
              </button>

              <button
                onClick={() => setTestimonyType('video')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  testimonyType === 'video'
                    ? 'border-church-gold bg-church-gold/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <HiVideoCamera className="w-8 h-8 mx-auto mb-2 text-church-gold" />
                <h3 className="text-white font-medium">Video Testimony</h3>
                <p className="text-white/60 text-sm mt-1">Record or upload video</p>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block text-white font-medium mb-2">Testimony Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                placeholder="Give your testimony a title..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Text Content */}
            {testimonyType === 'text' && (
              <div className="glass-card rounded-2xl p-6">
                <label className="block text-white font-medium mb-2">Your Testimony *</label>
                <textarea
                  {...register('content', { 
                    required: testimonyType === 'text' ? 'Testimony content is required' : false 
                  })}
                  rows={8}
                  placeholder="Share your story of God's goodness in your life..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20 resize-none"
                />
                {errors.content && (
                  <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
            )}

            {/* Media Recording/Upload */}
            {(testimonyType === 'audio' || testimonyType === 'video') && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-medium mb-4">
                  {testimonyType === 'audio' ? 'Audio Recording' : 'Video Recording'}
                </h3>

                {/* Preview */}
                {previewUrl && (
                  <div className="mb-4">
                    <div className="relative rounded-lg overflow-hidden bg-black/20">
                      {testimonyType === 'video' ? (
                        <video
                          src={previewUrl}
                          controls
                          className="w-full max-h-64 object-cover"
                        />
                      ) : (
                        <audio
                          src={previewUrl}
                          controls
                          className="w-full"
                        />
                      )}
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Preview for Recording */}
                {testimonyType === 'video' && isRecording && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg mb-4 bg-black/20"
                  />
                )}

                {/* Recording Controls */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={() => startRecording(testimonyType)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <HiMicrophone className="w-4 h-4" />
                      {testimonyType === 'audio' ? 'Start Recording' : 'Start Recording'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <HiStop className="w-4 h-4" />
                      Stop Recording
                    </button>
                  )}

                  <label className="flex items-center gap-2 px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors cursor-pointer">
                    <HiUpload className="w-4 h-4" />
                    Upload {testimonyType === 'audio' ? 'Audio' : 'Video'}
                    <input
                      type="file"
                      accept={testimonyType === 'audio' ? 'audio/*' : 'video/*'}
                      onChange={(e) => handleFileUpload(e, testimonyType)}
                      className="hidden"
                    />
                  </label>
                </div>

                {testimonyType === 'text' && (
                  <textarea
                    {...register('content')}
                    rows={4}
                    placeholder="Additional notes about your testimony (optional)..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20 resize-none"
                  />
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Submitting...' : 'Submit Testimony'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ShareTestimonyPage
