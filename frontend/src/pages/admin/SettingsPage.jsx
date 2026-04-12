import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiCog, HiSave, HiRefresh, HiBell, HiShieldCheck, HiGlobe, HiMail, HiDatabase, HiServer, HiAcademicCap } from 'react-icons/hi'
import ChurchBackground from '../../components/ui/ChurchBackground'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    site_name: 'Life Builder City Church',
    site_description: 'Building Lives, Transforming Communities',
    contact_email: 'info@lifebuilderscitychurch.com',
    auto_approve_enrollments: false,
    email_notifications: true,
    maintenance_mode: false,
    max_enrollments_per_user: 10,
    course_completion_threshold: 80
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard')
      return
    }
    fetchSettings()
  }, [isAdmin, navigate])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // For now, use default settings. In future, this would come from API
      setSettings({
        site_name: 'Life Builder City Church',
        site_description: 'Building Lives, Transforming Communities',
        contact_email: 'info@lifebuilderscitychurch.com',
        auto_approve_enrollments: false,
        email_notifications: true,
        maintenance_mode: false,
        max_enrollments_per_user: 10,
        course_completion_threshold: 80
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      // For now, just simulate saving. In future, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ChurchBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
            <p className="text-white">Loading settings...</p>
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-display text-4xl font-black text-white mb-2">
                  System Settings
                </h1>
                <p className="text-white/60 text-lg">
                  Configure system-wide settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <HiRefresh className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Back to Dashboard
                </button>
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

            {/* Settings Sections */}
            <div className="space-y-8">
              {/* General Settings */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <HiGlobe className="w-5 h-5 text-church-gold" />
                  General Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15 resize-none"
                  />
                </div>
              </div>

              {/* Course Settings */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <HiAcademicCap className="w-5 h-5 text-church-gold" />
                  Course Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Maximum Enrollments Per User
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.max_enrollments_per_user}
                      onChange={(e) => handleInputChange('max_enrollments_per_user', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Course Completion Threshold (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={settings.course_completion_threshold}
                      onChange={(e) => handleInputChange('course_completion_threshold', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:bg-white/15"
                    />
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <HiServer className="w-5 h-5 text-church-gold" />
                  System Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiShieldCheck className="w-5 h-5 text-church-gold" />
                      <div>
                        <p className="text-white font-medium">Auto-Approve Enrollments</p>
                        <p className="text-white/60 text-sm">Automatically approve new course enrollments</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('auto_approve_enrollments', !settings.auto_approve_enrollments)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.auto_approve_enrollments ? 'bg-church-gold' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.auto_approve_enrollments ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiBell className="w-5 h-5 text-church-gold" />
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-white/60 text-sm">Send email notifications for important events</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('email_notifications', !settings.email_notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email_notifications ? 'bg-church-gold' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiDatabase className="w-5 h-5 text-church-gold" />
                      <div>
                        <p className="text-white font-medium">Maintenance Mode</p>
                        <p className="text-white/60 text-sm">Temporarily disable user access to the site</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('maintenance_mode', !settings.maintenance_mode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.maintenance_mode ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-church-dark"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <HiSave className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
