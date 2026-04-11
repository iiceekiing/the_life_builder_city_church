import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HiAcademicCap, HiSave, HiArrowLeft, HiBookOpen, HiCurrencyDollar, HiClock, HiDocumentText, HiPhotograph } from 'react-icons/hi'
import ChurchBackground from '../../components/ui/ChurchBackground'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const EditCoursePage = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_type: 'media_training',
    thumbnail_url: '',
    is_published: true,
    is_free: true,
    price: 0,
    duration_weeks: 4,
    total_videos: 0,
    passing_score: 70,
    certification_passing_score: 80
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (!isAdmin()) {
    navigate('/dashboard')
    return null
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      setFetchLoading(true)
      const response = await api.get(`/courses/${id}`)
      const course = response.data
      setFormData({
        title: course.title || '',
        description: course.description || '',
        course_type: course.course_type || 'biblical_studies',
        thumbnail_url: course.thumbnail_url || '',
        is_published: course.is_published || false,
        is_free: course.is_free || true,
        price: course.price || 0,
        duration_weeks: course.duration_weeks || 4,
        total_videos: course.total_videos || 0,
        passing_score: course.passing_score || 70,
        certification_passing_score: course.certification_passing_score || 80
      })
    } catch (error) {
      console.error('Error fetching course:', error)
      setError('Failed to load course. Please try again.')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      await api.put(`/courses/${id}`, {
        title: formData.title,
        description: formData.description,
        course_type: formData.course_type,
        thumbnail_url: formData.thumbnail_url,
        is_published: formData.is_published,
        is_free: formData.is_free,
        price: formData.price,
        duration_weeks: formData.duration_weeks,
        total_videos: formData.total_videos,
        passing_score: formData.passing_score,
        certification_passing_score: formData.certification_passing_score
      })

      setSuccess('Course updated successfully!')
      setTimeout(() => {
        navigate('/admin/courses')
      }, 2000)
    } catch (error) {
      console.error('Error updating course:', error)
      setError(error.response?.data?.detail || 'Failed to update course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
            <p className="text-white">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <ChurchBackground />
      <div className="relative z-10">
        {/* Header */}
        <section className="px-6 pt-32 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/admin/courses"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Courses
              </Link>
              <div>
                <h1 className="font-display text-4xl font-black text-white mb-2">
                  Edit Course
                </h1>
                <p className="text-white/60 text-lg">
                  Update course information
                </p>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-green-400">
                  {success}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-400">
                  {error}
                </div>
              </div>
            )}

            {/* Edit Course Form */}
            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Title */}
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Course Title *
                    </label>
                    <div className="relative">
                      <HiAcademicCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="Enter course title"
                      />
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Course Description *
                    </label>
                    <div className="relative">
                      <HiDocumentText className="absolute left-3 top-3 text-white/30 w-5 h-5" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15 resize-none"
                        placeholder="Enter course description"
                      />
                    </div>
                  </div>

                  {/* Course Type */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Course Type *
                    </label>
                    <div className="relative">
                      <HiBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <select
                        name="course_type"
                        value={formData.course_type}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15 appearance-none"
                      >
                        <option value="media_training" className="bg-church-dark">Media Training</option>
                        <option value="membership_class" className="bg-church-dark">Membership Class</option>
                        <option value="workers_class" className="bg-church-dark">Workers Class</option>
                        <option value="school_of_ministry" className="bg-church-dark">School of Ministry</option>
                        <option value="hila" className="bg-church-dark">HILA</option>
                      </select>
                    </div>
                  </div>

                  {/* Thumbnail URL */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Thumbnail URL
                    </label>
                    <div className="relative">
                      <HiPhotograph className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="url"
                        name="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="Enter thumbnail URL"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Price ($)
                    </label>
                    <div className="relative">
                      <HiCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Duration (Weeks)
                    </label>
                    <div className="relative">
                      <HiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="number"
                        name="duration_weeks"
                        value={formData.duration_weeks}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="4"
                      />
                    </div>
                  </div>

                  {/* Total Videos */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Total Videos
                    </label>
                    <div className="relative">
                      <HiBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="number"
                        name="total_videos"
                        value={formData.total_videos}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Passing Score */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      name="passing_score"
                      value={formData.passing_score}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                      placeholder="70"
                    />
                  </div>

                  {/* Certification Passing Score */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Certification Score (%)
                    </label>
                    <input
                      type="number"
                      name="certification_passing_score"
                      value={formData.certification_passing_score}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                      placeholder="80"
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-church-gold bg-white/10 border-white/20 rounded focus:ring-church-gold focus:ring-2"
                    />
                    <span className="text-sm">Published Course</span>
                  </label>

                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_free"
                      checked={formData.is_free}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-church-gold bg-white/10 border-white/20 rounded focus:ring-church-gold focus:ring-2"
                    />
                    <span className="text-sm">Free Course</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link
                    to="/admin/courses"
                    className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-church-dark"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <HiSave className="w-4 h-4" />
                        Update Course
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default EditCoursePage
