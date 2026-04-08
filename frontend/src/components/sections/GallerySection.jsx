import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleImages, setVisibleImages] = useState([])
  const [imageQueue, setImageQueue] = useState([])
  const rotationRef = useRef(0)

  // Sample gallery images - in production these would come from API
  const initialImages = [
    'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80',
    'https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04e46?w=400&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'https://images.unsplash.com/photo-1516035068373-80bbfb5d0e4f?w=400&q=80',
    'https://images.unsplash.com/photo-1517420832552-3f5cb5f6a3c5?w=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'https://images.unsplash.com/photo-1516035068373-80bbfb5d0e4f?w=400&q=80',
    'https://images.unsplash.com/photo-1517420832552-3f5cb5f6a3c5?w=400&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  ]

  useEffect(() => {
    // Initialize visible images - only first row
    setVisibleImages(initialImages.slice(0, 8))
    setImageQueue(initialImages.slice(8))

    // Auto-rotate active image - much slower
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 8)
    }, 15000) // Much slower: 15 seconds instead of 8

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Subtle grid rotation
    const rotationInterval = setInterval(() => {
      rotationRef.current += 0.5
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  useEffect(() => {
    // Seamless image replacement - only first row
    const replacementInterval = setInterval(() => {
      if (imageQueue.length > 0) {
        const randomIndex = Math.floor(Math.random() * 8)
        const newImage = imageQueue[0]
        
        setVisibleImages(prev => {
          const updated = [...prev]
          updated[randomIndex] = newImage
          return updated
        })
        
        setImageQueue(prev => prev.slice(1))
      }
    }, 4500)

    return () => clearInterval(replacementInterval)
  }, [imageQueue])

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

        {/* Animated Grid */}
        <div className="relative">
          <motion.div
            animate={{ rotate: rotationRef.current }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            className="grid grid-cols-4 gap-4 md:gap-6"
            style={{ transform: `rotate(${rotationRef.current * 0.01}deg)` }}
          >
            <AnimatePresence>
              {visibleImages.map((image, index) => (
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
                    src={image}
                    alt={`Gallery image ${index + 1}`}
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

export default GallerySection
