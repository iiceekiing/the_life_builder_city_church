import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiPlay, HiDownload, HiShare, HiCalendar, HiLocationMarker } from 'react-icons/hi'
import CanvasBackground from '../components/sections/CanvasBackground'
import HeroSection from '../components/sections/HeroSection'
import GallerySection from '../components/sections/GallerySection'
import RecentSermonsSection from '../components/sections/RecentSermonsSection'
import TestimoniesSection from '../components/sections/TestimoniesSection'
import EventsSection from '../components/sections/EventsSection'
import CTASection from '../components/sections/CTASection'

const HomePage = () => {
  const [quotes] = useState([
    "Your destiny is tied to your devotion.",
    "Every great destiny requires prayer.",
    "Prayer is the crucible for revival.",
    "Prayer is the ultimate strategy.",
    "Take it hard. Success is a must.",
    "It is your right to be rich, righteous, and successful.",
    "We give up what we love for things we love even more.",
    "You are rich, you are full of life, and you are righteous.",
    "We are bidding you to manifest the glorious life of Christ everywhere.",
    "The Word of God is powerful because the Word of God is God Himself.",
  ])

  return (
    <div className="relative">
      {/* Canvas Background */}
      <CanvasBackground />
      
      {/* Hero Section */}
      <HeroSection quotes={quotes} />
      
      {/* Gallery Section */}
      <GallerySection />
      
      {/* Recent Sermons Section */}
      <RecentSermonsSection />
      
      {/* Testimonies Section */}
      <TestimoniesSection />
      
      {/* Events Section */}
      <EventsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default HomePage
