import { useEffect, useRef } from 'react'

const ChurchBackground = ({ style, className }) => {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation state
    const state = {
      stars: [],
      bokeh: [],
      glowers: [],
      time: 0
    }
    stateRef.current = state

    // Create initial particles
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

    // Initialize particles
    for (let i = 0; i < DEFAULT.starCount; i++) state.stars.push(mkStar())
    for (let i = 0; i < DEFAULT.bokehCount; i++) state.bokeh.push(mkBokeh())
    for (let i = 0; i < DEFAULT.glowerCount; i++) state.glowers.push(mkGlower())

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgb(3,11,31)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const w = canvas.width
      const h = canvas.height
      state.time += 0.001

      // Draw stars
      state.stars.forEach(star => {
        const x = star.x * w
        const y = star.y * h
        const twinkle = Math.sin(state.time * star.ts + star.tp) * 0.5 + 0.5
        const opacity = star.baseO * twinkle

        if (star.halo) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.r * 3)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`)
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.3})`)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(x - star.r * 3, y - star.r * 3, star.r * 6, star.r * 6)
        }

        ctx.beginPath()
        ctx.arc(x, y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        star.x += star.dx
        star.y += star.dy
        if (star.x < 0) star.x = 1
        if (star.x > 1) star.x = 0
        if (star.y < 0) star.y = 1
        if (star.y > 1) star.y = 0
      })

      // Draw bokeh
      state.bokeh.forEach(b => {
        const x = b.x * w
        const y = b.y * h
        const breathing = Math.sin(state.time * b.bs + b.bp) * 0.15 + 1
        const r = b.r * breathing

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(100, 150, 255, ${b.o * 0.8})`)
        gradient.addColorStop(0.5, `rgba(50, 100, 200, ${b.o * 0.4})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(x - r, y - r, r * 2, r * 2)

        b.x += b.dx
        b.y += b.dy
        if (b.x < 0) b.x = 1
        if (b.x > 1) b.x = 0
        if (b.y < 0) b.y = 1
        if (b.y > 1) b.y = 0
      })

      // Draw glowers
      state.glowers.forEach(g => {
        g.life += g.speed * g.dir
        if (g.life >= 1) { g.life = 1; g.dir = -1 }
        if (g.life <= 0) { g.life = 0; g.dir = 1 }

        const x = g.x * w
        const y = g.y * h
        const opacity = Math.pow(g.life, 2) * g.peakO
        const r = g.r * (0.8 + g.life * 0.4)

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(${g.rc}, ${g.gc}, ${g.bc}, ${opacity})`)
        gradient.addColorStop(0.4, `rgba(${g.rc * 0.8}, ${g.gc * 0.8}, ${g.bc * 0.8}, ${opacity * 0.6})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(x - r, y - r, r * 2, r * 2)

        g.x += g.dx
        g.y += g.dy
        if (g.x < 0) g.x = 1
        if (g.x > 1) g.x = 0
        if (g.y < 0) g.y = 1
        if (g.y > 1) g.y = 0
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        ...style
      }}
      className={className}
    />
  )
}

export default ChurchBackground
