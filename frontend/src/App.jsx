import { Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const DEFAULT = {
  starCount: 220,
  bokehCount: 9,
  glowerCount: 22,
}

function mkStar() {
  return {
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.5 + 0.2,
    baseO: Math.random() * 0.55 + 0.08,
    ts: Math.random() * 0.022 + 0.004,
    tp: Math.random() * Math.PI * 2,
    dx: (Math.random() - 0.5) * 0.00010,
    dy: (Math.random() - 0.5) * 0.00005,
    halo: Math.random() > 0.6,
  }
}

function mkBokeh() {
  return {
    x: Math.random(), y: Math.random() * 0.85,
    r: Math.random() * 110 + 40,
    o: Math.random() * 0.065 + 0.012,
    dx: (Math.random() - 0.5) * 0.00018,
    dy: (Math.random() - 0.5) * 0.00009,
    bs: Math.random() * 0.008 + 0.002,
    bp: Math.random() * Math.PI * 2,
  }
}

function mkGlower() {
  return {
    x: Math.random(), y: Math.random(),
    r: Math.random() * 55 + 18,
    dx: (Math.random() - 0.5) * 0.00030,
    dy: (Math.random() - 0.5) * 0.00015,
    life: Math.random(),
    speed: Math.random() * 0.0028 + 0.0008,
    rc: 200 + Math.floor(Math.random() * 55),
    gc: 210 + Math.floor(Math.random() * 45),
    bc: 235 + Math.floor(Math.random() * 20),
    peakO: Math.random() * 0.18 + 0.06,
    dir: 1,
  }
}

const ChurchBackground = ({ style, className }) => {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const p = canvas.parentElement
      const r = p.getBoundingClientRect()
      canvas.width  = Math.round(r.width  || window.innerWidth)
      canvas.height = Math.round(r.height || window.innerHeight)
      if (stateRef.current) {
        stateRef.current.W = canvas.width
        stateRef.current.H = canvas.height
      }
    }

    resize()

    stateRef.current = {
      ctx, t: 0,
      W: canvas.width,
      H: canvas.height,
      stars:   Array.from({ length: DEFAULT.starCount   }, mkStar),
      bokeh:   Array.from({ length: DEFAULT.bokehCount  }, mkBokeh),
      glowers: Array.from({ length: DEFAULT.glowerCount }, mkGlower),
    }

    function draw() {
      const s = stateRef.current
      if (!s) return
      const { ctx, W, H } = s
      s.t++

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0,    '#030b1f')
      bg.addColorStop(0.45, '#050f2c')
      bg.addColorStop(1,    '#020710')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Nebula clouds
      const nebulas = [
        [W * 0.38, H * 0.30, W * 0.52, 'rgba(12,45,165,0.09)',  'rgba(6,22,95,0.04)'],
        [W * 0.78, H * 0.12, W * 0.28, 'rgba(18,60,200,0.06)',  'rgba(0,0,0,0)'],
        [W * 0.14, H * 0.65, W * 0.22, 'rgba(8,30,120,0.05)',   'rgba(0,0,0,0)'],
      ]
      nebulas.forEach(([cx, cy, rad, c0, c1]) => {
        const n = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        n.addColorStop(0, c0); n.addColorStop(1, c1)
        ctx.fillStyle = n; ctx.fillRect(0, 0, W, H)
      })

      // Bokeh orbs — soft blue drifters that breathe
      s.bokeh.forEach(b => {
        b.x += b.dx; b.y += b.dy
        if (b.x < -0.2) b.x = 1.2
        if (b.x >  1.2) b.x = -0.2
        if (b.y < -0.2) b.y = 1.2
        if (b.y >  1.2) b.y = -0.2
        const breath = b.o * (0.7 + 0.3 * Math.sin(s.t * b.bs + b.bp))
        const bx = b.x * W, by = b.y * H
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        g.addColorStop(0,   `rgba(70,120,255,${breath})`)
        g.addColorStop(0.5, `rgba(35,70,200,${breath * 0.35})`)
        g.addColorStop(1,   'rgba(15,40,140,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(bx, by, b.r, 0, Math.PI * 2); ctx.fill()
      })

      // Roaming white glow orbs — bloom, drift, fade, respawn
      s.glowers.forEach((g, i) => {
        g.x += g.dx; g.y += g.dy
        g.life += g.speed * g.dir
        if (g.dir === 1 && g.life >= 1) g.dir = -1
        if (g.dir === -1 && g.life <= 0) {
          s.glowers[i] = { ...mkGlower(), life: 0, dir: 1 }
          return
        }
        const alpha = g.peakO * Math.sin(g.life * Math.PI)
        if (alpha < 0.004) return
        const gx = g.x * W, gy = g.y * H
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r)
        grad.addColorStop(0,    `rgba(${g.rc},${g.gc},${g.bc},${alpha})`)
        grad.addColorStop(0.45, `rgba(${g.rc},${g.gc},${g.bc},${alpha * 0.4})`)
        grad.addColorStop(1,    `rgba(${g.rc},${g.gc},${g.bc},0)`)
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(gx, gy, g.r, 0, Math.PI * 2); ctx.fill()
      })

      // Stars — glow on, glow off, drift slowly
      s.stars.forEach(st => {
        st.x += st.dx; st.y += st.dy
        if (st.x < 0) st.x = 1; if (st.x > 1) st.x = 0
        if (st.y < 0) st.y = 1; if (st.y > 1) st.y = 0
        const sx = st.x * W, sy = st.y * H
        const tw = st.baseO * (0.35 + 0.65 * Math.sin(s.t * st.ts + st.tp))
        if (st.halo && st.r > 0.7) {
          const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, st.r * 6)
          sg.addColorStop(0, `rgba(210,228,255,${tw * 0.25})`)
          sg.addColorStop(1, 'rgba(180,210,255,0)')
          ctx.fillStyle = sg
          ctx.beginPath(); ctx.arc(sx, sy, st.r * 6, 0, Math.PI * 2); ctx.fill()
        }
        ctx.fillStyle = `rgba(215,232,255,${tw})` 
        ctx.beginPath(); ctx.arc(sx, sy, st.r, 0, Math.PI * 2); ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement || canvas)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      stateRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        ...style,
      }}
      className={className}
    />
  )
}

const SimpleNavbar = () => {
  return (
    <nav className="bg-church-purple/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Life Builder City Church</h1>
          <div className="flex gap-6">
            <a href="/" className="text-white hover:text-church-gold transition">Home</a>
            <a href="/sermons" className="text-white hover:text-church-gold transition">Sermons</a>
            <a href="/give" className="text-white hover:text-church-gold transition">Give</a>
            <a href="/partner" className="text-white hover:text-church-gold transition">Partner</a>
            <a href="/events" className="text-white hover:text-church-gold transition">Events</a>
            <a href="/courses" className="text-white hover:text-church-gold transition">Courses</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

const QuotesCarousel = () => {
  const quotes = [
    "From now on, you are now part of our family",
    "The WORD OF GOD is our celebrity",
    "We always bring our best",
    "We laugh HARD, LOUD & OFTEN",
    "Every great destiny requires prayer",
    "Prayer is the ultimate strategy",
    "Take it hard — success is a must",
    "Prayer is the crucible for revival",
    "Your destiny is tied to your devotion",
    "We are taking over!",
    "You are rich, you are full of life, and you are righteous.",
    "We give up what we love for things we love even more.",
    "We are bidding you to manifest the glorious life of Christ everywhere.",
    "The Word of God is powerful because the Word of God is God Himself.",
    "It is your right to be rich, righteous, and successful.",
    "We are taking over!"
  ]

  const [currentQuote, setCurrentQuote] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
        setIsAnimating(false)
      }, 500)
    }, 6000) // Changed from 4000ms to 6000ms (slower)

    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <div className="h-20 flex items-center justify-center overflow-hidden">
      <p 
        className={`text-xl md:text-2xl text-white text-center px-4 transition-all duration-500 ${
          isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
      >
        "{quotes[currentQuote]}"
      </p>
    </div>
  )
}

const SimpleHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ChurchBackground />
      <div className="container mx-auto px-4 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Life Builder City Church
        </h1>
        <p className="text-xl md:text-2xl text-church-gold mb-8">
          Breathing Life Into You
        </p>
        
        <QuotesCarousel />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="bg-church-purple hover:bg-church-purple/80 text-white px-8 py-3 rounded-lg transition">
            Join Us Sunday
          </button>
          <button className="border-2 border-church-gold text-church-gold hover:bg-church-gold hover:text-church-dark px-8 py-3 rounded-lg transition">
            Watch Online
          </button>
        </div>
        
        {/* Service Times Card - Now in normal flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-card-gold px-12 py-6 border border-church-gold/20 shadow-gold mt-12 mx-auto max-w-md"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-church-gold animate-pulse" />
              <p className="font-accent text-church-gold text-xs tracking-widest uppercase">Service Times</p>
            </div>
            <div className="flex gap-8 text-white/80 text-base">
              <div className="group">
                <p className="font-semibold group-hover:text-church-gold transition-colors">Sunday</p>
                <p className="text-church-gold">8:30 AM</p>
              </div>
              <div className="w-px bg-church-gold/30" />
              <div className="group">
                <p className="font-semibold group-hover:text-church-gold transition-colors">Wednesday</p>
                <p className="text-church-gold">5:00 PM</p>
              </div>
            </div>
            <p className="text-white/40 text-sm mt-3 font-accent">Join us for worship</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Fixed behind everything — persists across route changes */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <ChurchBackground />
      </div>

      {/* All page content above it */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SimpleNavbar />
        <Routes>
          <Route path="/" element={<SimpleHero />} />
          <Route path="/sermons" element={
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-semibold mb-4">Sermons Page</h2>
              <p className="text-gray-300">Sermons coming soon...</p>
            </div>
          } />
          <Route path="/give" element={
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-semibold mb-4">Give Page</h2>
              <p className="text-gray-300">Give coming soon...</p>
            </div>
          } />
          <Route path="/partner" element={
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-semibold mb-4">Partner Page</h2>
              <p className="text-gray-300">Partner coming soon...</p>
            </div>
          } />
          <Route path="/events" element={
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-semibold mb-4">Events Page</h2>
              <p className="text-gray-300">Events coming soon...</p>
            </div>
          } />
          <Route path="/courses" element={
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-semibold mb-4">Courses Page</h2>
              <p className="text-gray-300">Courses coming soon...</p>
            </div>
          } />
          <Route path="*" element={<div className="container mx-auto px-4 py-8"><h2 className="text-2xl font-semibold mb-4">Page not found</h2></div>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
