import { useEffect, useRef } from 'react'

const CanvasBackground = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let W, H

    function resize() {
      const p = canvas.parentElement
      const r = p.getBoundingClientRect()
      W = canvas.width = Math.round(r.width || 680)
      H = canvas.height = Math.round(r.height || 560)
    }
    resize()

    // ── Stars (white, gently pulsing, slow drift) ─────────────────────────────────
    function mkStar() {
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.2,
        // Each star has a unique "breathe" cycle: glows up, glows off, drifts
        baseO: Math.random() * 0.55 + 0.08,
        ts: Math.random() * 0.022 + 0.004,   // twinkle speed — very slow
        tp: Math.random() * Math.PI * 2,      // twinkle phase offset
        dx: (Math.random() - 0.5) * 0.00010, // lateral drift — extremely slow
        dy: (Math.random() - 0.5) * 0.00005,
        // Some stars get a larger soft glow halo
        halo: Math.random() > 0.6,
      }
    }

    // ── Bokeh orbs (large soft blue drifters) ─────────────────────────────────────
    function mkBokeh() {
      return {
        x: Math.random(),
        y: Math.random() * 0.85,
        r: Math.random() * 110 + 40,
        o: Math.random() * 0.065 + 0.012,
        dx: (Math.random() - 0.5) * 0.00018,
        dy: (Math.random() - 0.5) * 0.00009,
        // Bokeh also breathe very gently
        bs: Math.random() * 0.008 + 0.002,
        bp: Math.random() * Math.PI * 2,
      }
    }

    // ── Roaming glow orbs — the "slow white glowing" particles the user loves ──────
    // These are medium-sized soft white/pale-blue spheres that:
    //   • drift slowly across the canvas
    //   • glow up from near 0 opacity → peak → fade back to 0
    //   • then reset to a new random position and repeat
    function mkGlower() {
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 55 + 18,           // 18–73px soft circle
        dx: (Math.random() - 0.5) * 0.00030,   // slow drift
        dy: (Math.random() - 0.5) * 0.00015,
        // Life cycle: 0 → peak → 0, then respawn
        life: Math.random(),                      // start at random point in cycle
        speed: Math.random() * 0.0028 + 0.0008,   // how fast life advances
        // Color: soft white to very pale blue
        r_col: 200 + Math.floor(Math.random() * 55),
        g_col: 210 + Math.floor(Math.random() * 45),
        b_col: 235 + Math.floor(Math.random() * 20),
        peakO: Math.random() * 0.18 + 0.06,       // max opacity — always subtle
        dir: 1,                                  // 1 = fading in, -1 = fading out
      }
    }

    const stars = Array.from({ length: 220 }, mkStar)
    const bokeh = Array.from({ length: 9 }, mkBokeh)
    const glowers = Array.from({ length: 22 }, mkGlower)

    let t = 0

    function draw() {
      t++

      // ── Background gradient ────────────────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#030b1f')
      bg.addColorStop(0.45, '#050f2c')
      bg.addColorStop(1, '#020710')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // ── Nebula clouds ──────────────────────────────────────────────────────────
      let n = ctx.createRadialGradient(W * .38, H * .3, 0, W * .38, H * .3, W * .52)
      n.addColorStop(0, 'rgba(12,45,165,0.09)')
      n.addColorStop(0.6, 'rgba(6,22,95,0.04)')
      n.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = n
      ctx.fillRect(0, 0, W, H)

      n = ctx.createRadialGradient(W * .78, H * .12, 0, W * .78, H * .12, W * .28)
      n.addColorStop(0, 'rgba(18,60,200,0.06)')
      n.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = n
      ctx.fillRect(0, 0, W, H)

      n = ctx.createRadialGradient(W * .14, H * .65, 0, W * .14, H * .65, W * .22)
      n.addColorStop(0, 'rgba(8,30,120,0.05)')
      n.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = n
      ctx.fillRect(0, 0, W, H)

      // ── Bokeh orbs ─────────────────────────────────────────────────────────────
      bokeh.forEach(b => {
        b.x += b.dx
        b.y += b.dy
        if (b.x < -0.2) b.x = 1.2
        if (b.x > 1.2) b.x = -0.2
        if (b.y < -0.2) b.y = 1.2
        if (b.y > 1.2) b.y = -0.2
        // Gentle breathing
        const breath = b.o * (0.7 + 0.3 * Math.sin(t * b.bs + b.bp))
        const bx = b.x * W, by = b.y * H
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        g.addColorStop(0, `rgba(70,120,255,${breath})`)
        g.addColorStop(0.5, `rgba(35,70,200,${breath * 0.35})`)
        g.addColorStop(1, 'rgba(15,40,140,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(bx, by, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── Roaming white glow orbs ────────────────────────────────────────────────
      // These are THE feature the user wants to keep —
      // they drift, bloom softly white/silver, then fade and respawn.
      glowers.forEach((g, i) => {
        g.x += g.dx
        g.y += g.dy
        g.life += g.speed * g.dir

        // Reached peak → start fading
        if (g.dir === 1 && g.life >= 1) {
          g.dir = -1
        }
        // Fully faded out → respawn at new position
        if (g.dir === -1 && g.life <= 0) {
          glowers[i] = mkGlower()
          glowers[i].life = 0
          glowers[i].dir = 1
          return
        }

        // Smooth bell-curve opacity: sin of life * PI peaks at life=0.5
        const envelope = Math.sin(g.life * Math.PI)
        const alpha = g.peakO * envelope
        if (alpha < 0.004) return

        const gx = g.x * W, gy = g.y * H
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r)
        grad.addColorStop(0, `rgba(${g.r_col},${g.g_col},${g.b_col},${alpha})`)
        grad.addColorStop(0.45, `rgba(${g.r_col},${g.g_col},${g.b_col},${alpha * 0.4})`)
        grad.addColorStop(1, `rgba(${g.r_col},${g.g_col},${g.b_col},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(gx, gy, g.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── Stars ──────────────────────────────────────────────────────────────────
      stars.forEach(s => {
        s.x += s.dx
        s.y += s.dy
        if (s.x < 0) s.x = 1
        if (s.x > 1) s.x = 0
        if (s.y < 0) s.y = 1
        if (s.y > 1) s.y = 0

        const sx = s.x * W, sy = s.y * H
        // Glow-on, glow-off twinkle using sin wave unique to each star
        const tw = s.baseO * (0.35 + 0.65 * Math.sin(t * s.ts + s.tp))

        // Larger stars get a soft outer aura
        if (s.halo && s.r > 0.7) {
          const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 6)
          sg.addColorStop(0, `rgba(210,228,255,${tw * 0.25})`)
          sg.addColorStop(1, 'rgba(180,210,255,0)')
          ctx.fillStyle = sg
          ctx.beginPath()
          ctx.arc(sx, sy, s.r * 6, 0, Math.PI * 2)
          ctx.fill()
        }

        // Star core
        ctx.fillStyle = `rgba(215,232,255,${tw})`
        ctx.beginPath()
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default CanvasBackground
