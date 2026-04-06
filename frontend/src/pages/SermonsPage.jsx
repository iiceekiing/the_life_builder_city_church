import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlay, HiDownload, HiShare, HiSearch, HiFilter } from 'react-icons/hi'
import { format } from 'date-fns'
import api from '../utils/api'
import toast from 'react-hot-toast'

const SermonsPage = () => {
  const [sermons, setSermons] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [playingSermon, setPlayingSermon] = useState(null)

  useEffect(() => {
    fetchSermons()
    fetchCategories()
  }, [selectedCategory, searchTerm])

  const fetchSermons = async () => {
    try {
      setLoading(true)
      let url = '/sermons?limit=20'
      if (selectedCategory) url += `&category=${selectedCategory}`
      if (searchTerm) url += `&search=${searchTerm}`
      
      const response = await api.get(url)
      setSermons(response.data)
    } catch (error) {
      setSermons(DEMO_SERMONS)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/sermons/categories')
      setCategories(response.data)
    } catch (error) {
      setCategories(DEMO_CATEGORIES)
    }
  }

  const handlePlay = (sermon) => {
    setPlayingSermon(sermon)
    toast.success('Playing sermon...')
  }

  const handleDownload = (sermon) => {
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

  return (
    <div className="min-h-screen pt-24 pb-32">
      {/* Header */}
      <div className="page-hero py-16">
        <div className="relative text-center">
          <p className="section-subtitle">Life-Changing Messages</p>
          <h1 className="section-title text-white">Church <span className="gradient-text">Sermons</span></h1>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Powerful teachings that will equip you for purpose and transform your destiny.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-14">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search sermons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-96 animate-pulse" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card hover:border-church-gold/30 transition-all duration-300 group"
              >
                {/* Sermon Image */}
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

                  {sermon.category && (
                    <p className="text-white/40 text-xs mb-2">
                      {sermon.category.name}
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
                      <span>
                        {format(new Date(sermon.sermon_date), 'MMM d, yyyy')}
                      </span>
                    )}
                    {sermon.duration_seconds && (
                      <span>
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
        )}
      </div>
    </div>
  )
}

// Demo data
const DEMO_SERMONS = [
  {
    id: 1,
    title: "Your Destiny Is Tied To Your Devotion",
    description: "Discover how your commitment to God directly influences the fulfillment of your divine purpose and destiny.",
    speaker: "Pastor David Adeyemi",
    category: { name: "Destiny" },
    thumbnail_url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration_seconds: 3600,
  },
  {
    id: 2,
    title: "The Ultimate Strategy: Prayer",
    description: "Learn why prayer is not just a religious duty but the most powerful strategy for every believer.",
    speaker: "Pastor Sarah Adeyemi",
    category: { name: "Prayer" },
    thumbnail_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration_seconds: 2700,
  },
  {
    id: 3,
    title: "Take It Hard - Success Is A Must",
    description: "Understand the mindset and commitment required to achieve undeniable success in your calling.",
    speaker: "Pastor Emmanuel Obi",
    category: { name: "Success" },
    thumbnail_url: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80",
    sermon_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    duration_seconds: 3300,
  },
]

const DEMO_CATEGORIES = [
  { id: 1, name: "Prayer", slug: "prayer" },
  { id: 2, name: "Success", slug: "success" },
  { id: 3, name: "Destiny", slug: "destiny" },
  { id: 4, name: "Faith", slug: "faith" },
]

export default SermonsPage
