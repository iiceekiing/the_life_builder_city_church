import { useState } from 'react'

export default function MinistryCard({ number, title, tag, tagIcon, description, imageIcon, imageBg, accentColor, onCopy, customWidth, useImage }) {
  const [copied, setCopied] = useState(false)

  const handleCardCopy = () => {
    onCopy('1016286310')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cardWidth = customWidth ? 'max-w-4xl' : 'max-w-3xl'

  return (
    <div className={`${cardWidth} mx-auto glass-card rounded-2xl overflow-hidden hover:border-church-gold/30 transition-all duration-300 hover:shadow-glass`}>
      {/* Top accent line */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor} 40%, ${accentColor} 60%, transparent)` }} />

      {/* Three-column body */}
      <div className="flex flex-col md:flex-row items-stretch">

        {/* LEFT - Description */}
        <div className="flex-1 min-w-0 p-6 border-r border-white/6 md:border-r flex flex-col justify-center">
          <p className="font-accent text-church-gold/50 text-xs tracking-[.25em] mb-2">{number}</p>
          <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
          <span className="inline-flex items-center gap-1.5 bg-church-gold/10 border border-church-gold/20 rounded-full px-3 py-1 text-church-gold font-accent text-xs tracking-wide mb-3">
            {tagIcon} {tag}
          </span>
          <p className="text-white text-xs leading-relaxed">{description}</p>
        </div>

        {/* MIDDLE - Image */}
        <div className="w-full h-40 md:w-44 md:h-auto shrink-0 flex flex-col items-center justify-center gap-2 px-4 py-5 border-r border-white/6 md:border-r relative overflow-hidden">
          <div className="absolute inset-0 opacity-60" style={{ background: imageBg }} />
          {useImage ? (
            <img 
              src={`/images/${imageIcon}.png`} 
              onError={(e) => {
                e.target.src = `/images/${imageIcon}.jpeg`
              }}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="relative z-10 text-5xl" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
              {imageIcon}
            </div>
          )}
          <p className="relative z-10 font-accent text-white/40 text-xs tracking-widest uppercase text-center">{title}</p>
        </div>

        {/* RIGHT - Account + CTA */}
        <div className="w-full md:w-52 shrink-0 p-5 flex flex-col justify-between gap-4">
          <div>
            <p className="font-accent text-church-gold text-xs tracking-[.3em] uppercase mb-3">Partnership Account</p>
            <div className="space-y-2 mb-1">
              <div>
                <p className="text-white/35 text-xs mb-0.5">Account Name</p>
                <p className="text-white/80 text-xs font-medium">Kingdom Porte Center</p>
              </div>
              <div>
                <p className="text-white/35 text-xs mb-1">Account Number</p>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold gradient-text tracking-wide">1016286310</span>
                  <button
                    onClick={handleCardCopy}
                    className={`text-xs px-2 py-1 rounded-md border transition-all font-body ${
                      copied
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-church-gold/10 border-church-gold/25 text-church-gold hover:bg-church-gold/20'
                    }`}
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-white/35 text-xs mb-0.5">Bank</p>
                <p className="text-white/80 text-xs font-medium">Zenith Bank</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <button className="btn-gold w-full py-2.5 text-xs font-medium text-white">
              Give to {title}
            </button>
            <button className="w-full py-2.5 rounded-lg border border-church-gold/30 text-church-gold text-xs bg-transparent hover:bg-church-gold/10 transition-all font-body text-white">
              Set Recurring Partnership
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
