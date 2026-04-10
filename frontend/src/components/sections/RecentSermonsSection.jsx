import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiPlay, HiDownload, HiShare, HiCalendar, HiClock } from 'react-icons/hi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const RecentSermonsSection = () => {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingSermon, setPlayingSermon] = useState(null)

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      const response = await api.get('/sermons?limit=3')
      setSermons(response.data)
    } catch (error) {
      // Use demo data if API fails
      setSermons(DEMO_SERMONS)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (sermon) => {
    setPlayingSermon(sermon)
    toast.success('Playing sermon...')
    // In a real app, this would play the sermon audio/video
  }

  const handleDownload = (sermon) => {
    // Redirect to Telegram for download
    const telegramUrl = 'https://t.me/lifebuildercitychurch'
    window.open(telegramUrl, '_blank')
    toast('Redirecting to Telegram for download...', {
      icon: '📱',
      duration: 3000,
    })
  }

  const handleShare = (sermon) => {
    const sermonUrl = `${window.location.origin}/sermons/${sermon.id}`
    navigator.clipboard.writeText(sermonUrl)
    toast.success('Sermon link copied to clipboard!')
  }

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-subtitle">Latest Messages</p>
            <h2 className="section-title text-white">Recent <span className="gradient-text">Sermons</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-96 animate-pulse" />
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
          <p className="section-subtitle">Latest Messages</p>
          <h2 className="section-title text-white">Recent <span className="gradient-text">Sermons</span></h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Life-changing messages that will transform your destiny and equip you for purpose.
          </p>
        </motion.div>

        {/* Sermon Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {sermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover:border-church-gold/30 transition-all duration-300 group"
            >
              {/* Sermon Image/Flyer */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                {sermon.thumbnail_url ? (
                  <img
                    src={sermon.thumbnail_url}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-church-purple-mid to-church-purple-light flex items-center justify-center">
                    <HiPlay className="w-16 h-16 text-church-gold/30" />
                  </div>
                )}
                
                {/* Playing indicator */}
                {playingSermon?.id === sermon.id && (
                  <div className="absolute top-3 right-3 bg-church-gold text-church-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-church-dark rounded-full animate-pulse" />
                    Playing
                  </div>
                )}
              </div>

              {/* Sermon Info */}
              <div className="mb-4">
                <h3 className="font-display text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-church-gold transition-colors">
                  {sermon.title}
                </h3>
                
                {sermon.speaker && (
                  <p className="text-church-gold text-sm font-accent tracking-wide mb-1">
                    {sermon.speaker}
                  </p>
                )}

                {sermon.description && (
                  <p className="text-white/60 text-sm line-clamp-3 mb-3">
                    {sermon.description}
                  </p>
                )}

                {/* Date and Duration */}
                <div className="flex items-center gap-4 text-xs text-white/40">
                  {sermon.sermon_date && (
                    <span className="flex items-center gap-1">
                      <HiCalendar className="w-3 h-3 text-church-gold" />
                      {new Date(sermon.sermon_date).toLocaleDateString()}
                    </span>
                  )}
                  {sermon.duration_seconds && (
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3 h-3 text-church-gold" />
                      {Math.floor(sermon.duration_seconds / 60)} min
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePlay(sermon)}
                  className="flex-1 bg-church-gold/20 hover:bg-church-gold/30 text-church-gold border border-church-gold/30 rounded-lg py-2 px-3 text-sm font-medium transition-all flex items-center justify-center gap-1"
                >
                  <HiPlay className="w-4 h-4" />
                  Play
                </button>
                
                <button
                  onClick={() => handleDownload(sermon)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg py-2 px-3 text-sm font-medium transition-all flex items-center justify-center gap-1"
                >
                  <HiDownload className="w-4 h-4" />
                  Download
                </button>
                
                <button
                  onClick={() => handleShare(sermon)}
                  className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg py-2 px-3 text-sm font-medium transition-all"
                >
                  <HiShare className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-32"
          style={{ marginTop: '8rem' }} // Force larger margin
        >
          <Link 
            to="/sermons" 
            className="inline-block px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 relative overflow-hidden group"
            style={{ 
              background: 'linear-gradient(135deg, rgba(3, 11, 31, 1) 0%, rgba(3, 11, 31, 0.96) 65%, rgba(201, 149, 42, 0.45) 100%) !important',
              backdropFilter: 'blur(6px) brightness(0.95) saturate(0.85) !important',
              border: '2px solid rgba(201, 149, 42, 0.8) !important',
              boxShadow: '0 6px 20px rgba(3, 11, 31, 0.5), inset 0 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(201, 149, 42, 0.6), 0 0 15px rgba(201, 149, 42, 0.15) !important',
              color: '#ffffff !important',
              position: 'relative !important',
              textShadow: '0 2px 3px rgba(0, 0, 0, 0.5) !important',
              textDecoration: 'none !important',
              padding: '1rem 2rem !important',
              borderRadius: '9999px !important',
              fontSize: '1.125rem !important',
              fontWeight: '700 !important',
              display: 'inline-block !important',
              overflow: 'hidden !important'
            }}
          >
            {/* Deep glow effect */}
            <div className="absolute inset-0 rounded-full opacity-30" style={{
              background: 'radial-gradient(circle at 25% 25%, rgba(201, 149, 42, 0.6) 0%, transparent 65%)',
              position: 'absolute !important',
              inset: '0 !important',
              borderRadius: '9999px !important',
              opacity: '0.3 !important'
            }}></div>
            
            {/* Dark perfect stars */}
            <span className="absolute top-1 left-2 text-xs opacity-100" style={{ 
              color: '#c9952a !important', 
              textShadow: '0 0 6px rgba(201, 149, 42, 0.8) !important',
              position: 'absolute !important',
              top: '4px !important',
              left: '8px !important',
              fontSize: '0.75rem !important',
              opacity: '1 !important'
            }}>✦</span>
            <span className="absolute top-3 right-3 text-xs opacity-85" style={{ 
              color: '#c9952a !important', 
              textShadow: '0 0 5px rgba(201, 149, 42, 0.6) !important',
              position: 'absolute !important',
              top: '12px !important',
              right: '12px !important',
              fontSize: '0.75rem !important',
              opacity: '0.85 !important'
            }}>✧</span>
            <span className="absolute bottom-2 left-4 text-xs opacity-90" style={{ 
              color: '#c9952a !important', 
              textShadow: '0 0 5px rgba(201, 149, 42, 0.7) !important',
              position: 'absolute !important',
              bottom: '8px !important',
              left: '16px !important',
              fontSize: '0.75rem !important',
              opacity: '0.9 !important'
            }}>✦</span>
            
            {/* Button Text */}
            <span className="relative z-10 font-bold tracking-wide" style={{
              position: 'relative !important',
              zIndex: '10 !important',
              fontWeight: '700 !important',
              letterSpacing: '0.025em !important'
            }}>
              View All Sermons
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Demo data for development
const DEMO_SERMONS = [
  {
    id: 1,
    title: "Your Destiny Is Tied To Your Devotion",
    description: "Discover how your commitment to God directly influences the fulfillment of your divine purpose and destiny.",
    speaker: "Pastor David Adeyemi",
    thumbnail_url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration_seconds: 3600,
  },
  {
    id: 2,
    title: "The Ultimate Strategy: Prayer",
    description: "Learn why prayer is not just a religious duty but the most powerful strategy for every believer.",
    speaker: "Pastor Sarah Adeyemi",
    thumbnail_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration_seconds: 2700,
  },
  {
    id: 3,
    title: "Take It Hard - Success Is A Must",
    description: "Understand the mindset and commitment required to achieve undeniable success in your calling.",
    speaker: "Pastor Emmanuel Obi",
    thumbnail_url: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    duration_seconds: 3300,
  },
]

export default RecentSermonsSection
