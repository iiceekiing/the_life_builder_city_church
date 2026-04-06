import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CanvasBackground from '../components/sections/CanvasBackground'

const CourseAccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CanvasBackground />
      
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card-gold p-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-church-gold/20 px-4 py-2 mb-8 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-church-gold animate-pulse" />
            <span className="font-accent text-church-gold text-xs tracking-[0.3em] uppercase">Course Access Required</span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-20 h-20 rounded-full bg-church-gold/20 flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-church-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl text-white font-bold mb-4"
          >
            Unlock Your Learning Journey
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 mb-8 max-w-md mx-auto"
          >
            To access our transformative courses and training programs, you need to sign in to your account or create a new account to get started on your spiritual growth journey.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login" className="btn-gold text-church-dark px-8 py-4">
              Sign In
            </Link>
            <Link to="/register" className="btn-outline-gold px-8 py-4">
              Create Account
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-white/40 text-sm"
          >
            <p>Already have an account? <Link to="/login" className="text-church-gold hover:underline">Sign in here</Link></p>
            <p className="mt-2">New to Life Builder City Church? <Link to="/register" className="text-church-gold hover:underline">Join our community</Link></p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default CourseAccessPage
