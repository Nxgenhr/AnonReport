import { useEffect, useRef } from 'react'

type Point = [x: number, y: number]

/** Top and bottom edges of a ribbon, sampled every `step` units along x. */
function ribbon(
  x0: number,
  x1: number,
  step: number,
  center: (x: number) => number,
  thick: (x: number) => number,
  wave: (x: number, phase: number) => number,
  twist: number,
) {
  const top: Point[] = []
  const bot: Point[] = []
  for (let x = x0; x <= x1 + 0.01; x += step) {
    const c = center(x)
    const th = thick(x)
    top.push([x, c + wave(x, 0) - th / 2])
    bot.push([x, c + wave(x, twist) + th / 2])
  }
  return { top, bot }
}

/** Smooth SVG path through the points, using quadratic curves between midpoints. */
function smooth(pts: Point[], move: boolean) {
  const r = (n: number) => n.toFixed(1)
  let d = `${move ? 'M' : 'L'}${r(pts[0][0])} ${r(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${r(pts[i][0])} ${r(pts[i][1])} ${r(mx)} ${r(my)}`
  }
  const last = pts[pts.length - 1]
  return `${d} L${r(last[0])} ${r(last[1])}`
}

const closed = (edges: { top: Point[]; bot: Point[] }) =>
  `${smooth(edges.top, true)} ${smooth(edges.bot.slice().reverse(), false)} Z`

/** Path data for the three shapes at time `t` (seconds). */
function paths(t: number) {
  const { sin, PI, max, min, pow } = Math

  const gold = ribbon(
    20,
    820,
    20,
    (x) => 604 - (x - 40) * 0.215 - 22 * sin((PI * (x - 40)) / 760),
    (x) => 30 + 26 * max(0, (x - 420) / 400) + 6 * sin(x * 0.01 + 1),
    (x, ph) =>
      18 * sin(x * 0.0105 - t * 1.15 + ph) +
      7 * sin(x * 0.024 - t * 1.9 + 1.3 + ph * 1.5),
    0.7,
  )

  const navy = ribbon(
    260,
    820,
    20,
    (x) => 674 - (x - 280) * 0.58 - 34 * sin(PI * min(1, max(0, (x - 280) / 520))),
    (x) => 18 + 100 * pow(max(0, (x - 260) / 560), 1.3),
    (x, ph) =>
      20 * sin(x * 0.009 - t * 0.95 + 2 + ph) +
      8 * sin(x * 0.021 - t * 1.6 + ph * 1.4),
    0.6,
  )

  const line = navy.top
    .filter(([x]) => x >= 320)
    .map(([x, y]): Point => [x, y + 10])

  return { gold: closed(gold), navy: closed(navy), line: smooth(line, true) }
}

const initial = paths(0)
const FRAME_MS = 33 // ~30fps is plenty for a slow drift

function Ribbons() {
  const gold = useRef<SVGPathElement>(null)
  const navy = useRef<SVGPathElement>(null)
  const line = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const start = performance.now()
    let last = 0
    let raf = requestAnimationFrame(function step(now) {
      raf = requestAnimationFrame(step)
      if (now - last < FRAME_MS) return
      last = now
      const d = paths((now - start) / 1000)
      gold.current?.setAttribute('d', d.gold)
      navy.current?.setAttribute('d', d.navy)
      line.current?.setAttribute('d', d.line)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg
      className="art"
      aria-hidden="true"
      viewBox="0 0 800 700"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <linearGradient id="silk-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A6235" stopOpacity="0" />
          <stop offset="0.25" stopColor="#C4A262" />
          <stop offset="0.55" stopColor="#F5E3B5" />
          <stop offset="0.8" stopColor="#C9A866" />
          <stop offset="1" stopColor="#8C7140" />
        </linearGradient>
        <linearGradient id="silk-navy" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0B1A33" />
          <stop offset="0.45" stopColor="#1D3762" />
          <stop offset="0.75" stopColor="#3A5A8C" />
          <stop offset="1" stopColor="#14294B" />
        </linearGradient>
      </defs>
      <path ref={gold} d={initial.gold} fill="url(#silk-gold)" />
      <path ref={navy} d={initial.navy} fill="url(#silk-navy)" />
      <path
        ref={line}
        d={initial.line}
        fill="none"
        stroke="#DABF84"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
    </svg>
  )
}

export default Ribbons
