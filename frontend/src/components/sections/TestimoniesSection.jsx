import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Demo fallback testimonies
const DEMO_TESTIMONIES = [
  {
    id: 1,
    title: "Divine Healing",
    content: "I was diagnosed with a chronic illness that doctors said had no cure. After prayer at Life Builder City Church, I went back for tests and the doctors confirmed I was completely healed. God's power is real!",
    author: "Sister Grace E.",
    date: new Date('2023-03-15').toISOString(),
    approved: true
  },
  {
    id: 2,
    title: "Financial Breakthrough",
    content: "I lost my job and was in deep debt. During the breakthrough service, Pastor John prayed for divine provision. The next day, I received three job offers and a miracle settlement!",
    author: "Brother Michael T.",
    date: new Date('2023-04-20').toISOString(),
    approved: true
  },
  {
    id: 3,
    title: "Marriage Restored",
    content: "My marriage was on the brink of divorce. After attending the marriage conference and applying the principles taught, my husband and I reconciled. Our marriage is now stronger than ever!",
    author: "Sister Sarah K.",
    date: new Date('2023-05-10').toISOString(),
    approved: true
  },
  {
    id: 4,
    title: "Academic Excellence",
    content: "I was struggling with my studies and failing exams. After the anointing service, I received supernatural wisdom and passed all my papers with distinctions!",
    author: "Brother David A.",
    date: new Date('2023-06-12').toISOString(),
    approved: true
  },
  {
    id: 5,
    title: "Deliverance from Addiction",
    content: "I was bound by addiction for 15 years. The deliverance prayers at Life Builder City Church set me completely free. I've been clean for over a year now!",
    author: "Sister Rachel M.",
    date: new Date('2023-07-08').toISOString(),
    approved: true
  },
  {
    id: 6,
    title: "Child of Promise",
    content: "Doctors said I could never have children. After the prayer for the barren, I conceived and now have a beautiful baby boy. God proved the doctors wrong!",
    author: "Sister Elizabeth P.",
    date: new Date('2023-08-22').toISOString(),
    approved: true
  }
]

const TestimonyCard = ({ testimony, isHovered, onHover, onLeave, onClick }) => {
  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <motion.div
      className="bg-church-dark/80 backdrop-blur-sm rounded-2xl border-l-2 border-l-church-gold p-6 min-w-[300px] max-w-[320px] cursor-pointer transition-all duration-300"
      whileHover={{ 
        scale: 1.05, 
        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
        borderLeftWidth: '4px'
      }}
      onHoverStart={() => onHover?.(testimony.id)}
      onHoverEnd={() => onLeave?.()}
      onClick={() => onClick?.(testimony)}
    >
      {/* Gold Quote Mark */}
      <div className="text-church-gold text-4xl mb-3 leading-none">
        "
      </div>
      
      {/* Testimony Title */}
      <h3 className="text-church-gold font-bold text-lg mb-2 font-playfair">
        {testimony.title}
      </h3>
      
      {/* Testimony Content */}
      <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-3">
        {truncateText(testimony.content)}
      </p>
      
      {/* Author */}
      <p className="text-white/40 text-xs">
        — {testimony.author}
      </p>
    </motion.div>
  )
}

const TestimoniesSection = () => {
  const [testimonies, setTestimonies] = useState(DEMO_TESTIMONIES)
  const [loading, setLoading] = useState(true)
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [selectedTestimony, setSelectedTestimony] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()
  const sectionRef = useRef(null)

  useEffect(() => {
    // Fetch testimonies from API
    const fetchTestimonies = async () => {
      try {
        const response = await fetch('/api/v1/testimonies?limit=12')
        if (response.ok) {
          const data = await response.json()
          // Duplicate for seamless loop
          setTestimonies([...data, ...data])
        } else {
          // Use demo data and duplicate for seamless loop
          setTestimonies([...DEMO_TESTIMONIES, ...DEMO_TESTIMONIES])
        }
      } catch (error) {
        console.error('Error fetching testimonies:', error)
        // Use demo data and duplicate for seamless loop
        setTestimonies([...DEMO_TESTIMONIES, ...DEMO_TESTIMONIES])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonies()
  }, [])

  const handleCardClick = (testimony) => {
    setSelectedTestimony(testimony)
  }

  const handleShareTestimony = () => {
    navigate('/testimony')
  }

  const handleReadAll = () => {
    navigate('/testimonies')
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    setHoveredCardId(null)
  }

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background with purple gradient overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-church-purple/10 via-transparent to-church-purple/10" />
      </div>
      
      <div className="relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-church-gold text-sm font-bold tracking-widest mb-4 font-cinzel">
            [ WHAT GOD IS DOING ]
          </h2>
          <h3 className="text-white text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Testimonies of His Grace
          </h3>
        </div>

        {/* Testimonies Ticker */}
        {loading ? (
          <div className="flex justify-center">
            <div className="text-white">Loading testimonies...</div>
          </div>
        ) : (
          <div className="relative">
            {/* Top Row - Scrolling Left */}
            <div className="mb-8 overflow-hidden">
              <div 
                className={`flex gap-6 ${isPaused ? 'animation-paused' : ''}`}
                style={{
                  animation: isPaused ? 'none' : 'marquee-left 60s linear infinite',
                  width: 'max-content'
                }}
              >
                {[...testimonies, ...testimonies].map((testimony, index) => (
                  <TestimonyCard
                    key={`top-${testimony.id}-${index}`}
                    testimony={testimony}
                    isHovered={hoveredCardId === testimony.id}
                    onHover={setHoveredCardId}
                    onLeave={() => setHoveredCardId(null)}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Row - Scrolling Right */}
            <div className="overflow-hidden">
              <div 
                className={`flex gap-6 ${isPaused ? 'animation-paused' : ''}`}
                style={{
                  animation: isPaused ? 'none' : 'marquee-right 60s linear infinite',
                  width: 'max-content'
                }}
              >
                {[...testimonies, ...testimonies].reverse().map((testimony, index) => (
                  <TestimonyCard
                    key={`bottom-${testimony.id}-${index}`}
                    testimony={testimony}
                    isHovered={hoveredCardId === testimony.id}
                    onHover={setHoveredCardId}
                    onLeave={() => setHoveredCardId(null)}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="text-center mt-12">
          <button
            onClick={handleShareTestimony}
            className="bg-church-gold text-church-dark px-8 py-3 rounded-lg font-medium hover:bg-church-gold/90 transition-colors mr-4"
          >
            Share Your Testimony
          </button>
          <button
            onClick={handleReadAll}
            className="border border-church-gold text-church-gold px-8 py-3 rounded-lg font-medium hover:bg-church-gold hover:text-church-dark transition-colors"
          >
            Read All Testimonies
          </button>
        </div>
      </div>

      {/* Testimony Modal */}
      <AnimatePresence>
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
              className="bg-church-dark/90 backdrop-blur-md rounded-2xl border border-church-gold/30 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-church-gold text-4xl mb-4 leading-none">
                "
              </div>
              
              <h2 className="text-church-gold text-2xl font-bold mb-4 font-playfair">
                {selectedTestimony.title}
              </h2>
              
              <p className="text-white/80 leading-relaxed mb-6">
                {selectedTestimony.content}
              </p>
              
              <p className="text-white/60 text-sm mb-6">
                — {selectedTestimony.author}
              </p>
              
              <button
                onClick={() => setSelectedTestimony(null)}
                className="bg-church-gold text-church-dark px-6 py-2 rounded-lg font-medium hover:bg-church-gold/90 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animation-paused {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  )
}

export default TestimoniesSection
