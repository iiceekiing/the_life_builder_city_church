import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiUsers, HiPencilAlt, HiTrash, HiMail, HiPhone, HiCalendar, HiCheckCircle, HiXCircle, HiShieldCheck, HiSearch } from 'react-icons/hi'
import ChurchBackground from '../../components/ui/ChurchBackground'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const ManageUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard')
      return
    }
    fetchUsers()
  }, [isAdmin, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/users')
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId)
    if (!userToDelete) return

    // Beautiful confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Confirm User Deletion ⚠️\n\n` +
      `Are you sure you want to permanently delete:\n\n` +
      `👤 ${userToDelete.full_name}\n` +
      `📧 ${userToDelete.email}\n\n` +
      `This action cannot be undone and will:\n` +
      `• Remove all access to the system\n` +
      `• Delete associated data and permissions\n` +
      `• This action is permanent\n\n` +
      `Type 'DELETE' to confirm, or 'CANCEL' to abort.`
    )

    if (confirmed) {
      try {
        await api.delete(`/users/${userId}`)
        setUsers(users.filter(user => user.id !== userId))
        
        // Success notification
        toast.success(`✅ ${userToDelete.full_name} has been deleted successfully`, {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            border: '1px solid #10B981',
            borderRadius: '8px'
          }
        })
        
      } catch (error) {
        console.error('Error deleting user:', error)
        setError('Failed to delete user. Please try again.')
        
        // Error notification
        toast.error(`❌ Failed to delete ${userToDelete.full_name}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            border: '1px solid #EF4444',
            borderRadius: '8px'
          }
        })
      }
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const userToUpdate = users.find(u => u.id === userId)
    if (!userToUpdate) return

    const action = currentStatus ? 'deactivated' : 'activated'
    const statusText = currentStatus ? 'inactive' : 'active'
    const statusEmoji = currentStatus ? '🔴' : '🟢'

    try {
      await api.put(`/users/${userId}`, { is_active: !currentStatus })
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ))
      
      // Success notification
      toast.success(`${statusEmoji} User ${action} successfully`, {
        duration: 4000,
        style: {
          background: currentStatus ? '#EF4444' : '#10B981',
          color: '#FFFFFF',
          border: '1px solid ' + (currentStatus ? '#EF4444' : '#10B981'),
          borderRadius: '8px'
        }
      })
      
    } catch (error) {
      console.error('Error updating user status:', error)
      setError('Failed to update user status. Please try again.')
      
      // Error notification
      toast.error(`❌ Failed to ${action} user`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          border: '1px solid #EF4444',
          borderRadius: '8px'
        }
      })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'active' && user.is_active) ||
                        (filterStatus === 'inactive' && !user.is_active)
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
            <p className="text-white">Loading users...</p>
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
                  Manage Users
                </h1>
                <p className="text-white/60 text-lg">
                  View and manage all registered users
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/admin/users/create')}
                  className="flex items-center gap-2 px-4 py-2 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors"
                >
                  <HiUsers className="w-4 h-4" />
                  Add User
                </button>
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
              <div className="flex-1 relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
              >
                <option value="all" className="bg-church-dark">All Roles</option>
                <option value="admin" className="bg-church-dark">Admins</option>
                <option value="member" className="bg-church-dark">Members</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
              >
                <option value="all" className="bg-church-dark">All Status</option>
                <option value="active" className="bg-church-dark">Active</option>
                <option value="inactive" className="bg-church-dark">Inactive</option>
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

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <HiUsers className="w-12 h-12 text-church-gold/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No users have registered yet'}
                </p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/60 font-medium">User</th>
                        <th className="text-left p-4 text-white/60 font-medium">Contact</th>
                        <th className="text-left p-4 text-white/60 font-medium">Role</th>
                        <th className="text-left p-4 text-white/60 font-medium">Status</th>
                        <th className="text-left p-4 text-white/60 font-medium">Joined</th>
                        <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-church-gold/20 flex items-center justify-center">
                                <span className="text-church-gold font-medium">
                                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.full_name || 'Unknown'}</p>
                                <p className="text-white/40 text-xs">ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-white/60">
                                <HiMail className="w-4 h-4" />
                                <span className="text-sm">{user.email || 'No email'}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-2 text-white/60">
                                  <HiPhone className="w-4 h-4" />
                                  <span className="text-sm">{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'text-purple-400 bg-purple-400/10 border border-purple-400/30'
                                : 'text-blue-400 bg-blue-400/10 border border-blue-400/30'
                            }`}>
                              {user.role === 'admin' && <HiShieldCheck className="w-3 h-3 inline mr-1" />}
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_active 
                                  ? 'text-green-400 bg-green-400/10 border border-green-400/30'
                                  : 'text-red-400 bg-red-400/10 border border-red-400/30'
                              }`}>
                                {user.is_active ? (
                                  <>
                                    <HiCheckCircle className="w-3 h-3 inline mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <HiXCircle className="w-3 h-3 inline mr-1" />
                                    Inactive
                                  </>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-white/60">
                            <div className="flex items-center gap-2">
                              <HiCalendar className="w-4 h-4" />
                              <span className="text-sm">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors text-sm"
                              >
                                <HiPencilAlt className="w-4 h-4" />
                                Edit
                              </button>
                              {user.id !== 1 && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 border border-red-400/30 rounded hover:bg-red-500/30 transition-colors text-sm"
                                >
                                  <HiTrash className="w-4 h-4" />
                                </button>
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
        </section>
      </div>
    </div>
  )
}

export default ManageUsersPage
