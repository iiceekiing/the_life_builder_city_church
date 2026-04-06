import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiHeart, HiUsers, HiAcademicCap } from 'react-icons/hi'

const CTASection = () => {
  const ctas = [
    {
      icon: HiHeart,
      title: "Partner With Us",
      description: "Join us in building lives and transforming destinies through your generous support.",
      link: "/partner",
      color: "from-pink-500/20 to-rose-500/10",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
    },
    {
      icon: HiUsers,
      title: "Join Our Community",
      description: "Become part of a vibrant family of believers committed to growth and purpose.",
      link: "/register",
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      icon: HiAcademicCap,
      title: "Grow With Us",
      description: "Enroll in our courses and training programs to equip yourself for purpose.",
      link: "/courses",
      color: "from-purple-500/20 to-indigo-500/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
  ]

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-church-purple via-church-purple-mid to-church-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-church-gold/5 via-transparent to-church-gold/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-church-gold/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-church-purple-light/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-subtitle">Take The Next Step</p>
          <h2 className="section-title text-white">Get <span className="gradient-text">Involved</span></h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            There's a place for you at Life Builder City Church. Discover how you can connect, grow, and make a difference.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {ctas.map((cta, index) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative glass-card p-8 hover:border-church-gold/30 transition-all duration-300 bg-gradient-to-br ${cta.color} ${cta.borderColor}`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <cta.icon className={`w-8 h-8 ${cta.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-white text-xl font-bold mb-4 group-hover:text-church-gold transition-colors">
                {cta.title}
              </h3>
              
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {cta.description}
              </p>

              {/* Link */}
              <Link
                to={cta.link}
                className="inline-flex items-center gap-2 text-church-gold text-sm font-medium hover:gap-3 transition-all"
              >
                Learn More <HiArrowRight className="w-4 h-4" />
              </Link>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-church-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card-gold p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl text-white font-bold mb-4">
              Ready to Transform Your Life?
            </h3>
            <p className="text-white/60 mb-6">
              Join us this Sunday and experience the life-changing power of God in a warm, welcoming community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/appointments" className="btn-gold text-church-dark">
                Plan Your Visit
              </Link>
              <Link to="/sermons" className="btn-outline-gold">
                Watch Online
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
