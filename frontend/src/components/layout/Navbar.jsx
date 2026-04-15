import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Sermons', to: '/sermons' },
    { name: 'Courses', to: '/courses' },
    { name: 'Events', to: '/events' },
    { name: 'Book Appointment', to: '/appointments' },
  ]

  const dropdownLinks = {
    'Resources': [
      { name: 'Sermons', to: '/sermons' },
      { name: 'Courses', to: '/courses' },
      { name: 'Events', to: '/events' },
    ],
    'Connect': [
      { name: 'Book Appointment', to: '/appointments' },
      { name: 'Give', to: '/give' },
      { name: 'About', to: '/about' },
    ],
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-church-purple/95 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center border-2 border-red-500">
                <img 
                  src="/images/life-builder-city-church-logo.png" 
                  alt="Life Builder City Church Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-church-gold ${
                    location.pathname === link.to ? 'text-church-gold' : 'text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                    className="flex items-center space-x-2 text-sm font-medium text-white/80 hover:text-church-gold transition-colors"
                  >
                    <span>{user?.full_name}</span>
                    <HiChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-card-gold py-2"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-white/80 hover:text-church-gold hover:bg-white/5"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-white/80 hover:text-church-gold hover:bg-white/5"
                            onClick={() => setActiveDropdown(null)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-church-gold hover:bg-white/5"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-white/80 hover:text-church-gold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-gold text-sm px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white/80 hover:text-church-gold"
            >
              {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 glass-card-gold mx-2 sm:mx-4 mt-2 sm:mt-4"
          >
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
              {/* Mobile Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src="/images/life-builder-city-church-logo.png" 
                    alt="Life Builder City Church Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors hover:text-church-gold ${
                    location.pathname === link.to ? 'text-church-gold' : 'text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-sm text-white/60 mb-2">Welcome, {user?.full_name}</div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm text-white/80 hover:text-church-gold mb-2"
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm text-white/80 hover:text-church-gold mb-2"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block text-sm text-white/80 hover:text-church-gold"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-white/80 hover:text-church-gold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-gold text-sm w-full"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
