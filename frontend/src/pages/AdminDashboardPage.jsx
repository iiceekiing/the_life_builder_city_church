import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiUsers, HiAcademicCap, HiClipboardList, HiChartBar, HiUserAdd, HiCog, HiLogout, HiCheckCircle, HiClock, HiXCircle, HiRefresh, HiEye, HiEyeOff, HiCalendar } from 'react-icons/hi'
import ChurchBackground from '../components/ui/ChurchBackground'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { getCourseTypeConfig } from '../config/courseTypes'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    completedCourses: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  })
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard')
      return
    }
    fetchAdminData()
  }, [isAdmin, navigate])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch all admin data in parallel
      const [enrollmentsRes, coursesRes, usersRes, appointmentsRes] = await Promise.all([
        api.get('/enrollments/all'),
        api.get('/courses/'),
        api.get('/users'),  // We'll need to create this endpoint
        api.get('/appointments')
      ])
      
      const enrollmentsData = enrollmentsRes.data || []
      const coursesData = coursesRes.data || []
      const usersData = usersRes.data || []
      const appointmentsData = appointmentsRes.data || []
      
      setEnrollments(enrollmentsData)
      setCourses(coursesData)
      setUsers(usersData)
      setAppointments(appointmentsData)
      
      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        totalEnrollments: enrollmentsData.length,
        pendingEnrollments: enrollmentsData.filter(e => e.status === 'pending').length,
        completedCourses: enrollmentsData.filter(e => e.status === 'completed').length,
        totalAppointments: appointmentsData.length,
        pendingAppointments: appointmentsData.filter(a => a.status === 'pending').length
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setError('Failed to load admin data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollmentAction = async (enrollmentId, action, notes = '') => {
    try {
      await api.post(`/enrollments/${enrollmentId}/${action}`, { notes })
      fetchAdminData() // Refresh data
    } catch (error) {
      console.error(`Error ${action} enrollment:`, error)
      setError(`Failed to ${action} enrollment. Please try again.`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <HiCheckCircle className="w-4 h-4" />
      case 'pending': return <HiClock className="w-4 h-4" />
      case 'rejected': return <HiXCircle className="w-4 h-4" />
      case 'completed': return <HiCheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
            <p className="text-white">Loading admin dashboard...</p>
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
                  Admin Dashboard
                </h1>
                <p className="text-white/60 text-lg">
                  Welcome back, {user?.full_name || 'Admin'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchAdminData}
                  className="flex items-center gap-2 px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors"
                >
                  <HiRefresh className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    logout()
                    navigate('/courses/signin')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <HiLogout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiUsers className="w-8 h-8 text-church-gold" />
                  <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
                </div>
                <p className="text-white/60 text-sm">Total Users</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiAcademicCap className="w-8 h-8 text-church-gold" />
                  <span className="text-2xl font-bold text-white">{stats.totalCourses}</span>
                </div>
                <p className="text-white/60 text-sm">Total Courses</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiClipboardList className="w-8 h-8 text-church-gold" />
                  <span className="text-2xl font-bold text-white">{stats.totalEnrollments}</span>
                </div>
                <p className="text-white/60 text-sm">Total Enrollments</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiClock className="w-8 h-8 text-church-gold" />
                  <span className="text-2xl font-bold text-white">{stats.pendingEnrollments}</span>
                </div>
                <p className="text-white/60 text-sm">Pending Enrollments</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiCalendar className="w-8 h-8 text-church-gold" />
                  <span className="text-2xl font-bold text-white">{stats.totalAppointments}</span>
                </div>
                <p className="text-white/60 text-sm">Total Appointments</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiClock className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{stats.pendingAppointments}</span>
                </div>
                <p className="text-white/60 text-sm">Pending Appointments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-xl">
            {['overview', 'enrollments', 'courses', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-church-gold text-church-dark'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Enrollments */}
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-6">Recent Enrollment Requests</h2>
                
                {enrollments.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <HiClipboardList className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                    <p className="text-white/60">No enrollment requests yet</p>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/60 font-medium">Student</th>
                            <th className="text-left p-4 text-white/60 font-medium">Course</th>
                            <th className="text-left p-4 text-white/60 font-medium">Date</th>
                            <th className="text-left p-4 text-white/60 font-medium">Status</th>
                            <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments.slice(0, 5).map((enrollment) => (
                            <tr key={enrollment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div>
                                  <p className="text-white font-medium">{enrollment.user?.full_name || 'Unknown'}</p>
                                  <p className="text-white/40 text-sm">{enrollment.user?.email || 'No email'}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="text-white font-medium">{enrollment.course?.title || 'Unknown Course'}</p>
                                  <p className="text-white/40 text-sm">{getCourseTypeConfig(enrollment.course?.course_type).label || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="p-4 text-white/60">
                                {enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(enrollment.status)}`}>
                                  {getStatusIcon(enrollment.status)}
                                  {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Unknown'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {enrollment.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleEnrollmentAction(enrollment.id, 'approve')}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 border border-green-400/30 rounded hover:bg-green-500/30 transition-colors text-sm"
                                      >
                                        <HiCheckCircle className="w-4 h-4" />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleEnrollmentAction(enrollment.id, 'reject')}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 border border-red-400/30 rounded hover:bg-red-500/30 transition-colors text-sm"
                                      >
                                        <HiXCircle className="w-4 h-4" />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Pending Appointments */}
              {appointments.filter(a => a.status === 'pending').length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Pending Appointments</h3>
                    <Link
                      to="/admin/appointments"
                      className="text-church-gold hover:text-church-gold/80 transition-colors text-sm"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {appointments
                      .filter(a => a.status === 'pending')
                      .slice(0, 3)
                      .map((appointment) => (
                        <div key={appointment.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{appointment.full_name}</h4>
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                  {appointment.pastor?.name || 'Unassigned'}
                                </span>
                              </div>
                              <p className="text-church-gold text-sm mb-1">{appointment.subject}</p>
                              <p className="text-white/60 text-sm">
                                {new Date(appointment.appointment_date).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  // TODO: Implement quick approve
                                  console.log('Quick approve:', appointment.id)
                                }}
                                className="p-1 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                                title="Approve"
                              >
                                <HiCheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Implement quick cancel with reason
                                  console.log('Quick cancel:', appointment.id)
                                }}
                                className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                title="Cancel"
                              >
                                <HiXCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  to="/admin/courses"
                  className="glass-card rounded-2xl p-6 hover:border-church-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <HiAcademicCap className="w-12 h-12 text-church-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">Manage Courses</h3>
                      <p className="text-white/60 text-sm">Create and edit courses</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="glass-card rounded-2xl p-6 hover:border-church-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <HiUsers className="w-12 h-12 text-church-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">Manage Users</h3>
                      <p className="text-white/60 text-sm">View and manage users</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/appointments"
                  className="glass-card rounded-2xl p-6 hover:border-church-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <HiCalendar className="w-12 h-12 text-church-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">Manage Appointments</h3>
                      <p className="text-white/60 text-sm">Review appointment requests</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/settings"
                  className="glass-card rounded-2xl p-6 hover:border-church-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <HiCog className="w-12 h-12 text-church-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">Settings</h3>
                      <p className="text-white/60 text-sm">System configuration</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === 'enrollments' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">All Enrollments</h2>
              
              {enrollments.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <HiClipboardList className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                  <p className="text-white/60">No enrollments found</p>
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-white/60 font-medium">Student</th>
                          <th className="text-left p-4 text-white/60 font-medium">Course</th>
                          <th className="text-left p-4 text-white/60 font-medium">Date</th>
                          <th className="text-left p-4 text-white/60 font-medium">Progress</th>
                          <th className="text-left p-4 text-white/60 font-medium">Status</th>
                          <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">{enrollment.user?.full_name || 'Unknown'}</p>
                                <p className="text-white/40 text-sm">{enrollment.user?.email || 'No email'}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">{enrollment.course?.title || 'Unknown Course'}</p>
                                <p className="text-white/40 text-sm">{getCourseTypeConfig(enrollment.course?.course_type).label || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="p-4 text-white/60">
                              {enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4 text-white/60">
                              {enrollment.progress_percentage ? `${Math.round(enrollment.progress_percentage)}%` : '0%'}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(enrollment.status)}`}>
                                {getStatusIcon(enrollment.status)}
                                {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Unknown'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {enrollment.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleEnrollmentAction(enrollment.id, 'approve')}
                                      className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 border border-green-400/30 rounded hover:bg-green-500/30 transition-colors text-sm"
                                    >
                                      <HiCheckCircle className="w-4 h-4" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleEnrollmentAction(enrollment.id, 'reject')}
                                      className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 border border-red-400/30 rounded hover:bg-red-500/30 transition-colors text-sm"
                                    >
                                      <HiXCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">All Courses</h2>
              
              {courses.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <HiAcademicCap className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                  <p className="text-white/60">No courses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          course.is_published 
                            ? 'text-green-400 bg-green-400/10 border-green-400/30'
                            : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                        }`}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-church-gold text-sm font-medium">
                          {course.is_free ? 'Free' : `$${course.price || 0}`}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white mb-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm mb-4">
                        {course.description || 'No description available'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                        <span className="flex items-center gap-1">
                          <HiBookOpen className="w-3 h-3" />
                          {course.total_videos || 0} videos
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock className="w-3 h-3" />
                          {course.duration_weeks || 'Self-paced'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded hover:bg-church-gold/30 transition-colors text-sm">
                          Edit
                        </button>
                        <button className="px-3 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors text-sm">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">All Users</h2>
              
              {users.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <HiUsers className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                  <p className="text-white/60">No users found</p>
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-white/60 font-medium">User</th>
                          <th className="text-left p-4 text-white/60 font-medium">Email</th>
                          <th className="text-left p-4 text-white/60 font-medium">Role</th>
                          <th className="text-left p-4 text-white/60 font-medium">Status</th>
                          <th className="text-left p-4 text-white/60 font-medium">Joined</th>
                          <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-church-gold/20 flex items-center justify-center">
                                  <span className="text-church-gold font-medium">
                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <p className="text-white font-medium">{user.full_name || 'Unknown'}</p>
                              </div>
                            </td>
                            <td className="p-4 text-white/60">{user.email || 'No email'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'text-purple-400 bg-purple-400/10 border border-purple-400/30'
                                  : 'text-blue-400 bg-blue-400/10 border border-blue-400/30'
                              }`}>
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_active 
                                  ? 'text-green-400 bg-green-400/10 border border-green-400/30'
                                  : 'text-red-400 bg-red-400/10 border border-red-400/30'
                              }`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 text-white/60">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors text-sm">
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
