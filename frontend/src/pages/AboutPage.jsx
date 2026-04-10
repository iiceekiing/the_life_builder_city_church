import { motion } from 'framer-motion'
import { useState } from 'react'
import ChurchBackground from '../components/ui/ChurchBackground'

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for contacting us! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <ChurchBackground />
      <div className="relative z-10">
        
        {/* Page Hero */}
        <section className="relative text-center px-6 pt-32 pb-16 overflow-hidden">
          {/* Subtle radial glow behind heading */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,149,42,0.07) 0%, transparent 70%)' }} />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-accent text-church-gold text-xs tracking-[.4em] uppercase mb-4"
          >
            About Life Builder City Church
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black text-white leading-tight mb-4"
          >
            Welcome to Our Church
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-14 h-px bg-gradient-to-r from-transparent via-church-gold to-transparent mx-auto mb-6" 
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-white/70 text-sm leading-loose"
          >
            We are a vibrant, Spirit-filled community dedicated to building lives, transforming destinies, 
            and advancing the Kingdom of God through worship, fellowship, and service.
          </motion.p>
        </section>

        {/* Church Description Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mb-12"
        >
          <div className="glass-card rounded-2xl p-8 border border-church-gold/20">
            {/* Top accent line */}
            <div className="h-[3px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, #c9952a 40%, #c9952a 60%, transparent)' }} />
            
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white mb-3">
                Who We Are
              </h2>
              <p className="text-white text-sm leading-relaxed max-w-2xl mx-auto">
                Life Builder City Church is a dynamic, multicultural congregation where faith comes alive. 
                We are passionate about worship, committed to spiritual growth, and dedicated to serving our community. 
                Our doors are open to everyone seeking to experience the transformative power of God's love 
                and to find their purpose in Christ.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto px-6 mb-12"
        >
          <div className="glass-card rounded-2xl p-8 border border-church-gold/20">
            {/* Top accent line */}
            <div className="h-[3px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, #c9952a 40%, #c9952a 60%, transparent)' }} />
            
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white mb-3">
                Our Mission
              </h2>
              <p className="text-white text-sm leading-relaxed max-w-2xl mx-auto">
                To build lives, transform destinies, and advance the Kingdom of God through 
                passionate worship, biblical teaching, and authentic community. We exist to help people 
                discover their God-given purpose, develop their spiritual gifts, and impact their world 
                for Christ.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto px-6 mb-12"
        >
          <div className="glass-card rounded-2xl p-8 border border-church-gold/20">
            {/* Top accent line */}
            <div className="h-[3px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, #c9952a 40%, #c9952a 60%, transparent)' }} />
            
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white mb-3">
                Get In Touch
              </h2>
              <p className="text-white/70 text-sm mb-8">
                We'd love to hear from you! Whether you have questions, need prayer, or want to learn more 
                about our church family, reach out to us using the form below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-white/70 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-church-gold/50 focus:border-church-gold/50 transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-church-gold/50 focus:border-church-gold/50 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-white/70 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-church-gold/50 focus:border-church-gold/50 transition-all resize-none"
                  placeholder="Share your thoughts, prayer requests, or questions..."
                />
              </div>

              {submitMessage && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-green-400 text-sm font-medium">{submitMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
