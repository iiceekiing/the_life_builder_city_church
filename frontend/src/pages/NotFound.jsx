import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-church-dark" />
      <div className="absolute inset-0 bg-gradient-to-br from-church-purple/20 via-transparent to-church-purple/10" />
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <h1 className="font-display text-9xl font-black text-church-gold/20">404</h1>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <h2 className="font-display text-3xl text-white font-bold mb-4">
              Page Not Found
            </h2>
            <p className="text-white/50 mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to where you belong.
            </p>
            
            <Link
              to="/"
              className="btn-gold inline-flex items-center gap-2"
            >
              <HiHome className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
