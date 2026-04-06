import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const HeroSection = ({ quotes }) => {
  const [quoteIdx, setQuoteIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(i => (i + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-church-dark/80 via-church-dark/60 to-church-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-church-purple/60 via-transparent to-church-purple/40" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-church-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-church-purple-light/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/sermons" className="btn-gold text-base px-8 py-4">
            Watch Sermons
          </Link>
          <Link to="/appointments" className="btn-outline-gold text-base px-8 py-4">
            Book Appointment
          </Link>
        </motion.div>
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
    </section>
  )
}

export default HeroSection
