import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ChurchBackground from '../ui/ChurchBackground'

// Hero background images array
const HERO_IMAGES = [
  '/images/hero_section_bg.jpeg',
  '/images/hero_section_bg3.jpeg',
  '/images/hero_section_bg4.jpeg',
  '/images/hero_section_bg5.jpeg',
  '/images/hero_section_bg6.jpeg',
  '/images/hero_section_bg7.jpeg',
  '/images/hero_section_bg8.jpeg',
  '/images/hero_section_bg9.jpeg',
  '/images/hero_section_bg10.jpeg',
  '/images/hero_section_bg11.jpeg',
  '/images/hero_section_bg12.jpeg'
]

const HeroSection = ({ quotes, imageOpacity = 0.28 }) => {
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [imageIdx, setImageIdx] = useState(0)

  // Quote rotation - every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(i => (i + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [quotes.length])

  // Image rotation - every 15 seconds (longer display time)
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIdx(i => (i + 1) % HERO_IMAGES.length)
    }, 15000) // 15 seconds for longer display time
    return () => clearInterval(interval)
  }, [])

  // Get current image based on image index (separate from quote index)
  const currentImage = HERO_IMAGES[imageIdx]

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Layer 1 - Animated star/bokeh/glow canvas */}
      <ChurchBackground />

      {/* Layer 2 - Church photo, semi-transparent with synchronized transitions */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1.0, opacity: imageOpacity }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ 
              duration: 3.0, // Twice as slow (3 seconds instead of 1.5)
              ease: 'easeInOut',
              opacity: { duration: 2.4 }, // Slower opacity transition
              scale: { duration: 8 }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        </AnimatePresence>
      </div>

      {/* Layer 3 - Dark gradient overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: `
          linear-gradient(
            to bottom,
            rgba(3,11,31,0.55) 0%,
            rgba(3,11,31,0.35) 40%,
            rgba(3,11,31,0.70) 80%,
            rgba(3,11,31,0.95) 100%
          )
        `,
      }} />

      {/* Mask baked-in text with subtle dark gradient patch */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '55%',
        background: 'linear-gradient(to bottom, rgba(3,11,31,0.7) 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Layer 4 - Hero text content */}
      <div style={{ position: 'relative', zIndex: 3 }} className="text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-screen">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-church-gold animate-pulse" />
          <span className="font-accent text-church-gold text-xs tracking-[0.3em] uppercase">Welcome Home</span>
        </motion.div>

        {/* Welcome Home Button - Above Church Name */}
        <div className="flex justify-center mb-4">
          <Link to="/" className="text-church-gold hover:text-church-gold/80 transition-colors duration-300">
            Welcome Home
          </Link>
        </div>

        {/* Church Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none"
        >
          Life <span className="gradient-text">Builder</span>
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white/90">City Church</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-accent text-church-gold text-sm tracking-widest uppercase mb-8"
        >
          Breathing Life Into You
        </motion.p>

        {/* Rotating Quote */}
        <div className="h-28 flex flex-col items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <p className="font-display text-xl md:text-3xl text-white/90 italic font-light max-w-3xl">
                "{quotes[quoteIdx]}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quote dots */}
        <div className="flex justify-center gap-2 mb-10">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setQuoteIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === quoteIdx ? 'w-6 h-2 bg-church-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
          <a 
            href="https://www.youtube.com/@glory-life-church" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-gold text-base px-8 py-4"
          >
            Watch Sermons
          </a>
          <Link to="/partnership" className="btn-outline-gold text-base px-8 py-4">
            Partner With Us
          </Link>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-accent text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-church-gold/60 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
