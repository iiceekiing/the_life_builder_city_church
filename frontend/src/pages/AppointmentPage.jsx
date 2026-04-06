import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiCalendar, HiUser, HiCheckCircle } from 'react-icons/hi'
import api from '../utils/api'

const AppointmentPage = () => {
  const [pastors, setPastors] = useState([])
  const [selectedPastor, setSelectedPastor] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm()

  useEffect(() => {
    fetchPastors()
  }, [])

  const fetchPastors = async () => {
    try {
      const response = await api.get('/appointments/pastors')
      setPastors(response.data)
    } catch (error) {
      setPastors(DEMO_PASTORS)
    }
  }

  const onSubmit = async (data) => {
    if (!selectedPastor) return toast.error('Please select a pastor')
    
    try {
      await api.post('/appointments', { ...data, pastor_id: selectedPastor })
      setSubmitted(true)
      reset()
      setSelectedPastor(null)
      toast.success('Appointment requested successfully!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Booking failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center glass-card p-12 max-w-md"
        >
          <HiCheckCircle className="w-16 h-16 text-church-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl text-white mb-2">Appointment Requested!</h2>
          <p className="text-white/50 mb-6">
            Your appointment request has been received. You will be contacted to confirm the time.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-gold"
          >
            Book Another
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="page-hero py-16">
        <div className="relative text-center">
          <p className="section-subtitle">Personal Consultation</p>
          <h1 className="section-title text-white">Book an <span className="gradient-text">Appointment</span></h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Schedule a one-on-one session with one of our pastors for counseling, prayers, or guidance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-14">
        {/* Select Pastor */}
        <h3 className="font-display text-white text-xl mb-5">Choose a Pastor</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {pastors.map((pastor) => (
            <motion.button
              key={pastor.id}
              onClick={() => setSelectedPastor(pastor.id)}
              whileTap={{ scale: 0.97 }}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selectedPastor === pastor.id
                  ? 'border-church-gold bg-church-gold/10 shadow-gold'
                  : 'glass-card hover:border-church-gold/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-church-gold/20 flex items-center justify-center mb-3">
                {pastor.image_url ? (
                  <img
                    src={pastor.image_url}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <HiUser className="w-6 h-6 text-church-gold" />
                )}
              </div>
              <p className="font-display text-white font-bold">{pastor.name}</p>
              <p className="text-church-gold text-xs font-accent tracking-wide mt-0.5">
                {pastor.title}
              </p>
              {pastor.bio && (
                <p className="text-white/40 text-xs mt-2 line-clamp-2">{pastor.bio}</p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card-gold p-8 space-y-5">
          <h3 className="font-display text-white text-xl">Your Details</h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/50 text-sm block mb-1.5">Full Name *</label>
              <input
                {...register('full_name', { required: true })}
                placeholder="Your full name"
                className="input-field"
              />
              {errors.full_name && (
                <p className="text-red-400 text-xs mt-1">Required</p>
              )}
            </div>
            <div>
              <label className="text-white/50 text-sm block mb-1.5">Email *</label>
              <input
                {...register('email', { required: true })}
                type="email"
                placeholder="your@email.com"
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">Required</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/50 text-sm block mb-1.5">Phone Number</label>
              <input
                {...register('phone')}
                placeholder="+234..."
                className="input-field"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm block mb-1.5">Preferred Date & Time *</label>
              <input
                {...register('appointment_date', { required: true })}
                type="datetime-local"
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.appointment_date && (
                <p className="text-red-400 text-xs mt-1">Required</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-white/50 text-sm block mb-1.5">Subject / Purpose *</label>
            <input
              {...register('subject', { required: true })}
              placeholder="e.g. Marriage Counseling, Prayer, Career Guidance"
              className="input-field"
            />
            {errors.subject && (
              <p className="text-red-400 text-xs mt-1">Required</p>
            )}
          </div>

          <div>
            <label className="text-white/50 text-sm block mb-1.5">Additional Message</label>
            <textarea
              {...register('message')}
              rows={3}
              placeholder="Any details you'd like to share beforehand..."
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedPastor}
            className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <HiCalendar className="w-5 h-5" />
            {isSubmitting ? 'Booking...' : 'Request Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Demo data
const DEMO_PASTORS = [
  {
    id: 1,
    name: 'Pastor David Adeyemi',
    title: 'Senior Pastor',
    bio: 'Visionary leader and founder of Life Builder City Church.',
  },
  {
    id: 2,
    name: 'Pastor Sarah Adeyemi',
    title: 'Co-Pastor',
    bio: 'Women\'s ministry leader and family counselor.',
  },
  {
    id: 3,
    name: 'Pastor Emmanuel Obi',
    title: 'Associate Pastor',
    bio: 'Youth and young adults ministry overseer.',
  },
]

export default AppointmentPage
