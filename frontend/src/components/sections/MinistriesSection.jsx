import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

// Ministries data with static images and darker colors
const MINISTRIES = [
  {
    id: 1,
    title: 'Life Plus',
    subtitle: 'Health & Wellness',
    description: 'Holistic health programs for body, mind, and spirit through biblical principles.',
    icon: '❤️',
    gradient: 'from-rose-500/20 to-rose-600/10',
    link: '/partner',
    image: '/images/life-plus.png',
    bgColor: '#4a90e2' // Darker blue
  },
  {
    id: 2,
    title: 'Love Plus',
    subtitle: 'Welfare & Outreach',
    description: 'Extending God\'s love through community service and humanitarian outreach.',
    icon: '💝',
    gradient: 'from-amber-500/20 to-amber-600/10',
    link: '/partner',
    image: '/images/love-plus.png',
    bgColor: '#e91e63' // Darker pink
  },
  {
    id: 7,
    title: 'Children Church',
    subtitle: 'Kids Ministry',
    description: 'Nurturing the next generation with biblical education and fun activities.',
    icon: '👶',
    gradient: 'from-pink-500/20 to-pink-600/10',
    link: '/partner',
    image: '/images/children-church.jpeg',
    bgColor: '#d32f2f' // Darker red
  }
]

const MinistryCard = ({ ministry, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        scale: 1.04,
        borderColor: '#c9952a',
        boxShadow: '0 10px 40px rgba(201, 149, 42, 0.3)'
      }}
      className="glass-card border-4 border-church-gold/40 rounded-2xl p-12 cursor-pointer transition-all duration-300 bg-gradient-to-br overflow-hidden aspect-square"
      style={{
        backgroundColor: ministry.bgColor + '20',
        background: `linear-gradient(135deg, 
          ${ministry.bgColor}20 0%, 
          ${ministry.bgColor}10 50%, 
          ${ministry.bgColor}30 100%)`
      }}
    >
      <Link to={ministry.link} className="block h-full">
        {/* Static Image - Current Size */}
        <div className="relative aspect-square w-full h-32 mb-12 rounded-lg overflow-hidden shadow-lg">
          <img
            src={ministry.image}
            alt={`${ministry.title} image`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ministry Title - Larger and More Visible */}
        <h3 className="text-black font-playfair font-bold text-2xl mb-4 text-center">
          {ministry.title}
        </h3>

        {/* Ministry Subtitle - More Visible */}
        <p className="text-church-gold font-cinzel text-lg uppercase tracking-wider mb-6 text-center">
          {ministry.subtitle}
        </p>

        {/* Description - More Visible */}
        <p className="text-black/90 text-lg leading-relaxed text-center mb-8">
          {ministry.description}
        </p>

        {/* CTA Button - Larger */}
        <div className="text-center">
          <Link 
            to={ministry.link}
            className="inline-block bg-church-gold text-church-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-church-gold/90 transition-colors"
          >
            Give or Partner
          </Link>
        </div>
      </Link>
    </motion.div>
  )
}

const MinistriesSection = () => {
  return (
    <section className="relative py-20 px-6" style={{ backgroundColor: '#f8eaea' }}>
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-subtitle text-church-gold">Departments</p>
          <h2 className="section-title text-church-dark">Our <span className="gradient-text">Ministries</span></h2>
        </motion.div>

        {/* Ministries Grid - 3 Square Cards Only */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {MINISTRIES.map((ministry, index) => (
              <MinistryCard 
                key={ministry.id} 
                ministry={ministry} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MinistriesSection
