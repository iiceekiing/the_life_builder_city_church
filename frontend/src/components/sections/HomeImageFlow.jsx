import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HomeImageFlow = () => {
  // First row images - right to left
  const [firstRowImages] = useState([
    { id: 1, src: '/images/gallery1.png', alt: 'Church Service' },
    { id: 3, src: '/images/gallery3.png', alt: 'Community Event' },
    { id: 4, src: '/images/gallery4.png', alt: 'Baptism Ceremony' },
    { id: 5, src: '/images/gallery5.png', alt: 'Youth Ministry' },
    { id: 6, src: '/images/gallery6.png', alt: 'Prayer Meeting' },
    { id: 7, src: '/images/gallery7.png', alt: 'Church Building' },
    { id: 8, src: '/images/gallery8.png', alt: 'Choir Performance' },
    { id: 9, src: '/images/gallery9.png', alt: 'Bible Study' },
    { id: 10, src: '/images/gallery10.png', alt: 'Outreach Program' },
    { id: 11, src: '/images/gallery11.png', alt: 'Fellowship Gathering' },
    { id: 12, src: '/images/gallery12.png', alt: 'Sunday School' },
    { id: 13, src: '/images/gallery13.png', alt: 'Mission Trip' },
    { id: 14, src: '/images/gallery14.png', alt: 'Church Conference' },
    { id: 15, src: '/images/gallery15.png', alt: 'Praise & Worship' },
    { id: 16, src: '/images/gallery16.png', alt: 'Church Leadership' },
    { id: 17, src: '/images/gallery17.jpeg', alt: 'Church Service 2' },
    { id: 18, src: '/images/gallery18.jpeg', alt: 'Worship Session 2' },
    { id: 19, src: '/images/gallery19.jpeg', alt: 'Community Event 2' },
    { id: 20, src: '/images/gallery20.jpeg', alt: 'Baptism Ceremony 2' }
  ])

  // Second row images - left to right
  const [secondRowImages] = useState([
    { id: 21, src: '/images/gallery21.jpeg', alt: 'Church Service 3' },
    { id: 22, src: '/images/gallery22.jpeg', alt: 'Worship Session 3' },
    { id: 23, src: '/images/gallery23.jpeg', alt: 'Community Event 3' },
    { id: 24, src: '/images/gallery24.jpeg', alt: 'Baptism Ceremony 3' },
    { id: 25, src: '/images/gallery25.jpeg', alt: 'Youth Ministry 2' },
    { id: 26, src: '/images/gallery26.jpeg', alt: 'Prayer Meeting 2' },
    { id: 27, src: '/images/gallery27.jpeg', alt: 'Church Building 2' },
    { id: 28, src: '/images/gallery28.jpeg', alt: 'Choir Performance 2' },
    { id: 29, src: '/images/gallery29.jpeg', alt: 'Bible Study 2' },
    { id: 30, src: '/images/gallery30.jpeg', alt: 'Outreach Program 2' }
  ])

  const [activeIndex, setActiveIndex] = useState(0)
  const [activeSecondIndex, setActiveSecondIndex] = useState(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    // Auto-rotate first row images
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % firstRowImages.length)
      setActiveSecondIndex(prev => (prev + 1) % secondRowImages.length)
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Subtle animation
    const rotationInterval = setInterval(() => {
      rotationRef.current += 0.5
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-subtitle text-church-purple">Our Community</p>
          <h2 className="section-title text-church-dark">Gallery of <span className="gradient-text">Moments</span></h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Capturing the life-changing moments and vibrant community at Life Builder City Church.
          </p>
        </motion.div>

        {/* Two Row Grid with Opposite Flow */}
        <div className="relative">
          {/* First Row - Right to Left */}
          <motion.div
            animate={{ x: -rotationRef.current * 0.5 }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            className="grid grid-cols-4 gap-4 md:gap-6 mb-6"
          >
            <AnimatePresence>
              {firstRowImages.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0.7,
                    scale: activeIndex === index ? 1.15 : 1,
                    filter: activeIndex === index ? 'none' : 'blur(1px)',
                    zIndex: activeIndex === index ? 10 : 1,
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Active image glow */}
                  {activeIndex === index && (
                    <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-church-gold/20" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Second Row - Left to Right */}
          <motion.div
            animate={{ x: rotationRef.current * 0.5 }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            className="grid grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {secondRowImages.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: activeSecondIndex === index ? 1 : 0.7,
                    scale: activeSecondIndex === index ? 1.15 : 1,
                    filter: activeSecondIndex === index ? 'none' : 'blur(1px)',
                    zIndex: activeSecondIndex === index ? 10 : 1,
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Active image glow */}
                  {activeSecondIndex === index && (
                    <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-church-gold/20" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-gold text-church-dark">
            View Full Gallery
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default HomeImageFlow
