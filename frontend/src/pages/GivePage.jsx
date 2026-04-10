import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import ChurchBackground from '../components/ui/ChurchBackground'
import MinistryCard from '../components/giving/MinistryCard'

const MINISTRIES = [
  {
    number: '01 / 04',
    title: 'Rachav Project',
    tag: 'House of God Expansion',
    tagIcon: 'Building',
    accentColor: '#c9952a',
    imageBg: 'linear-gradient(160deg,#1a0a2e,#2d1a54,#0a0114)',
    imageIcon: 'rachav-church-building',
    imageKey: 'rachav',
    customWidth: true,
    useImage: true,
    description: `The Rachav Project is the sacred mandate of building, expanding, and equipping the House of God.
      Rooted in the spirit of Rachav - a testimony of bold faith and hospitality to God's purposes -
      this arm channels resources toward constructing new sanctuaries, acquiring church equipment, sound
      and media technology, land, and every physical resource that creates a worthy dwelling place for
      the King of Glory. When you partner here, your name is written into the walls of God's expanding Kingdom.`,
  },
  {
    number: '02 / 04',
    title: 'Love Plus',
    tag: 'Charity & Welfare Arm',
    tagIcon: 'lovePlus',
    accentColor: '#e06060',
    imageBg: 'linear-gradient(160deg,#2d0a0a,#4a1515,#1a0505)',
    imageIcon: 'lovePlus',
    imageKey: 'love-plus',
    customWidth: true,
    useImage: true,
    description: `Love Plus is compassion arm of Life Builder City Church - reaching into the broken places
      of society with the tangible love of Christ. We identify the hungry, the homeless, the bereaved,
      and those crushed under the weight of lack, and respond with practical, dignified care. Through food
      drives, empowerment programmes, emergency relief, and community upliftment, Love Plus ensures the
      love of God is not merely proclaimed - it is demonstrated. Your partnership fuels mercy in motion.`,
  },
  {
    number: '03 / 04',
    title: 'Life Plus',
    tag: 'Health & Wellness Arm',
    tagIcon: 'lifePlus',
    accentColor: '#4ade80',
    imageBg: 'linear-gradient(160deg,#0a2d0a,#153315,#051a05)',
    imageIcon: 'lifePlus',
    imageKey: 'life-plus',
    customWidth: true,
    useImage: true,
    description: `Life Plus is our declaration that the God who heals is still active in the earth. As the health
      arm of Life Builder City Church, we bridge divine healing with practical healthcare - organising free
      medical outreaches, health screenings, mental wellness initiatives, and medical support for the
      underserved. We believe a healthy body is a temple that can fully worship its Creator. Partnering
      with Life Plus means investing in the wholeness of a generation - body, soul, and spirit.`,
  },
  {
    number: '04 / 04',
    title: 'Children Church',
    tag: 'Children Ministry',
    tagIcon: 'children_church2',
    accentColor: '#60a5fa',
    imageBg: 'linear-gradient(160deg,#0a1a2d,#153050,#050f1a)',
    imageIcon: 'children_church2',
    imageKey: 'children-church2',
    customWidth: true,
    useImage: true,
    description: `Before they know the world's language, we are teaching them the language of Heaven. Children
      Church is the most strategic investment you can make - the child you disciple today carries the
      revival of tomorrow. Through vibrant Spirit-filled programmes, creative Bible learning, and an
      atmosphere of love and belonging, we raise children who do not just attend church - they become
      the Church. Little flames that will set the world ablaze. Your partnership here is legacy-building.`,
  },
]

export default function GivePage() {
  const [showCopyNotification, setShowCopyNotification] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setShowCopyNotification(true)
    setTimeout(() => setShowCopyNotification(false), 5000)
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <ChurchBackground />
      <div className="relative z-10">
        
        {/* Page Hero */}
        <section className="relative text-center px-6 pt-32 pb-12 overflow-hidden">
          {/* Subtle radial glow behind heading */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,149,42,0.07) 0%, transparent 70%)' }} />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-accent text-church-gold text-xs tracking-[.4em] uppercase mb-4"
          >
            Kingdom Partnership
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black text-white leading-tight mb-4"
          >
            Giving as an Act of<br />
            <em className="gradient-text not-italic">Worship & Covenant</em>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-14 h-px bg-gradient-to-r from-transparent via-church-gold to-transparent mx-auto mb-6" 
          />

          {/* Account Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto px-6 mb-8"
          >
            <div className="glass-card rounded-2xl p-6 border border-church-gold/20">
              {/* Top accent line */}
              <div className="h-[3px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, #c9952a 40%, #c9952a 60%, transparent)' }} />
              
              <div className="text-center mb-6">
                <h2 className="font-display text-xl font-bold text-white mb-2">
                  General Giving Account
                </h2>
                <p className="text-white/50 text-sm">
                  Partner with us in advancing the Kingdom of God
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-white/10 gap-2">
                  <span className="text-white/60 text-xs font-medium">Account Name</span>
                  <span className="text-white font-display text-base text-right sm:text-left">Kingdom Porte Center</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-white/10 gap-2">
                  <span className="text-white/60 text-xs font-medium">Account Number</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-white font-display text-base sm:text-lg font-bold gradient-text tracking-wide">1016286310</span>
                    <button
                      onClick={() => handleCopy('1016286310')}
                      className="px-2 sm:px-3 py-1 rounded-lg bg-church-gold/10 border border-church-gold/25 text-church-gold text-xs font-medium hover:bg-church-gold/20 transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2">
                  <span className="text-white/60 text-xs font-medium">Bank Name</span>
                  <span className="text-white font-display text-base text-right sm:text-left">Zenith</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="btn-gold w-full py-2.5 text-sm font-medium">
                  Other Methods to Give
                </button>
                <button className="w-full py-2.5 rounded-lg border border-church-gold/30 text-church-gold text-sm bg-transparent hover:bg-church-gold/10 transition-all font-medium">
                  Set Recurring Giving
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-xl mx-auto text-white/50 text-sm leading-loose"
          >
            <strong className="text-white/75 font-medium">Giving is not a transaction - it is a conversation with God.</strong>{' '}
            When you give, you are declaring your faith, honouring your covenant, and investing in
            a harvest that never ends. Every seed sown into the Kingdom of God bears fruit in both worlds.
          </motion.p>
        </section>

        {/* Scripture Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto px-6 mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 bg-church-gold/5 border border-church-gold/18 rounded-2xl px-5 sm:px-7 py-5">
            <div className="w-11 h-11 rounded-full bg-church-gold/15 flex items-center justify-center shrink-0 text-church-gold text-lg">
              +
            </div>
            <div className="text-center sm:text-left">
              <p className="font-display italic text-white/80 text-sm leading-relaxed">
                "Bring the whole tithe into the storehouse... Test me in this," says the LORD Almighty,
                "and see if I will not throw open the floodgates of heaven."
              </p>
              <p className="font-accent text-church-gold text-xs tracking-widest mt-2">
                - Malachi 3:10 | Luke 6:38 | 2 Corinthians 9:7
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ministry Cards */}
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-5 mt-2">
          {MINISTRIES.map((ministry, index) => (
            <motion.div
              key={ministry.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
            >
              <MinistryCard {...ministry} onCopy={handleCopy} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Copy Notification */}
      <AnimatePresence>
        {showCopyNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 9" />
                </svg>
              </div>
              <span className="font-medium">Account number copied!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
