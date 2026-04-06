import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiCalendar, HiLocationMarker, HiArrowRight } from 'react-icons/hi'
import { format } from 'date-fns'
import api from '../../utils/api'

const EventsSection = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/content/events?limit=3&featured_only=false')
      setEvents(response.data)
    } catch (error) {
      // Use demo data if API fails
      setEvents(DEMO_EVENTS)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-subtitle">What's Happening</p>
            <h2 className="section-title text-white">Upcoming <span className="gradient-text">Programs</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">What's Happening</p>
          <h2 className="section-title text-white">Upcoming <span className="gradient-text">Programs</span></h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Join us for life-changing encounters and community experiences that will transform your life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="event-card"
            >
              {event.image_url && (
                <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-dark/60 to-transparent" />
                  {event.is_featured && (
                    <span className="absolute top-3 right-3 bg-church-gold text-church-dark text-xs font-bold px-2 py-1 rounded-full font-accent tracking-wide">
                      Featured
                    </span>
                  )}
                </div>
              )}

              {/* Date badge */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-church-gold/20 border border-church-gold/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-church-gold font-bold text-lg leading-none">
                    {format(new Date(event.event_date), 'd')}
                  </span>
                  <span className="text-church-gold/70 text-xs font-accent uppercase">
                    {format(new Date(event.event_date), 'MMM')}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-white font-bold text-lg leading-tight group-hover:text-church-gold transition-colors">
                    {event.title}
                  </h3>
                </div>
              </div>

              {event.description && (
                <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-4">
                <span className="flex items-center gap-1">
                  <HiCalendar className="w-3.5 h-3.5 text-church-gold" />
                  {format(new Date(event.event_date), 'EEE, h:mm a')}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <HiLocationMarker className="w-3.5 h-3.5 text-church-gold" />
                    {event.location}
                  </span>
                )}
              </div>

              {event.registration_link && (
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-church-gold text-sm hover:gap-2 transition-all"
                >
                  Register <HiArrowRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/events" className="btn-outline-gold">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  )
}

// Demo data for development
const DEMO_EVENTS = [
  {
    id: 1,
    title: 'Sunday Miracle Service',
    description: 'Come expectant for a supernatural encounter with God.',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    location: 'Main Auditorium',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80',
  },
  {
    id: 2,
    title: 'Prayer & Fasting Week',
    description: '7 days of consecration, prayer and prophetic declarations.',
    event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    location: 'Prayer Mountain',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80',
  },
  {
    id: 3,
    title: 'Youth Summit 2025',
    description: 'Empowering the next generation with purpose and vision.',
    event_date: new Date(Date.now() + 86400000 * 14).toISOString(),
    location: 'Conference Hall',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80',
  },
]

export default EventsSection
