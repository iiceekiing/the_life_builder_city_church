import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiAcademicCap, HiClock, HiUsers, HiLockClosed } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [activeType, setActiveType] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const TYPES = [
    { id: null, label: 'All' },
    { id: 'school_of_ministry', label: 'School of Ministry' },
    { id: 'membership_class', label: 'Membership Class' },
    { id: 'workers_training', label: 'Workers Training' },
    { id: 'departmental_training', label: 'Departmental' },
  ]

  useEffect(() => {
    fetchCourses()
  }, [activeType])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = activeType ? `?course_type=${activeType}` : ''
      const response = await api.get(`/courses${params}`)
      setCourses(response.data)
    } catch (error) {
      setCourses(DEMO_COURSES)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="page-hero py-16">
        <div className="relative text-center">
          <p className="section-subtitle">School of Ministry</p>
          <h1 className="section-title text-white">Online <span className="gradient-text">Courses</span></h1>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Grow in knowledge, ministry, and purpose through our structured training programs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {TYPES.map((type) => (
            <button
              key={type.label}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeType === type.id
                  ? 'bg-church-gold text-church-dark'
                  : 'glass-card text-white/60 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-64 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <HiAcademicCap className="w-12 h-12 mx-auto mb-3 text-church-gold/20" />
            <p>No courses available yet.</p>
            {!user && (
              <Link to="/register" className="btn-gold mt-6 inline-block">
                Join to get notified
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <Link
                  to={user ? `/courses/${course.id}` : '/course-access'}
                  className="glass-card block p-5 hover:border-church-gold/30 hover:shadow-purple transition-all group"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-church-purple-mid">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-church-purple-mid to-church-purple-light flex items-center justify-center">
                        <HiAcademicCap className="w-14 h-14 text-church-gold/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="bg-church-gold text-church-dark text-xs font-bold px-2 py-0.5 rounded font-accent">
                        {course.course_type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {!course.is_free && (
                        <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <HiLockClosed className="w-3 h-3" />Paid
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display text-white font-bold mb-1 line-clamp-2 group-hover:text-church-gold transition-colors">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-white/40 text-sm line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3 h-3" />
                      {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiUsers className="w-3 h-3" />
                      {course.lessons?.length || 0} lessons
                    </span>
                  </div>

                  {!user && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-church-gold">
                      <HiLockClosed className="w-3 h-3" /> Login to enroll
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Demo data
const DEMO_COURSES = [
  {
    id: 1,
    title: "Foundations of Faith",
    description: "Build a strong foundation in Christian faith and doctrine.",
    course_type: "membership_class",
    thumbnail_url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80",
    is_free: true,
    duration_weeks: 4,
    lessons: [{}, {}, {}, {}],
  },
  {
    id: 2,
    title: "Ministry Excellence",
    description: "Develop your ministry gifts and leadership skills.",
    course_type: "school_of_ministry",
    thumbnail_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
    is_free: false,
    duration_weeks: 12,
    lessons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  },
  {
    id: 3,
    title: "Biblical Studies",
    description: "Deep dive into the scriptures with comprehensive study methods.",
    course_type: "workers_training",
    thumbnail_url: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80",
    is_free: true,
    duration_weeks: 8,
    lessons: [{}, {}, {}, {}, {}, {}, {}, {}],
  },
]

export default CoursesPage
