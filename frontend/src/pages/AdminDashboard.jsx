import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  HiUsers, 
  HiBookOpen, 
  HiCalendar, 
  HiMicrophone, 
  HiChatAlt, 
  HiAcademicCap,
  HiChartBar,
  HiLogout,
  HiMenu,
  HiX
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchStats()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Use demo data if API fails
      setStats({
        totalUsers: 1247,
        totalSermons: 89,
        totalCourses: 12,
        totalEvents: 24,
        totalTestimonies: 156,
        pendingAppointments: 8,
        recentRegistrations: 23,
        monthlyGrowth: 15.3
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiChartBar },
    { id: 'users', label: 'Users', icon: HiUsers },
    { id: 'sermons', label: 'Sermons', icon: HiMicrophone },
    { id: 'courses', label: 'Courses', icon: HiAcademicCap },
    { id: 'events', label: 'Events', icon: HiCalendar },
    { id: 'testimonies', label: 'Testimonies', icon: HiChatAlt },
    { id: 'appointments', label: 'Appointments', icon: HiBookOpen },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection stats={stats} loading={loading} />
      case 'users':
        return <UsersSection />
      case 'sermons':
        return <SermonsSection />
      case 'courses':
        return <CoursesSection />
      case 'events':
        return <EventsSection />
      case 'testimonies':
        return <TestimoniesSection />
      case 'appointments':
        return <AppointmentsSection />
      default:
        return <DashboardSection stats={stats} loading={loading} />
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-church-dark flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-church-purple border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-church-gold flex items-center justify-center">
              <span className="text-church-dark font-bold text-sm">LBC</span>
            </div>
            <span className="text-white font-bold">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-church-gold text-church-dark'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-church-gold/20 flex items-center justify-center">
              <span className="text-church-gold font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user?.full_name}</p>
              <p className="text-white/50 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <HiLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-church-purple border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <HiMenu className="w-6 h-6" />
            </button>
            
            <h1 className="font-display text-xl text-white capitalize">
              {activeSection.replace(/([A-Z])/g, ' $1').trim()}
            </h1>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-white/60 hover:text-white text-sm"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// Dashboard Section Component
const DashboardSection = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      change: '+12%',
      icon: HiUsers,
      color: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Total Sermons',
      value: stats.totalSermons || 0,
      change: '+8%',
      icon: HiMicrophone,
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses || 0,
      change: '+15%',
      icon: HiAcademicCap,
      color: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Upcoming Events',
      value: stats.totalEvents || 0,
      change: '+5%',
      icon: HiCalendar,
      color: 'from-orange-500/20 to-orange-600/10',
      borderColor: 'border-orange-500/30'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-6 border ${stat.borderColor} bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-white/60" />
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-white/60 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl text-white font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass-card-gold p-4 text-left hover:border-church-gold/30 transition-all">
            <HiMicrophone className="w-6 h-6 text-church-gold mb-2" />
            <h3 className="text-white font-medium">Add New Sermon</h3>
            <p className="text-white/50 text-sm">Upload latest message</p>
          </button>
          <button className="glass-card-gold p-4 text-left hover:border-church-gold/30 transition-all">
            <HiCalendar className="w-6 h-6 text-church-gold mb-2" />
            <h3 className="text-white font-medium">Create Event</h3>
            <p className="text-white/50 text-sm">Schedule upcoming program</p>
          </button>
          <button className="glass-card-gold p-4 text-left hover:border-church-gold/30 transition-all">
            <HiUsers className="w-6 h-6 text-church-gold mb-2" />
            <h3 className="text-white font-medium">Manage Users</h3>
            <p className="text-white/50 text-sm">View all members</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl text-white font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New user registration', user: 'John Doe', time: '2 hours ago' },
            { action: 'Sermon uploaded', user: 'Pastor David', time: '5 hours ago' },
            { action: 'Testimony submitted', user: 'Sarah Johnson', time: '1 day ago' },
            { action: 'Course enrollment', user: 'Michael Brown', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-white/50 text-sm">by {activity.user}</p>
              </div>
              <span className="text-white/40 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Placeholder sections for other admin features
const UsersSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">User Management</h2>
    <p className="text-white/60">User management interface coming soon...</p>
  </div>
)

const SermonsSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">Sermon Management</h2>
    <p className="text-white/60">Sermon management interface coming soon...</p>
  </div>
)

const CoursesSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">Course Management</h2>
    <p className="text-white/60">Course management interface coming soon...</p>
  </div>
)

const EventsSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">Event Management</h2>
    <p className="text-white/60">Event management interface coming soon...</p>
  </div>
)

const TestimoniesSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">Testimony Management</h2>
    <p className="text-white/60">Testimony management interface coming soon...</p>
  </div>
)

const AppointmentsSection = () => (
  <div className="glass-card p-6">
    <h2 className="font-display text-xl text-white font-bold mb-4">Appointment Management</h2>
    <p className="text-white/60">Appointment management interface coming soon...</p>
  </div>
)

export default AdminDashboard
