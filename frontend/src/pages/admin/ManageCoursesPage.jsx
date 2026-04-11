import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiAcademicCap, HiPlus, HiPencilAlt, HiTrash, HiEye, HiClock, HiBookOpen, HiCurrencyDollar, HiCheckCircle, HiXCircle, HiExclamation, HiCheck } from 'react-icons/hi'
import ChurchBackground from '../../components/ui/ChurchBackground'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null, courseTitle: '' })
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard')
      return
    }
    fetchCourses()
  }, [isAdmin, navigate])

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

  const handleDeleteCourse = (courseId, courseTitle) => {
    setDeleteModal({ isOpen: true, courseId, courseTitle })
  }

  const confirmDeleteCourse = async () => {
    try {
      await api.delete(`/courses/${deleteModal.courseId}`)
      setCourses(courses.filter(course => course.id !== deleteModal.courseId))
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })
      
      // Show success notification
      setNotification({
        show: true,
        message: `${deleteModal.courseTitle} has been deleted successfully.`,
        type: 'success'
      })
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' })
      }, 3000)
      
    } catch (error) {
      console.error('Error deleting course:', error)
      setError('Failed to delete course. Please try again.')
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })
    }
  }

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' ||
                        (filterStatus === 'published' && course.is_published) ||
                        (filterStatus === 'draft' && !course.is_published)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
            <p className="text-white">Loading courses...</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-display text-4xl font-black text-white mb-2">
                  Manage Courses
                </h1>
                <p className="text-white/60 text-lg">
                  Create, edit, and manage all courses
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/admin/courses/create"
                  className="flex items-center gap-2 px-4 py-2 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                  Create Course
                </Link>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
              >
                <option value="all" className="bg-church-dark">All Courses</option>
                <option value="published" className="bg-church-dark">Published</option>
                <option value="draft" className="bg-church-dark">Draft</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
              >
                <option value="all">All Types</option>
                <option value="media_training">Media Training</option>
                <option value="membership_class">Membership Class</option>
                <option value="workers_class">Workers Class</option>
                <option value="school_of_ministry">School of Ministry</option>
                <option value="hila">HILA</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-400">
                  {error}
                </div>
              </div>
            )}

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <HiAcademicCap className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Get started by creating your first course'}
                </p>
                <Link
                  to="/admin/courses/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="glass-card rounded-2xl overflow-hidden group">
                    {/* Course Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          course.is_published 
                            ? 'text-green-400 bg-green-400/10 border-green-400/30'
                            : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                        }`}>
                          {course.is_published ? (
                            <>
                              <HiCheckCircle className="w-3 h-3 inline mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <HiXCircle className="w-3 h-3 inline mr-1" />
                              Draft
                            </>
                          )}
                        </span>
                        <span className="text-church-gold text-sm font-medium">
                          {course.is_free ? 'Free' : `$${course.price || 0}`}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white mb-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-3">
                        {course.description || 'No description available'}
                      </p>

                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                        <span className="flex items-center gap-1">
                          <HiBookOpen className="w-3 h-3" />
                          {course.total_videos || 0} videos
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock className="w-3 h-3" />
                          {course.duration_weeks || 'Self-paced'}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiCurrencyDollar className="w-3 h-3" />
                          {course.is_free ? 'Free' : `$${course.price}`}
                        </span>
                      </div>

                      {/* Course Type Badge */}
                      <div className="mb-4">
                        <span className="px-2 py-1 bg-church-gold/20 text-church-gold rounded text-xs font-medium">
                          {course.course_type || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6 flex gap-2">
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded hover:bg-church-gold/30 transition-colors text-sm"
                      >
                        <HiPencilAlt className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors text-sm"
                      >
                        <HiEye className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded hover:bg-red-500/30 transition-colors text-sm"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete}></div>
          <div className="relative bg-church-dark rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-church-gold/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <HiExclamation className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Course</h3>
                  <p className="text-sm text-white/60">Are you sure you want to delete this course?</p>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4 mb-4">
                  <p className="text-white font-medium mb-2">
                    <span className="text-red-400">⚠️ Warning:</span> This action cannot be undone.
                  </p>
                  <p className="text-white/80 text-sm">
                    Course: <span className="font-semibold text-white">{deleteModal.courseTitle}</span>
                  </p>
                </div>
                
                {/* Modal Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCourse}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <HiTrash className="w-4 h-4" />
                    Delete Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-400 flex items-center gap-3 min-w-80">
            <HiCheck className="w-5 h-5 text-green-200" />
            <div>
              <p className="font-medium text-green-100">{notification.message}</p>
              <p className="text-xs text-green-200 mt-1">✓ Action completed successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCoursesPage
