import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HiAcademicCap, HiClock, HiBookOpen, HiCurrencyDollar, HiCheckCircle, HiPlay, HiLogout, HiUser } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ChurchBackground from '../components/ui/ChurchBackground'

const UserDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/courses/signin')
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/courses/signin')
      return
    }
    fetchUserDashboard()
  }, [isAuthenticated, navigate])

  const fetchUserDashboard = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping dashboard data fetch')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      // Fetch user enrollments and available courses separately to better handle errors
      try {
        const enrollmentsRes = await api.get('/enrollments/my')
        setEnrollments(enrollmentsRes.data || [])
      } catch (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError)
        setEnrollments([]) // Set empty array on error
      }
      
      try {
        const coursesRes = await api.get('/courses/')
        setAvailableCourses(coursesRes.data || [])
      } catch (courseError) {
        console.error('Error fetching courses:', courseError)
        setAvailableCourses([]) // Set empty array on error
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
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
            onClick={fetchUserDashboard}
            className="px-4 py-2 bg-church-gold text-church-dark rounded hover:bg-church-gold/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-church-dark text-white relative">
      <ChurchBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Welcome Header with User Info and Logout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-church-gold/20 rounded-full flex items-center justify-center">
                <HiUser className="w-8 h-8 text-church-gold" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-church-gold to-church-purple bg-clip-text text-transparent">
                  Welcome back, {user?.full_name || 'Student'}!
                </h1>
                <p className="text-white/70">Continue your learning journey</p>
                {user?.email && (
                  <p className="text-white/50 text-sm mt-1">{user.email}</p>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <HiLogout className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-church-gold/20 rounded-full flex items-center justify-center">
                <HiAcademicCap className="w-6 h-6 text-church-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{enrollments.length}</p>
                <p className="text-white/70 text-sm">Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <HiCheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {enrollments.filter(e => e.status === 'completed').length}
                </p>
                <p className="text-white/70 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <HiClock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {enrollments.reduce((total, e) => total + (e.progress_percentage || 0), 0) / Math.max(enrollments.length, 1)}%
                </p>
                <p className="text-white/70 text-sm">Avg Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">My Courses</h2>
          {enrollments.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 text-center">
              <HiAcademicCap className="w-16 h-16 text-church-gold/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-white/70 mb-6">Start your learning journey by enrolling in a course</p>
              <Link 
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors"
              >
                <HiPlay className="w-5 h-5" />
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-colors">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {enrollment.course?.title || 'Course Title'}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {enrollment.course?.description || 'Course description'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : enrollment.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {enrollment.status?.replace('_', ' ') || 'Unknown'}
                      </span>
                      <span className="text-white/60 text-sm">
                        {enrollment.progress_percentage || 0}% complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                      <div 
                        className="bg-church-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress_percentage || 0}%` }}
                      ></div>
                    </div>

                    <Link 
                      to={`/courses/${enrollment.course_id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded hover:bg-church-gold/30 transition-colors"
                    >
                      <HiPlay className="w-4 h-4" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-colors">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1 text-white/60">
                      <HiCurrencyDollar className="w-4 h-4" />
                      {course.is_free ? 'Free' : `$${course.price}`}
                    </span>
                    <span className="flex items-center gap-1 text-white/60">
                      <HiClock className="w-4 h-4" />
                      {course.duration_weeks || 'Self-paced'}
                    </span>
                  </div>

                  <Link 
                    to={`/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors"
                  >
                    <HiBookOpen className="w-4 h-4" />
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {availableCourses.length > 3 && (
            <div className="text-center mt-6">
              <Link 
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                View All Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage
