import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiLockClosed, HiAcademicCap, HiClock, HiBookOpen, HiCurrencyDollar, HiPlay } from 'react-icons/hi'
import ChurchBackground from '../components/ui/ChurchBackground'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const CoursesPage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/courses/signin')
      return
    }
    fetchCourses()
  }, [isAuthenticated, navigate])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/courses/')
      setCourses(response.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect unauthenticated users
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

  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchCourses}
            className="px-4 py-2 bg-church-gold text-church-dark rounded hover:bg-church-gold/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <ChurchBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-church-gold to-church-purple bg-clip-text text-transparent">
            Our Courses
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover transformative courses designed to equip you with practical skills and spiritual wisdom for ministry and life.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-church-gold/20 text-church-gold rounded-full text-xs font-medium">
                    {course.course_type?.replace('_', ' ') || 'Course'}
                  </span>
                  <span className="flex items-center gap-1 text-white/60">
                    <HiCurrencyDollar className="w-4 h-4" />
                    {course.is_free ? 'Free' : `$${course.price}`}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{course.title}</h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                  <span className="flex items-center gap-1">
                    <HiClock className="w-4 h-4" />
                    {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiBookOpen className="w-4 h-4" />
                    {course.total_videos || 0} videos
                  </span>
                </div>

                <Link 
                  to={`/courses/${course.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors font-medium"
                >
                  <HiPlay className="w-4 h-4" />
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <HiAcademicCap className="w-16 h-16 text-church-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses available</h3>
            <p className="text-white/70">Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
