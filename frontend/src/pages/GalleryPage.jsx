import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all')

  // All available images from the folder
  const allImages = [
    { id: 1, src: '/images/gallery1.png', alt: 'Church Service', category: 'service' },
    { id: 2, src: '/images/gallery2.png', alt: 'Sunday School', category: 'education' },
    { id: 3, src: '/images/gallery3.png', alt: 'Mission Trip', category: 'outreach' },
    { id: 4, src: '/images/gallery4.png', alt: 'Church Conference', category: 'conference' },
    { id: 5, src: '/images/gallery5.png', alt: 'Praise & Worship', category: 'worship' },
    { id: 6, src: '/images/gallery6.png', alt: 'Church Leadership', category: 'leadership' },
    { id: 7, src: '/images/gallery7.png', alt: 'Church Service', category: 'service' },
    { id: 8, src: '/images/gallery8.png', alt: 'Worship Session', category: 'worship' },
    { id: 9, src: '/images/gallery9.png', alt: 'Community Event', category: 'community' },
    { id: 10, src: '/images/gallery10.png', alt: 'Church Service', category: 'service' },
    { id: 11, src: '/images/gallery11.png', alt: 'Worship Session', category: 'worship' },
    { id: 12, src: '/images/gallery12.png', alt: 'Community Event', category: 'community' },
    { id: 13, src: '/images/gallery13.png', alt: 'Youth Ministry', category: 'education' },
    { id: 14, src: '/images/gallery14.png', alt: 'Prayer Meeting', category: 'prayer' },
    { id: 15, src: '/images/gallery15.png', alt: 'Church Building', category: 'building' },
    { id: 16, src: '/images/gallery16.png', alt: 'Choir Performance', category: 'worship' },
    { id: 17, src: '/images/gallery17.jpeg', alt: 'Bible Study', category: 'education' },
    { id: 18, src: '/images/gallery18.jpeg', alt: 'Outreach Program', category: 'outreach' },
    { id: 19, src: '/images/gallery19.jpeg', alt: 'Fellowship Gathering', category: 'community' },
    { id: 20, src: '/images/gallery20.jpeg', alt: 'Sunday School', category: 'education' },
    { id: 21, src: '/images/gallery21.jpeg', alt: 'Mission Trip', category: 'outreach' },
    { id: 22, src: '/images/gallery22.jpeg', alt: 'Church Conference', category: 'conference' },
    { id: 23, src: '/images/gallery23.jpeg', alt: 'Praise & Worship', category: 'worship' },
    { id: 24, src: '/images/gallery24.jpeg', alt: 'Church Leadership', category: 'leadership' },
    { id: 25, src: '/images/gallery25.jpeg', alt: 'Church Service', category: 'service' },
    { id: 26, src: '/images/gallery26.jpeg', alt: 'Worship Session', category: 'worship' },
    { id: 27, src: '/images/gallery27.jpeg', alt: 'Community Event', category: 'community' },
    { id: 28, src: '/images/gallery28.jpeg', alt: 'Baptism Ceremony', category: 'service' },
    { id: 29, src: '/images/gallery29.jpeg', alt: 'Community Event', category: 'community' },
    { id: 30, src: '/images/gallery30.jpeg', alt: 'Baptism Ceremony', category: 'service' },
    // Add hero section background images
    { id: 31, src: '/images/hero_section_bg.jpeg', alt: 'Hero Background', category: 'building' },
    { id: 32, src: '/images/hero_section_bg3.jpeg', alt: 'Church Interior', category: 'building' },
    { id: 33, src: '/images/hero_section_bg4.jpeg', alt: 'Church Sanctuary', category: 'building' },
    { id: 34, src: '/images/hero_section_bg5.jpeg', alt: 'Church Architecture', category: 'building' },
    { id: 35, src: '/images/hero_section_bg6.jpeg', alt: 'Worship Hall', category: 'building' },
    { id: 36, src: '/images/hero_section_bg7.jpeg', alt: 'Church Service', category: 'service' },
    { id: 37, src: '/images/hero_section_bg8.jpeg', alt: 'Community Gathering', category: 'community' },
    { id: 38, src: '/images/hero_section_bg9.jpeg', alt: 'Church Celebration', category: 'celebration' },
    // Add other images
    { id: 39, src: '/images/children-church.jpeg', alt: 'Children Ministry', category: 'education' },
    { id: 40, src: '/images/children_church2.jpeg', alt: 'Youth Activities', category: 'education' },
    { id: 41, src: '/images/choir.jpeg', alt: 'Choir Performance', category: 'worship' },
    { id: 42, src: '/images/choir2.jpeg', alt: 'Gospel Choir', category: 'worship' },
    { id: 43, src: '/images/choir3.jpeg', alt: 'Worship Team', category: 'worship' },
    { id: 44, src: '/images/school-of-ministry.jpeg', alt: 'Ministry School', category: 'education' },
    { id: 45, src: '/images/school-of-ministry1.jpeg', alt: 'Bible Class', category: 'education' },
    { id: 46, src: '/images/school-of-ministry2.jpeg', alt: 'Teaching Session', category: 'education' },
    { id: 47, src: '/images/school-of-ministry3.jpeg', alt: 'Study Group', category: 'education' },
    { id: 48, src: '/images/prayer_camp_meeting.png', alt: 'Prayer Camp', category: 'prayer' },
    { id: 49, src: '/images/partnering_with_the_voice.png', alt: 'Partnership Event', category: 'outreach' },
    { id: 50, src: '/images/love_codes_difficult_discussions.png', alt: 'Discussion Group', category: 'community' },
    { id: 51, src: '/images/whisper.png', alt: 'Quiet Time', category: 'prayer' },
    { id: 52, src: '/images/protocol.jpeg', alt: 'Church Protocol', category: 'leadership' },
    { id: 53, src: '/images/protocol1.jpeg', alt: 'Church Meeting', category: 'leadership' },
    { id: 54, src: '/images/protocol2.jpeg', alt: 'Leadership Summit', category: 'leadership' },
    { id: 55, src: '/images/protocol3.jpeg', alt: 'Church Council', category: 'leadership' },
    { id: 56, src: '/images/media1.jpeg', alt: 'Media Ministry', category: 'media' },
    { id: 57, src: '/images/media2.jpeg', alt: 'Broadcast Service', category: 'media' },
    { id: 58, src: '/images/media3.jpeg', alt: 'Audio Production', category: 'media' },
    { id: 59, src: '/images/suffering_via_dolorosa.png', alt: 'Service Reflection', category: 'service' }
  ]

  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'service', name: 'Services' },
    { id: 'worship', name: 'Worship' },
    { id: 'education', name: 'Education' },
    { id: 'community', name: 'Community' },
    { id: 'outreach', name: 'Outreach' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'building', name: 'Building' },
    { id: 'prayer', name: 'Prayer' },
    { id: 'conference', name: 'Conference' },
    { id: 'celebration', name: 'Celebration' },
    { id: 'media', name: 'Media' }
  ]

  const filteredImages = filter === 'all' ? allImages : allImages.filter(img => img.category === filter)

  const getImageSize = (index) => {
    const sizes = [
      'col-span-2 row-span-2', // Large featured image
      'col-span-1 row-span-1', // Small square
      'col-span-1 row-span-2', // Vertical rectangle
      'col-span-2 row-span-1', // Horizontal rectangle
      'col-span-1 row-span-1', // Small square
      'col-span-2 row-span-2', // Large featured
      'col-span-1 row-span-1', // Small square
      'col-span-1 row-span-2', // Vertical
      'col-span-2 row-span-1', // Horizontal
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-1', // Small
      'col-span-2 row-span-2', // Large
      'col-span-1 row-span-2', // Vertical
      'col-span-1 row-span-1', // Small
      'col-span-2 row-span-1', // Horizontal
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-1', // Small
      'col-span-2 row-span-2', // Large
    ]
    return sizes[index % sizes.length]
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the beautiful moments and vibrant community life at Life Builder City Church
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 auto-rows-[200px]">
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
                className={`${getImageSize(index)} relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium text-right">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain"
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {selectedImage.alt}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Category: {categories.find(c => c.id === selectedImage.category)?.name || 'Unknown'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default GalleryPage
