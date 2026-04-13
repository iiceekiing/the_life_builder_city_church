import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiCalendar, HiClock, HiUser, HiMail, HiPhone, HiCheckCircle, HiXCircle, HiEye, HiFilter, HiSearch } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import ChurchBackground from '../../components/ui/ChurchBackground'
import toast from 'react-hot-toast'

const ManageAppointmentsPage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/appointments')
      setAppointments(response.data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.pastor?.name && apt.pastor.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredAppointments(filtered)
  }

  const handleStatusUpdate = async (appointmentId, newStatus, reason = '') => {
    setUpdating(true)
    try {
      const updateData = { status: newStatus }
      if (newStatus === 'cancelled' && reason) {
        updateData.admin_note = reason
      }
      
      await api.put(`/appointments/${appointmentId}`, updateData)
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus, admin_note: reason } : apt
        )
      )
      
      toast.success(`Appointment ${newStatus === 'confirmed' ? 'approved' : 'cancelled'} successfully`)
      
      if (newStatus === 'confirmed') {
        // TODO: Send email notification to pastor and user
        console.log('Email notification sent to pastor and user')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelWithReason = () => {
    if (!selectedAppointment || !cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    
    handleStatusUpdate(selectedAppointment.id, 'cancelled', cancellationReason)
    setShowCancelModal(false)
    setCancellationReason('')
    setSelectedAppointment(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const AppointmentCard = ({ appointment }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{appointment.full_name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <HiMail className="w-4 h-4" />
              <span>{appointment.email}</span>
            </div>
            
            {appointment.phone && (
              <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                <HiPhone className="w-4 h-4" />
                <span>{appointment.phone}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setSelectedAppointment(appointment)
              setShowDetailsModal(true)
            }}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <HiEye className="w-5 h-5" />
          </button>
        </div>

        {/* Appointment Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <HiUser className="w-4 h-4 text-church-gold" />
            <span className="font-medium">Pastor:</span>
            <span>{appointment.pastor?.name || 'Not assigned'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70">
            <HiCalendar className="w-4 h-4 text-church-gold" />
            <span className="font-medium">Date:</span>
            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70">
            <HiClock className="w-4 h-4 text-church-gold" />
            <span className="font-medium">Time:</span>
            <span>{new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="text-white/70">
            <span className="font-medium">Purpose:</span>
            <span className="ml-2">{appointment.subject}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {appointment.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiCheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => {
                setSelectedAppointment(appointment)
                setShowCancelModal(true)
              }}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiXCircle className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <ChurchBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Appointments</h1>
          <p className="text-white/70">Review and manage appointment requests from users</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-white/60">
              <div className="text-center">
                <div className="text-2xl font-bold text-church-gold">{filteredAppointments.length}</div>
                <div className="text-xs">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredAppointments.filter(apt => apt.status === 'pending').length}
                </div>
                <div className="text-xs">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
                </div>
                <div className="text-xs">Confirmed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-12 text-center"
            >
              <HiCalendar className="w-16 h-16 text-church-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No appointments found</h3>
              <p className="text-white/60">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No appointments match your filters.'
                  : 'No appointments have been booked yet.'
                }
              </p>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AppointmentCard appointment={appointment} />
              </motion.div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-church-dark/90 backdrop-blur-md rounded-2xl border border-church-gold/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Appointment Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Full Name</h3>
                    <p className="text-white">{selectedAppointment.full_name}</p>
                  </div>
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Email</h3>
                    <p className="text-white">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Phone</h3>
                    <p className="text-white">{selectedAppointment.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status?.charAt(0).toUpperCase() + selectedAppointment.status?.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Pastor</h3>
                    <p className="text-white">{selectedAppointment.pastor?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Date & Time</h3>
                    <p className="text-white">
                      {new Date(selectedAppointment.appointment_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-church-gold font-medium mb-1">Purpose</h3>
                  <p className="text-white">{selectedAppointment.subject}</p>
                </div>

                {selectedAppointment.message && (
                  <div>
                    <h3 className="text-church-gold font-medium mb-1">Additional Details</h3>
                    <p className="text-white/80 italic">"{selectedAppointment.message}"</p>
                  </div>
                )}

                <div>
                  <h3 className="text-church-gold font-medium mb-1">Booked On</h3>
                  <p className="text-white/60">
                    {new Date(selectedAppointment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedAppointment.status === 'pending' && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'confirmed')
                      setShowDetailsModal(false)
                    }}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiCheckCircle className="w-5 h-5" />
                    Approve Appointment
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'cancelled')
                      setShowDetailsModal(false)
                    }}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiXCircle className="w-5 h-5" />
                    Reject Appointment
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-church-dark/90 backdrop-blur-md rounded-2xl border border-church-gold/30 p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Cancel Appointment</h2>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancellationReason('')
                    setSelectedAppointment(null)
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <HiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-church-gold/10 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-bold mb-1">{selectedAppointment.full_name}</h3>
                  <p className="text-church-gold text-sm">{selectedAppointment.subject}</p>
                  <p className="text-white/60 text-sm">
                    {new Date(selectedAppointment.appointment_date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason for cancelling this appointment..."
                  className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20 resize-none"
                  style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancellationReason('')
                    setSelectedAppointment(null)
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelWithReason}
                  disabled={updating || !cancellationReason.trim()}
                  className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ManageAppointmentsPage
