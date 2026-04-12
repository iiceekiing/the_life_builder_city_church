import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { HiPlay, HiClock, HiUsers, HiCheckCircle, HiLockClosed, HiBell, HiX } from 'react-icons/hi'
import ReactPlayer from 'react-player'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ChurchBackground from '../components/ui/ChurchBackground'
import toast from 'react-hot-toast'

const CourseDetailPage = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [pendingEnrollment, setPendingEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourse()
  }, [id, isAuthenticated])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Always fetch course details (for both authenticated and non-authenticated users)
      const courseResponse = await api.get(`/courses/${id}`)
      setCourse(courseResponse.data)
      
      // Only fetch lessons and enrollment status if authenticated
      if (isAuthenticated) {
        try {
          const [lessonsResponse, enrollmentResponse] = await Promise.all([
            api.get(`/courses/${id}/lessons`),
            api.get(`/courses/my/enrollments`)
          ])
          
          setLessons(lessonsResponse.data)
          
          // Check if user is enrolled or has pending enrollment in this course
          const userEnrollments = enrollmentResponse.data || []
          const courseEnrollment = userEnrollments.find(enrollment => enrollment.course_id === parseInt(id))
          
          if (courseEnrollment) {
            if (courseEnrollment.status === 'approved') {
              setEnrolled(true)
              setPendingEnrollment(null)
            } else if (courseEnrollment.status === 'pending') {
              setEnrolled(false)
              setPendingEnrollment(courseEnrollment)
            }
          } else {
            setEnrolled(false)
            setPendingEnrollment(null)
          }
          
          if (lessonsResponse.data.length > 0) {
            setCurrentLesson(lessonsResponse.data[0])
          }
        } catch (lessonError) {
          console.error('Error fetching lessons:', lessonError)
          // Still show course even if lessons fail to load
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      setError('Course not found or failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await api.post(`/courses/${id}/enroll`)
      toast.success(`Successfully enrolled in "${course.title}"! An admin will review and approve your application.`)
      setPendingEnrollment({ course_id: parseInt(id), status: 'pending' })
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error(error.response?.data?.detail || 'Failed to enroll. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleReminder = async () => {
    try {
      await api.post(`/enrollments/${pendingEnrollment.id}/reminder`)
      toast.success('Reminder sent to admin successfully!')
    } catch (error) {
      console.error('Error sending reminder:', error)
      toast.error(error.response?.data?.detail || 'Failed to send reminder. Please try again.')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your enrollment request?')) {
      return
    }
    
    try {
      await api.delete(`/enrollments/${pendingEnrollment.id}`)
      toast.success('Enrollment request cancelled successfully!')
      setPendingEnrollment(null)
    } catch (error) {
      console.error('Error canceling enrollment:', error)
      toast.error(error.response?.data?.detail || 'Failed to cancel enrollment. Please try again.')
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center mb-4">
              <HiLockClosed className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
            <p className="text-white/60 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link 
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  // If not authenticated, show sign in/signup prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-start justify-center px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full mt-12"
          >
            <div className="glass-card rounded-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-church-gold/10 border border-church-gold/30 flex items-center justify-center mb-4">
                  <HiLockClosed className="w-10 h-10 text-church-gold" />
                </div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-display text-2xl font-black text-white mb-2"
                >
                  Sign In Required
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white/60 text-sm"
                >
                  Access our transformative courses and training programs
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-3 mb-6"
              >
                <Link
                  to="/courses/signin"
                  className="btn-gold w-full py-3 text-sm font-medium block"
                >
                  Sign In
                </Link>
                
                <Link
                  to="/courses/signup"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-3 text-sm font-medium transition-all block text-center"
                >
                  Create Account
                </Link>
              </motion.div>

              {/* Back to Home */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={() => navigate('/')}
                className="text-white/40 hover:text-white/60 text-xs transition-colors flex items-center gap-2 mx-auto"
              >
                <span>←</span>
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-800 rounded-2xl mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-gray-800 rounded" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-800 rounded" />
                <div className="h-4 bg-gray-800 rounded" />
                <div className="h-4 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 pb-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course Not Found</h2>
          <Link to="/courses" className="btn-gold">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <ChurchBackground />
      <div className="relative z-10">
        {/* Course Hero */}
        <section className="px-6 pt-32 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link to="/courses" className="text-white/60 hover:text-white text-sm">
                  ← Back to Courses
                </Link>
                <span className="text-white/40">/</span>
                <span className="text-white/60 text-sm">{course.title}</span>
              </div>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors text-sm font-medium"
                >
                  Back to Dashboard
                </Link>
              )}
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-black text-white leading-tight mb-4"
            >
              {course.title}
            </motion.h1>
          </div>
        </section>

        {/* Course Content */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content (2/3) */}
            <div className="md:col-span-2 space-y-6">
              {/* Video Player / Thumbnail */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-video bg-church-purple-mid rounded-2xl overflow-hidden"
              >
                {currentLesson && enrolled ? (
                  <ReactPlayer
                    url={currentLesson.video_url}
                    width="100%"
                    height="100%"
                    controls
                    onEnded={() => {
                      // Auto-play next lesson
                      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
                      if (currentIndex < lessons.length - 1) {
                        setCurrentLesson(lessons[currentIndex + 1])
                      }
                    }}
                  />
                ) : (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>

              {/* Course Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-display text-xl font-bold text-white mb-3">About This Course</h3>
                <p className="text-white/70 leading-relaxed">{course.description}</p>
              </motion.div>

              {/* Lessons List (shown when enrolled) */}
              {enrolled && lessons.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-display text-xl font-bold text-white mb-4">Course Lessons</h3>
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          currentLesson?.id === lesson.id
                            ? 'border-church-gold bg-church-gold/10'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-church-gold/20 flex items-center justify-center text-church-gold text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{lesson.title}</h4>
                            <p className="text-white/50 text-sm">
                              <HiClock className="inline w-3 h-3 mr-1" />
                              {formatDuration(lesson.duration_seconds)}
                            </p>
                          </div>
                          {currentLesson?.id === lesson.id && (
                            <HiPlay className="w-5 h-5 text-church-gold" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Course Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-bold text-white mb-4">Course Info</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <HiClock className="w-5 h-5 text-church-gold" />
                    <div>
                      <p className="text-white/60 text-xs">Duration</p>
                      <p className="text-white font-medium">
                        {formatDuration(course.duration_seconds || 3600)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <HiUsers className="w-5 h-5 text-church-gold" />
                    <div>
                      <p className="text-white/60 text-xs">Students</p>
                      <p className="text-white font-medium">{course.enrollment_count || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-church-gold" />
                    <div>
                      <p className="text-white/60 text-xs">Pace</p>
                      <p className="text-white font-medium">Self-paced</p>
                    </div>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-church-gold/20 border border-church-gold/30 rounded-full text-church-gold text-xs font-medium">
                    {course.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General'}
                  </span>
                </div>
              </motion.div>

              {/* Enrollment */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6"
              >
                {enrolled ? (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                      <HiCheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">You're Enrolled!</h3>
                    <p className="text-white/60 text-sm">Access all lessons and track your progress</p>
                  </div>
                ) : pendingEnrollment ? (
                  <div>
                    <div className="w-12 h-12 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                      <HiClock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Pending Approval</h3>
                    <p className="text-white/60 text-sm mb-4">
                      Your enrollment is pending admin review. You'll be notified once approved.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={handleReminder}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors text-sm font-medium"
                      >
                        <HiBell className="w-4 h-4" />
                        Send Reminder
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                      >
                        <HiX className="w-4 h-4" />
                        Cancel Request
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-3">Get Started</h3>
                    <p className="text-white/60 text-sm mb-4">
                      Enroll to access all lessons and track your progress
                    </p>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="btn-gold w-full py-3 text-sm font-medium disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
