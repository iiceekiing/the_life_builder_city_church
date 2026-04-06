import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiQuote, HiArrowRight } from 'react-icons/hi'
import api from '../../utils/api'

const TestimoniesSection = () => {
  const [testimonies, setTestimonies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchTestimonies()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonies.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonies.length])

  const fetchTestimonies = async () => {
    try {
      const response = await api.get('/testimonies?featured_only=true&limit=6')
      setTestimonies(response.data)
    } catch (error) {
      // Use demo data if API fails
      setTestimonies(DEMO_TESTIMONIES)
    }
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + testimonies.length) % testimonies.length)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonies.length)
  }

  const visibleTestimonies = testimonies.length >= 3 
    ? [
        testimonies[currentIndex],
        testimonies[(currentIndex + 1) % testimonies.length],
        testimonies[(currentIndex + 2) % testimonies.length],
      ]
    : testimonies

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-church-purple/20 via-transparent to-church-purple/20 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">What God Is Doing</p>
          <h2 className="section-title text-white">Testimonies of <span className="gradient-text">His Grace</span></h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Real stories of lives transformed and miracles experienced through the power of God.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative" ref={containerRef}>
          <div className="flex items-center justify-center gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {visibleTestimonies.map((testimony, index) => (
                <motion.div
                  key={`${testimony.id}-${currentIndex}`}
                  initial={{ 
                    opacity: 0, 
                    x: index === 0 ? -100 : index === 1 ? 0 : 100,
                    scale: index === 1 ? 1 : 0.8,
                    zIndex: index === 1 ? 10 : 1
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: index === 1 ? 1 : 0.85,
                    zIndex: index === 1 ? 10 : 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: index === 0 ? 100 : index === 1 ? 0 : -100,
                    scale: index === 1 ? 0.8 : 1,
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                  className={`testimony-card ${
                    index === 1 
                      ? 'md:scale-105 md:border-church-gold/30' 
                      : 'opacity-60 md:opacity-80'
                  } transition-all duration-500 cursor-pointer`}
                  style={{ zIndex: index === 1 ? 10 : 1 }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  onClick={() => index === 1 && handleNext()}
                >
                  <HiQuote className="w-8 h-8 text-church-gold/40 mb-3 rotate-180" />
                  
                  <h4 className="font-display text-church-gold font-semibold mb-2">
                    {testimony.title}
                  </h4>
                  
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-4 mb-4">
                    {testimony.content}
                  </p>
                  
                  <p className="text-white/40 text-xs font-accent tracking-wider">
                    — {testimony.author_name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-2 bg-church-gold' 
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-10 h-10 rounded-full bg-church-gold/20 border border-church-gold/30 flex items-center justify-center text-church-gold hover:bg-church-gold hover:text-church-dark transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-10 h-10 rounded-full bg-church-gold/20 border border-church-gold/30 flex items-center justify-center text-church-gold hover:bg-church-gold hover:text-church-dark transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn-gold inline-flex items-center gap-2">
            Share Your Testimony <HiArrowRight className="w-4 h-4" />
          </button>
          <button className="btn-outline-gold">
            Read More Stories
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// Demo data for development
const DEMO_TESTIMONIES = [
  {
    id: 1,
    author_name: "Sister Grace E.",
    title: "Divine Healing",
    content: "I was diagnosed with a terminal illness but after prayers at Life Builder, God performed a miracle. My doctors cannot explain it! The tumor disappeared completely and all tests came back negative. God is still in the business of healing!",
  },
  {
    id: 2,
    author_name: "Brother Emmanuel K.",
    title: "Financial Breakthrough",
    content: "After years of unemployment, God opened the door I never imagined. I got hired within a week of the breakthrough service with a salary triple what I expected. God's timing is perfect!",
  },
  {
    id: 3,
    author_name: "Deaconess Funke A.",
    title: "Restored Marriage",
    content: "Our marriage was at the point of collapse. Through counseling and prayer here, God restored everything. We are stronger than ever and serving together in the ministry.",
  },
  {
    id: 4,
    author_name: "Brother Michael T.",
    title: "Business Turnaround",
    content: "My business was collapsing with huge debts. After the prophetic service, God turned everything around. All debts cleared and business is thriving beyond imagination!",
  },
  {
    id: 5,
    author_name: "Sister Ruth M.",
    title: "Children of Promise",
    content: "After 12 years of waiting for children, God blessed us with twins. The prayers of the man of God located us and today we are joyful parents.",
  },
  {
    id: 6,
    author_name: "Brother David O.",
    title: "Academic Excellence",
    content: "I was struggling with studies but after prayer and counseling, my academic performance changed dramatically. Graduated with first class honors against all odds!",
  },
]

export default TestimoniesSection
