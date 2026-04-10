import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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
  {
    id: 5,
    title: 'Secrets of Divine Providence',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Providence' },
    duration_seconds: 2940,
    audio_url: '/audio/Secrets of Divine Providence_mixdown.mp3',
    video_url: null,
    thumbnail_url: '/images/img1.jpeg',
    sermon_date: new Date('2023-04-15').toISOString(),
  },
  {
    id: 6,
    title: 'Via Dolorosa',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Suffering' },
    duration_seconds: 3360,
    audio_url: '/audio/VIA DOLOROSA_mixdown.mp3',
    video_url: null,
    thumbnail_url: '/images/suffering_via_dolorosa.png',
    sermon_date: new Date('2023-05-20').toISOString(),
  },
  {
    id: 7,
    title: 'The Person of the Holy Spirit',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Holy Spirit' },
    duration_seconds: 2580,
    audio_url: '/audio/the person of the Holy Spirit_mixdown-1.mp3',
    video_url: null,
    thumbnail_url: '/images/image9.jpeg',
    sermon_date: new Date('2021-08-01').toISOString(),
  },
  {
    id: 8,
    title: 'Whisper - Perceiving the Invisible',
    speaker: 'Dr John Okopi (Global Lead Pastor)',
    category: { name: 'Spiritual Perception' },
    duration_seconds: 3420,
    audio_url: '/audio/whisper_1perceiving_the_invisible_1st_August_2021_Dr_John_Okopi.mp3',
    video_url: null,
    thumbnail_url: '/images/whisper.png',
    sermon_date: new Date('2021-08-01').toISOString(),
  }
]

const SermonCard = ({ 
  sermon, 
  isHovered, 
  isActive, 
  onHover, 
  onLeave, 
  onClick, 
  hoveredId,
  activeId,
  onAudioPlay,
  onAudioEnd,
  currentlyPlayingId
}) => {
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [playIconFilled, setPlayIconFilled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  
  const isHoveredCard = hoveredId === sermon.id
  const isActiveCard = activeId === sermon.id
  
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
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/sermons/${sermon.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleDownload = () => {
    // Track download in backend (mock)
    console.log(`Tracking download for sermon ${sermon.id}`)
    // Would normally: POST /api/v1/sermons/{id}/download
  }
  
  const handlePlay = () => {
    if (sermon.audio_url) {
      const audio = audioRef.current
      
      console.log('Audio element:', audio)
      console.log('Audio URL:', sermon.audio_url)
      console.log('Current isPlaying state:', isPlaying)
      console.log('Currently playing sermon ID:', currentlyPlayingId)
      
      if (isPlaying && currentlyPlayingId === sermon.id) {
        // Pause the audio if this sermon is currently playing
        audio.pause()
        setIsPlaying(false)
        setPlayIconFilled(false)
        setShowPlayer(false)
        console.log('Resuming background music')
        // resumeBackground()
        
        // Clear currently playing ID
        onAudioEnd(sermon.id)
      } else {
        // Stop any other playing audio first
        onAudioPlay(sermon.id)
        
        // Show player first
        setShowPlayer(true)
        
        // Set this card as active
        if (!isActiveCard) {
          onClick(sermon.id)
        }
        
        // Try to play after a short delay to ensure player is visible
        setTimeout(() => {
          if (audio) {
            audio.currentTime = 0
            audio.play().then(() => {
              console.log('Audio played successfully:', sermon.title)
              setIsPlaying(true)
              setPlayIconFilled(true)
            }).catch(error => {
              console.error('Audio play error:', error)
              console.error('Audio network state:', audio.networkState)
              console.error('Audio ready state:', audio.readyState)
              
              // Try to load and play again
              audio.load()
              setTimeout(() => {
                audio.play().catch(err => {
                  console.error('Fallback audio play error:', err)
                  alert(`Unable to play audio: ${sermon.title}. Please check your browser settings.`)
                })
              }, 1000)
            })
          }
        }, 100)
      }
    } else {
      console.error('No audio URL available for sermon:', sermon.title)
      alert(`No audio available for: ${sermon.title}`)
    }
  }
  
  return (
    <motion.div
      className="bg-church-dark/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-church-gold/20 cursor-pointer"
      initial={false}
      animate={{
        scale: isActiveCard ? 1.06 : isHoveredCard ? 1.04 : hoveredId ? 0.97 : 1,
        opacity: hoveredId && !isHoveredCard ? 0.75 : 1,
        zIndex: isHoveredCard ? 10 : 1,
        boxShadow: isHoveredCard ? '0 20px 60px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        borderColor: isActiveCard ? '#c9952a' : isHoveredCard ? '#c9952a' : 'rgba(201, 149, 42, 0.2)',
        borderWidth: isActiveCard ? '1.5px' : isHoveredCard ? '1px' : '1px'
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      onHoverStart={() => onHover(sermon.id)}
      onHoverEnd={onLeave}
      onClick={() => onClick(sermon.id)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-[1/1] bg-church-purple/50 group">
        {/* Sermon thumbnail image */}
        {sermon.thumbnail_url ? (
          <img 
            src={sermon.thumbnail_url} 
            alt={sermon.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMjQgMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2MjIyMjIi8+PHJlY3QgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNjOTk1MmEiLz48L3N2Zz4='
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-church-gold/30 text-6xl">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-church-gold text-church-dark px-3 py-1 rounded-full text-xs font-bold">
            {sermon.category.name}
          </span>
        </div>
        
        {/* Play Button Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handlePlay()
          }}
        >
          {isActiveCard ? (
            <motion.div
              className="w-12 h-12 bg-church-gold rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg className="w-6 h-6 text-church-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.div>
          ) : (
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <svg className="w-6 h-6 text-church-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Active Card Dark Overlay */}
        {isActiveCard && (
          <div className="absolute inset-0 bg-black/50" />
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-church-gold text-sm font-bold">
            {sermon.category.name}
          </span>
        </div>
        
        <h3 className="text-white font-serif text-xl font-bold mb-2 line-clamp-2">
          {sermon.title}
        </h3>
        
        <p className="text-white/60 text-sm mb-2">
          {sermon.speaker}
        </p>
        
        <p className="text-white/40 text-xs">
          {formatDuration(sermon.duration_seconds)} · {formatDate(sermon.sermon_date)}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePlay()
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              playIconFilled 
                ? 'bg-church-gold text-church-dark' 
                : 'bg-church-purple text-white hover:bg-church-purple/80'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              {playIconFilled ? 'Playing' : 'Play'}
            </span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDownloadModal(true)
            }}
            className="flex-1 py-1 px-4 bg-church-purple text-white rounded-lg font-medium hover:bg-church-purple/80 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowSharePanel(!showSharePanel)
            }}
            className="flex-1 py-2 px-4 bg-church-purple text-white rounded-lg font-medium hover:bg-church-purple/80 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
              </svg>
              Share
            </span>
          </button>
        </div>
        
        {/* Share Panel */}
        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-church-purple/50 rounded-lg"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/sermons/${sermon.id}`}
                  readOnly
                  className="flex-1 bg-church-dark/50 text-white px-3 py-2 rounded text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-church-gold text-church-dark rounded font-medium hover:bg-church-gold/90 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Audio/Video Player */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-church-purple/50 rounded-lg"
            >
              <div className="text-white">
                <p className="mb-2 font-medium">Now Playing: {sermon.title}</p>
                <p className="text-sm text-white/60 mb-4">Speaker: {sermon.speaker}</p>
                
                {/* HTML5 Audio Player */}
                {sermon.audio_url && (
                  <audio
                    ref={audioRef}
                    controls
                    className="w-full"
                    src={sermon.audio_url}
                    data-sermon-id={sermon.id}
                    preload="metadata"
                    onPlay={() => {
                      console.log('Audio started:', sermon.title)
                      setIsPlaying(true)
                    }}
                    onPause={() => {
                      console.log('Audio paused:', sermon.title)
                      setIsPlaying(false)
                    }}
                    onEnded={() => {
                      console.log('Audio ended:', sermon.title)
                      setShowPlayer(false)
                      setPlayIconFilled(false)
                      setIsPlaying(false)
                      onAudioEnd(sermon.id)
                      // resumeBackground()
                    }}
                    onError={(e) => {
                      console.error('Audio error:', e)
                      console.log('Audio URL:', sermon.audio_url)
                    }}
                    onCanPlay={() => {
                      console.log('Audio can play:', sermon.title)
                    }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
                
                {!sermon.audio_url && (
                  <div className="text-center py-4">
                    <p className="text-white/60">Audio coming soon for this sermon</p>
                    <p className="text-white/40 text-sm mt-2">Check back later or download from Telegram</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-church-dark rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-bold mb-4">Download Sermon</h3>
              <p className="text-white/80 mb-6">
                You're about to be redirected to Life Builder City Church's official Telegram channel, where you can download this sermon and access hundreds of other life-transforming messages.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDownload()
                    window.open('https://t.me/glorylifechurch', '_blank')
                    setShowDownloadModal(false)
                  }}
                  className="flex-1 bg-church-gold text-church-dark py-3 rounded-lg font-medium hover:bg-church-gold/90 transition-colors"
                >
                  Take me there
                </button>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 bg-church-purple text-white py-3 rounded-lg font-medium hover:bg-church-purple/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SermonsPreviewSection = () => {
  const [sermons, setSermons] = useState(DEMO_SERMONS.slice(0, 6))
  const [hoveredId, setHoveredId] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null) // Track which sermon is playing
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  
  useEffect(() => {
    // Fetch sermons from API
    const fetchSermons = async () => {
      try {
        const response = await fetch('/api/v1/sermons?limit=3&published_only=true')
        if (response.ok) {
          const data = await response.json()
          setSermons(data)
        } else {
          // Use demo data if API fails
          setSermons(DEMO_SERMONS)
        }
      } catch (error) {
        console.error('Error fetching sermons:', error)
        setSermons(DEMO_SERMONS)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSermons()
    
    // Intersection Observer to deactivate active card when section is out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            setActiveId(null)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])
  
  const handleCardHover = (id) => {
    // Disable hover effects on touch devices
    if (window.matchMedia('(hover: none)').matches) return
    setHoveredId(id)
  }
  
  const handleCardLeave = () => {
    setHoveredId(null)
  }
  
  const handleCardClick = (id) => {
    setActiveId(activeId === id ? null : id)
  }
  
  const handleAudioPlay = (sermonId) => {
    // If a different sermon is playing, stop it first
    if (currentlyPlayingId && currentlyPlayingId !== sermonId) {
      // Find the previous audio element and stop it
      const previousAudio = document.querySelector(`audio[data-sermon-id="${currentlyPlayingId}"]`)
      if (previousAudio) {
        previousAudio.pause()
        previousAudio.currentTime = 0
      }
    }
    
    // Set the new currently playing sermon
    setCurrentlyPlayingId(sermonId)
  }
  
  const handleAudioEnd = (sermonId) => {
    // Clear the currently playing ID when audio ends
    if (currentlyPlayingId === sermonId) {
      setCurrentlyPlayingId(null)
    }
  }
  
  const handleViewAll = () => {
    navigate('/sermons')
  }
  
  return (
    <section className="relative py-24 px-6" style={{ 
      backgroundColor: '#ffffff'
    }}>
      {/* Church Background */}
      <div className="absolute inset-0">
        {/* ChurchBackground component would go here */}
      </div>
      
      <div className="relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-accent" style={{ color: '#e1b02a' }}>
            The Word Of GOD is Our CELEBRITY
          </h2>
          <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
            Latest Sermons
          </h3>
          <p className="text-white/60">
            Be inspired and transformed by powerful teachings from our pastors
          </p>
        </div>
        
        {/* Sermon Cards */}
        {loading ? (
          <div className="flex justify-center">
            <div className="text-white">Loading sermons...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sermons.slice(0, 6).map((sermon, index) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                isHovered={hoveredId === sermon.id}
                isActive={activeId === sermon.id}
                hoveredId={hoveredId}
                activeId={activeId}
                onHover={handleCardHover}
                onLeave={handleCardLeave}
                onClick={handleCardClick}
                onAudioPlay={handleAudioPlay}
                onAudioEnd={handleAudioEnd}
                currentlyPlayingId={currentlyPlayingId}
              />
            ))}
          </div>
        )}
        
        {/* View All CTA */}
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <button
            onClick={handleViewAll}
            style={{
              backgroundColor: '#030b1f',
              border: '2px solid #c9952a',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(3, 11, 31, 0.3)'
            }}
          >
            {/* Simple gold stars */}
            <span style={{
              position: 'absolute',
              top: '8px',
              left: '12px',
              color: '#c9952a',
              fontSize: '12px',
              zIndex: '2'
            }}>✦</span>
            <span style={{
              position: 'absolute',
              top: '20px',
              right: '16px',
              color: '#c9952a',
              fontSize: '12px',
              zIndex: '2'
            }}>✧</span>
            <span style={{
              position: 'absolute',
              bottom: '12px',
              left: '20px',
              color: '#c9952a',
              fontSize: '12px',
              zIndex: '2'
            }}>✦</span>
            
            {/* Button text */}
            <span style={{
              position: 'relative',
              zIndex: '3',
              fontWeight: 'bold'
            }}>
              View All Sermons
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default SermonsPreviewSection
