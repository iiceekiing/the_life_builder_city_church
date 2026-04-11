import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiLockClosed } from 'react-icons/hi'
import ChurchBackground from '../components/ui/ChurchBackground'
import { useAuth } from '../context/AuthContext'

const CoursesPage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user role
      if (isAdmin()) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, navigate])

  // Show sign-in required page for non-authenticated users only
  return (
    <div className="min-h-screen relative">
      <ChurchBackground />
      <div className="relative z-10 min-h-screen flex items-start justify-center px-6 pt-24">
        <div className="max-w-md w-full mt-12">
          <div className="glass-card rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-church-gold/10 border border-church-gold/30 flex items-center justify-center mb-4">
                <HiLockClosed className="w-10 h-10 text-church-gold" />
              </div>
              
              <h1 className="font-display text-2xl font-black text-white mb-2">
                Sign In Required
              </h1>
              
              <p className="text-white/60 text-sm">
                Access our transformative courses and training programs
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Link
                to="/courses/signin"
                className="btn-gold w-full py-3 text-sm font-medium block"
              >
                Sign In
              </Link>
              
              <Link
                to="/courses/signup"
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-3 text-sm font-medium transition-all block text-center"
              >
                Create Account
              </Link>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Link
                to="/"
                className="text-white/60 hover:text-church-gold text-sm transition-colors inline-flex items-center gap-1"
              >
                × Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
