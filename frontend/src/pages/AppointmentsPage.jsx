import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { HiCalendar, HiClock, HiUser, HiMail, HiPhone, HiCheckCircle, HiX } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ChurchBackground from '../components/ui/ChurchBackground'
import toast from 'react-hot-toast'

const AppointmentsPage = () => {
  const { isAuthenticated, user } = useAuth()
  
  // IMMEDIATE redirect if not authenticated - before any component logic
  if (!isAuthenticated) {
    window.location.href = '/courses/signin'
    return null
  }
  
  const [pastors, setPastors] = useState([])
  const [selectedPastor, setSelectedPastor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [availabilityData, setAvailabilityData] = useState({})
  const [showAvailability, setShowAvailability] = useState({})
  const [availabilityLoading, setAvailabilityLoading] = useState({})
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm()

  const selectedDate = watch('appointment_date')

  useEffect(() => {
    // Fetch pastors (we know user is authenticated due to the check above)
    fetchPastors()
  }, [])

  const fetchPastors = async () => {
    try {
      setLoading(true)
      const response = await api.get('/appointments/pastors')
      setPastors(response.data || [])
    } catch (error) {
      console.error('Error fetching pastors:', error)
      toast.error('Failed to load pastors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPastor = (pastor) => {
    setSelectedPastor(pastor)
    setShowBookingForm(true)
    setValue('pastor_id', pastor.id)
  }

  const checkAvailability = async (pastorId) => {
    if (availabilityData[pastorId]) {
      // Toggle visibility if data already exists
      setShowAvailability(prev => ({
        ...prev,
        [pastorId]: !prev[pastorId]
      }))
      return
    }

    try {
      setAvailabilityLoading(prev => ({ ...prev, [pastorId]: true }))
      const response = await api.get(`/appointments/pastors/${pastorId}/availability`)
      setAvailabilityData(prev => ({
        ...prev,
        [pastorId]: response.data
      }))
      setShowAvailability(prev => ({
        ...prev,
        [pastorId]: true
      }))
    } catch (error) {
      console.error('Error checking availability:', error)
      toast.error('Failed to check availability')
    } finally {
      setAvailabilityLoading(prev => ({ ...prev, [pastorId]: false }))
    }
  }

  const getAvailableTimeSlots = (pastor) => {
    if (!pastor || !selectedDate) return []
    
    try {
      const availableTimes = JSON.parse(pastor.available_times || '[]')
      const slots = []
      
      availableTimes.forEach(timeSlot => {
        if (timeSlot.start && timeSlot.end) {
          const startHour = parseInt(timeSlot.start.split(':')[0])
          const endHour = parseInt(timeSlot.end.split(':')[0])
          
          for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`)
          }
        }
      })
      
      return slots
    } catch (error) {
      console.error('Error parsing available times:', error)
      return []
    }
  }

  const onSubmit = async (data) => {
    if (!selectedPastor) {
      toast.error('Please select a pastor')
      return
    }

    setBookingLoading(true)
    try {
      const appointmentData = {
        ...data,
        appointment_date: new Date(`${data.appointment_date}T${data.appointment_time}:00`)
      }

      await api.post('/appointments', appointmentData)
      
      toast.success('Appointment request submitted successfully! Awaiting admin approval.')
      reset()
      setSelectedPastor(null)
      setShowBookingForm(false)
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error(error.response?.data?.detail || 'Failed to book appointment. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const PastorCard = ({ pastor }) => {
    const isGlobalLead = pastor.is_global_lead
    const availableDays = pastor.available_days ? JSON.parse(pastor.available_days) : []
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="glass-card rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
        onClick={() => handleSelectPastor(pastor)}
      >
        {/* Pastor Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-church-gold/20 flex items-center justify-center">
            {pastor.image_url ? (
              <img src={pastor.image_url} alt={pastor.name} className="w-full h-full object-cover" />
            ) : (
              <HiUser className="w-10 h-10 text-church-gold" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {pastor.name}
              {isGlobalLead && (
                <span className="ml-2 px-2 py-1 bg-church-gold/20 text-church-gold text-xs rounded-full border border-church-gold/30">
                  Global Lead
                </span>
              )}
            </h3>
            <p className="text-church-gold font-medium">{pastor.title}</p>
            <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
              <HiMail className="w-4 h-4" />
              <span>{pastor.email}</span>
            </div>
            {pastor.phone && (
              <div className="flex items-center gap-2 mt-1 text-white/60 text-sm">
                <HiPhone className="w-4 h-4" />
                <span>{pastor.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pastor Bio */}
        {pastor.bio && (
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {pastor.bio}
          </p>
        )}

        {/* Availability */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-church-gold font-medium">Availability</h4>
            <button
              onClick={(e) => {
                e.stopPropagation()
                checkAvailability(pastor.id)
              }}
              disabled={availabilityLoading[pastor.id]}
              className="px-3 py-1 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors text-sm disabled:opacity-50"
            >
              {availabilityLoading[pastor.id] ? 'Loading...' : 'Check Availability'}
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <HiCalendar className="w-4 h-4" />
              <span>
                {availableDays.length > 0 
                  ? availableDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')
                  : 'Contact for availability'
                }
              </span>
            </div>
          </div>

          {/* Availability Details */}
          {showAvailability[pastor.id] && availabilityData[pastor.id] && (
            <div className="mt-3 p-3 bg-church-gold/10 rounded-lg border border-church-gold/30">
              <div className="space-y-2">
                <p className="text-white/70 text-xs mb-2">
                  Week of {new Date(availabilityData[pastor.id].week_start).toLocaleDateString()} - {new Date(availabilityData[pastor.id].week_end).toLocaleDateString()}
                </p>
                {Object.entries(availabilityData[pastor.id].available_days).map(([day, data]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-white/80 capitalize">
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                    </span>
                    <span className={`font-medium ${
                      data.daily_remaining <= 0 
                        ? 'text-red-400' 
                        : data.daily_remaining <= 1 
                        ? 'text-yellow-400' 
                        : 'text-green-400'
                    }`}>
                      {data.daily_remaining <= 0 
                        ? 'Fully booked' 
                        : `${data.daily_remaining} slot${data.daily_remaining !== 1 ? 's' : ''} remaining`
                      }
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-church-gold/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Weekly remaining:</span>
                    <span className={`font-medium ${
                      availabilityData[pastor.id].available_days[Object.keys(availabilityData[pastor.id].available_days)[0]]?.weekly_remaining <= 0
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}>
                      {Object.values(availabilityData[pastor.id].available_days)[0]?.weekly_remaining || 0} slots
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button className="w-full px-4 py-2 bg-church-gold/20 text-church-gold border border-church-gold/30 rounded-lg hover:bg-church-gold/30 transition-colors font-medium">
            Book Appointment
          </button>
        </div>
      </motion.div>
    )
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading pastors...</p>
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-church-gold to-church-purple bg-clip-text text-transparent">
            Book an Appointment
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Schedule a meeting with our pastors for spiritual guidance, counseling, and support
          </p>
        </motion.div>

        {/* Pastors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pastors.map((pastor, index) => (
            <motion.div
              key={pastor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PastorCard pastor={pastor} />
            </motion.div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && selectedPastor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-church-dark/90 backdrop-blur-md rounded-2xl border border-church-gold/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Selected Pastor Info */}
              <div className="bg-church-gold/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-church-gold/20 flex items-center justify-center">
                    {selectedPastor.image_url ? (
                      <img src={selectedPastor.image_url} alt={selectedPastor.name} className="w-full h-full object-cover" />
                    ) : (
                      <HiUser className="w-6 h-6 text-church-gold" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{selectedPastor.name}</h3>
                    <p className="text-church-gold text-sm">{selectedPastor.title}</p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('pastor_id')} />
                
                <div>
                  <label className="block text-white font-medium mb-2">Full Name *</label>
                  <input
                    {...register('full_name', { required: 'Full name is required' })}
                    type="text"
                    defaultValue={user?.full_name || ''}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  />
                  {errors.full_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email *</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Appointment Date *</label>
                  <input
                    {...register('appointment_date', { required: 'Date is required' })}
                    type="date"
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  />
                  {errors.appointment_date && (
                    <p className="text-red-400 text-sm mt-1">{errors.appointment_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Appointment Time *</label>
                  <select
                    {...register('appointment_time', { required: 'Time is required' })}
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  >
                    <option value="" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Select a time</option>
                    {getAvailableTimeSlots(selectedPastor).map(time => (
                      <option key={time} value={time} style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>{time}</option>
                    ))}
                  </select>
                  {errors.appointment_time && (
                    <p className="text-red-400 text-sm mt-1">{errors.appointment_time.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Purpose of Meeting *</label>
                  <select
                    {...register('subject', { required: 'Purpose is required' })}
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  >
                    <option value="" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Select purpose</option>
                    <option value="Relocation guidance" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Relocation guidance</option>
                    <option value="Business or investment advice" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Business or investment advice</option>
                    <option value="Marital counseling" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Marital counseling</option>
                    <option value="Personal decision-making support" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Personal decision-making support</option>
                    <option value="Spiritual guidance" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Spiritual guidance</option>
                    <option value="Other" style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}>Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Additional Details</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Provide any additional details about your appointment request..."
                    className="w-full px-4 py-3 bg-church-dark/90 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-church-gold focus:ring-2 focus:ring-church-gold/20 resize-none"
                    style={{ color: '#ffffff', backgroundColor: 'rgba(3, 11, 31, 0.9)' }}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage
