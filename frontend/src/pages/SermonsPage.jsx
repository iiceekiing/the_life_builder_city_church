import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlay, HiDownload, HiShare, HiSearch, HiFilter } from 'react-icons/hi'
import { format } from 'date-fns'
import ChurchBackground from '../components/ui/ChurchBackground'

// Demo fallback data with actual audio files found and Dr John Okopi as speaker
const DEMO_SERMONS = [
  {
    id: 1,
    title: 'Is She or He the One',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Identity' },
    duration_seconds: 3240,
    audio_url: '/audio/Is She or He the one - 12th february 2023.mp3',
    video_url: null,
    thumbnail_url: '/images/is_she_or_he.png',
    sermon_date: new Date('2023-02-12').toISOString(),
  },
  {
    id: 2,
    title: 'Love Codes - 7 Difficult Discussions You Must Have Before Marriage',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Relationships' },
    duration_seconds: 2880,
    audio_url: '/audio/Lovecodes_7_difficult_discussions_you_must_have_before_marriage.mp3',
    video_url: null,
    thumbnail_url: '/images/love_codes_difficult_discussions.png',
    sermon_date: new Date('2023-01-15').toISOString(),
  },
  {
    id: 3,
    title: 'Partnering with the Voice of God',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Partnership' },
    duration_seconds: 3600,
    audio_url: '/audio/Partnering with the voice of God- 2nd service 20th nov, 2022.mp3',
    video_url: null,
    thumbnail_url: '/images/partnering_with_the_voice.png',
    sermon_date: new Date('2022-11-20').toISOString(),
  },
  {
    id: 4,
    title: 'Prayer Camp Meeting',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Prayer' },
    duration_seconds: 3120,
    audio_url: '/audio/Prayer Camp Meeting.mp3',
    video_url: null,
    thumbnail_url: '/images/prayer_camp_meeting.png',
    sermon_date: new Date('2023-03-10').toISOString(),
  },
]

const DEMO_CATEGORIES = [
  { id: 1, name: "Identity", slug: "identity" },
  { id: 2, name: "Relationships", slug: "relationships" },
  { id: 3, name: "Partnership", slug: "partnership" },
  { id: 4, name: "Prayer", slug: "prayer" },
]

const SermonsPage = () => {
  const [sermons, setSermons] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [playingSermon, setPlayingSermon] = useState(null)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchSermons()
    fetchCategories()
  }, [selectedCategory, searchTerm])

  const fetchSermons = async () => {
    try {
      setLoading(true)
      // Simulate API call with demo data
      setTimeout(() => {
        let filteredSermons = DEMO_SERMONS
        
        if (selectedCategory) {
          filteredSermons = filteredSermons.filter(sermon => 
            sermon.category.name.toLowerCase() === selectedCategory.toLowerCase()
          )
        }
        
        if (searchTerm) {
          filteredSermons = filteredSermons.filter(sermon => 
            sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        
        setSermons(filteredSermons)
        setLoading(false)
      }, 500)
    } catch (error) {
      setSermons(DEMO_SERMONS)
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setCategories(DEMO_CATEGORIES)
    } catch (error) {
      setCategories(DEMO_CATEGORIES)
    }
  }

  const handlePlay = (sermon) => {
    if (currentlyPlayingId === sermon.id && isPlaying) {
      // Pause current sermon
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
        setPlayingSermon(null)
      }
    } else {
      // Play new sermon
      setPlayingSermon(sermon)
      setCurrentlyPlayingId(sermon.id)
      setIsPlaying(true)
      
      if (audioRef.current) {
        audioRef.current.src = sermon.audio_url
        audioRef.current.play()
      }
    }
  }

  const handleDownload = (sermon) => {
    const telegramUrl = 'https://t.me/lifebuildercitychurch'
    window.open(telegramUrl, '_blank')
  }

  const handleShare = (sermon) => {
    const sermonUrl = `${window.location.origin}/sermons/${sermon.id}`
    navigator.clipboard.writeText(sermonUrl)
    alert('Sermon link copied to clipboard!')
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <ChurchBackground />
      <div className="relative z-10">
        
        {/* Page Hero */}
        <section className="relative text-center px-6 pt-32 pb-16 overflow-hidden">
          {/* Subtle radial glow behind heading */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,149,42,0.07) 0%, transparent 70%)' }} />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-accent text-church-gold text-xs tracking-[.4em] uppercase mb-4"
          >
            Life-Changing Messages
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black text-white leading-tight mb-4"
          >
            Church <em className="gradient-text not-italic">Sermons</em>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-14 h-px bg-gradient-to-r from-transparent via-church-gold to-transparent mx-auto mb-6" 
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-white/70 text-sm leading-loose"
          >
            Powerful teachings that will equip you for purpose and transform your destiny.
            Listen to inspiring messages from our pastors and guest speakers.
          </motion.p>
        </section>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-church-gold/50 focus:border-church-gold/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-church-gold/50 focus:border-church-gold/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-800">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug} className="bg-gray-800">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Sermons Grid */}
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : sermons.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <HiPlay className="w-12 h-12 mx-auto mb-3 text-church-gold/20" />
              <p>No sermons found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="glass-card rounded-2xl overflow-hidden hover:border-church-gold/30 transition-all duration-300 group"
                >
                  {/* Sermon Image */}
                  <div className="relative h-48 overflow-hidden">
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
                    
                    {playingSermon?.id === sermon.id && (
                      <div className="absolute top-3 right-3 bg-church-gold text-church-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-church-dark rounded-full animate-pulse" />
                        Playing
                      </div>
                    )}
                  </div>

                  {/* Sermon Info */}
                  <div className="p-6">
                    <h3 className="font-display text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-church-gold transition-colors">
                      {sermon.title}
                    </h3>
                    
                    <p className="text-church-gold text-sm font-accent tracking-wide mb-2">
                      {sermon.speaker}
                    </p>

                    <p className="text-white/40 text-xs mb-3">
                      {sermon.category.name}
                    </p>

                    {/* Date and Duration */}
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                      <span>{formatDate(sermon.sermon_date)}</span>
                      <span>{formatDuration(sermon.duration_seconds)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlay(sermon)}
                        className="flex-1 btn-gold py-2 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <HiPlay className="w-4 h-4" />
                        {playingSermon?.id === sermon.id ? 'Pause' : 'Play'}
                      </button>
                      
                      <button
                        onClick={() => handleDownload(sermon)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-2 px-3 text-xs font-medium transition-all flex items-center justify-center gap-1"
                      >
                        <HiDownload className="w-4 h-4" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => handleShare(sermon)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-2 px-3 text-xs font-medium transition-all"
                      >
                        <HiShare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} />
      </div>
    </div>
  )
}

export default SermonsPage
