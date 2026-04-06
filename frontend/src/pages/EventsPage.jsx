import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { HiCalendar, HiLocationMarker, HiExternalLink } from 'react-icons/hi'
import api from '../utils/api'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/content/events?limit=20')
      setEvents(response.data)
    } catch (error) {
      setEvents(DEMO_EVENTS)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="page-hero py-16">
        <div className="relative text-center">
          <p className="section-subtitle">What's Coming</p>
          <h1 className="section-title text-white">Church <span className="gradient-text">Events</span></h1>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Join us for upcoming programs and events designed to transform your life and deepen your faith.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-14">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-56 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <HiCalendar className="w-12 h-12 mx-auto mb-3 text-church-gold/20" />
            <p>No upcoming events. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="event-card"
              >
                {event.image_url && (
                  <div className="h-44 rounded-xl overflow-hidden mb-4">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-church-gold/20 border border-church-gold/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-church-gold font-bold text-xl leading-none">
                      {format(new Date(event.event_date), 'd')}
                    </span>
                    <span className="text-church-gold/70 text-xs font-accent uppercase">
                      {format(new Date(event.event_date), 'MMM')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-white font-bold mb-1">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <HiCalendar className="w-3 h-3 text-church-gold" />
                        {format(new Date(event.event_date), 'EEE, h:mm a')}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <HiLocationMarker className="w-3 h-3 text-church-gold" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-white/50 text-sm mt-3 line-clamp-2">
                    {event.description}
                  </p>
                )}
                
                {event.registration_link && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-church-gold text-sm hover:underline"
                  >
                    Register <HiExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Demo data
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
  {
    id: 4,
    title: 'Marriage Seminar',
    description: 'Building strong, God-honoring marriages that last.',
    event_date: new Date(Date.now() + 86400000 * 21).toISOString(),
    location: 'Family Hall',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04e46?w=400&q=80',
  },
  {
    id: 5,
    title: 'Business Summit',
    description: 'Kingdom principles for business success and marketplace influence.',
    event_date: new Date(Date.now() + 86400000 * 28).toISOString(),
    location: 'Business Center',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
  },
  {
    id: 6,
    title: 'Healing Crusade',
    description: 'A night of divine healing, deliverance, and restoration.',
    event_date: new Date(Date.now() + 86400000 * 35).toISOString(),
    location: 'Main Auditorium',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
  },
]

export default EventsPage
