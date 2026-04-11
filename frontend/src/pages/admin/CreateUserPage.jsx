import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiUser, HiMail, HiPhone, HiShieldCheck, HiSave, HiArrowLeft } from 'react-icons/hi'
import ChurchBackground from '../../components/ui/ChurchBackground'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'member',
    is_active: true,
    is_verified: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (!isAdmin()) {
    navigate('/dashboard')
    return null
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      })

      setSuccess('User created successfully!')
      setTimeout(() => {
        navigate('/admin/users')
      }, 2000)
    } catch (error) {
      console.error('Error creating user:', error)
      setError(error.response?.data?.detail || 'Failed to create user. Please try again.')
    } finally {
      setLoading(false)
    }
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
                to="/admin/users"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Users
              </Link>
              <div>
                <h1 className="font-display text-4xl font-black text-white mb-2">
                  Create New User
                </h1>
                <p className="text-white/60 text-lg">
                  Add a new user to the system
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

            {/* Create User Form */}
            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      User Role *
                    </label>
                    <div className="relative">
                      <HiShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15 appearance-none"
                      >
                        <option value="member" className="bg-church-dark">Member</option>
                        <option value="admin" className="bg-church-dark">Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                      placeholder="Enter password (min 8 characters)"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:bg-white/15"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-church-gold bg-white/10 border-white/20 rounded focus:ring-church-gold focus:ring-2"
                    />
                    <span className="text-sm">Active User</span>
                  </label>

                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_verified"
                      checked={formData.is_verified}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-church-gold bg-white/10 border-white/20 rounded focus:ring-church-gold focus:ring-2"
                    />
                    <span className="text-sm">Verified User</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link
                    to="/admin/users"
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <HiSave className="w-4 h-4" />
                        Create User
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

export default CreateUserPage
