import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlay, HiDocumentText, HiMicrophone, HiCalendar, HiUser } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import ChurchBackground from '../components/ui/ChurchBackground'

const TestimoniesPage = () => {
  const [testimonies, setTestimonies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedTestimony, setSelectedTestimony] = useState(null)

  useEffect(() => {
    fetchTestimonies()
  }, [])

  const fetchTestimonies = async () => {
    try {
      setLoading(true)
      const response = await api.get('/testimonies?limit=100')
      setTestimonies(response.data || [])
    } catch (error) {
      console.error('Error fetching testimonies:', error)
      setTestimonies([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTestimonies = testimonies.filter(testimony => {
    if (filter === 'all') return true
    return testimony.testimony_type === filter
  })

  const TestimonyCard = ({ testimony }) => {
    const isText = testimony.testimony_type === 'text'
    const isAudio = testimony.testimony_type === 'audio'
    const isVideo = testimony.testimony_type === 'video'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="glass-card rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
        onClick={() => setSelectedTestimony(testimony)}
      >
        {/* Header with type indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {isText && <HiDocumentText className="w-5 h-5 text-church-gold" />}
            {isAudio && <HiMicrophone className="w-5 h-5 text-church-gold" />}
            {isVideo && <HiPlay className="w-5 h-5 text-church-gold" />}
            <span className="text-church-gold text-sm font-medium capitalize">
              {testimony.testimony_type} Testimony
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <HiCalendar className="w-4 h-4" />
            {new Date(testimony.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 font-playfair">
          {testimony.title}
        </h3>

        {/* Content */}
        {isText ? (
          <p className="text-white/70 leading-relaxed mb-4 line-clamp-3">
            {testimony.content}
          </p>
        ) : (
          <div className="mb-4">
            {isAudio && testimony.audio_url && (
              <audio controls className="w-full rounded-lg bg-black/20">
                <source src={testimony.audio_url} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            )}
            {isVideo && testimony.video_url && (
              <video controls className="w-full rounded-lg bg-black/20">
                <source src={testimony.video_url} type="video/webm" />
                Your browser does not support the video element.
              </video>
            )}
            {testimony.content && (
              <p className="text-white/60 text-sm mt-3 italic">
                "{testimony.content}"
              </p>
            )}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <HiUser className="w-4 h-4 text-white/40" />
            <span className="text-white/60 text-sm">
              {testimony.author_name}
            </span>
          </div>
          {testimony.is_featured && (
            <span className="px-2 py-1 bg-church-gold/20 text-church-gold text-xs rounded-full border border-church-gold/30">
              Featured
            </span>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-church-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-gold mx-auto mb-4"></div>
          <p>Loading testimonies...</p>
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
            Testimonies of God's Faithfulness
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Real stories of divine intervention, healing, and transformation in our community
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1">
            {['all', 'text', 'audio', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-church-gold text-church-dark'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'All Testimonies' : `${type.charAt(0).toUpperCase() + type.slice(1)} Testimonies`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Testimonies Grid */}
        {filteredTestimonies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-church-gold/20 flex items-center justify-center mb-4">
              <HiDocumentText className="w-10 h-10 text-church-gold/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No testimonies found</h3>
            <p className="text-white/60">
              {filter === 'all' 
                ? 'No testimonies have been shared yet.' 
                : `No ${filter} testimonies have been shared yet.`
              }
            </p>
            <Link
              to="/share-testimony"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-church-gold text-church-dark rounded-lg hover:bg-church-gold/90 transition-colors font-medium"
            >
              <HiDocumentText className="w-4 h-4" />
              Share Your Testimony
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonies.map((testimony, index) => (
              <motion.div
                key={testimony.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TestimonyCard testimony={testimony} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Testimony Modal */}
        {selectedTestimony && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTestimony(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-church-dark/90 backdrop-blur-md rounded-2xl border border-church-gold/30 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  {selectedTestimony.testimony_type === 'text' && <HiDocumentText className="w-6 h-6 text-church-gold" />}
                  {selectedTestimony.testimony_type === 'audio' && <HiMicrophone className="w-6 h-6 text-church-gold" />}
                  {selectedTestimony.testimony_type === 'video' && <HiPlay className="w-6 h-6 text-church-gold" />}
                  <span className="text-church-gold text-lg font-medium capitalize">
                    {selectedTestimony.testimony_type} Testimony
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTestimony(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 font-playfair">
                {selectedTestimony.title}
              </h2>

              <div className="mb-6">
                {selectedTestimony.testimony_type === 'text' && (
                  <p className="text-white/80 leading-relaxed text-lg">
                    {selectedTestimony.content}
                  </p>
                )}
                {selectedTestimony.testimony_type === 'audio' && selectedTestimony.audio_url && (
                  <div>
                    <audio controls className="w-full rounded-lg bg-black/20 mb-4">
                      <source src={selectedTestimony.audio_url} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                    {selectedTestimony.content && (
                      <p className="text-white/60 italic">
                        "{selectedTestimony.content}"
                      </p>
                    )}
                  </div>
                )}
                {selectedTestimony.testimony_type === 'video' && selectedTestimony.video_url && (
                  <div>
                    <video controls className="w-full rounded-lg bg-black/20 mb-4">
                      <source src={selectedTestimony.video_url} type="video/webm" />
                      Your browser does not support the video element.
                    </video>
                    {selectedTestimony.content && (
                      <p className="text-white/60 italic">
                        "{selectedTestimony.content}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <HiUser className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">
                    {selectedTestimony.author_name}
                  </span>
                </div>
                <div className="text-white/40 text-sm">
                  {new Date(selectedTestimony.created_at).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TestimoniesPage
