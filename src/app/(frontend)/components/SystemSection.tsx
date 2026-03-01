'use client'

import { useEffect, useRef } from 'react'

type SystemProps = {
  blockType: 'system'
  kicker?: string
  heading?: string
  description?: string
}

const ROW1 = [
  { label: 'Vegetarian', solid: true }, { label: 'Chicken', solid: false },
  { label: 'Keto', solid: true }, { label: 'Salmon', solid: false },
  { label: 'Gluten Free', solid: true }, { label: 'Avocado', solid: false },
  { label: 'High Protein', solid: true }, { label: 'Dairy Free', solid: true },
  { label: 'Quinoa', solid: false }, { label: 'High Fiber', solid: true },
  { label: 'Garlic', solid: false }, { label: 'Vegan', solid: true },
  { label: 'Low Carb', solid: true }, { label: 'Sweet Potato', solid: false },
  { label: 'Paleo', solid: true }, { label: 'Eggs', solid: false },
  { label: 'Broccoli', solid: false }, { label: 'Olive Oil', solid: false },
]

const ROW2 = [
  { label: 'Tomato', solid: false }, { label: 'Low Fat', solid: true },
  { label: 'Chickpeas', solid: false }, { label: 'Nut Free', solid: true },
  { label: 'Whole30', solid: true }, { label: 'Anti-Inflammatory', solid: true },
  { label: 'Bell Pepper', solid: false }, { label: 'Mediterranean', solid: true },
  { label: 'Rice', solid: false }, { label: 'Butter', solid: false },
  { label: 'Spinach', solid: false }, { label: 'PCOS Friendly', solid: true },
  { label: 'Pasta', solid: false }, { label: 'Plant Based', solid: true },
  { label: 'Lemon', solid: false }, { label: 'Low Sodium', solid: true },
]

function useMarquee(ref: React.RefObject<HTMLDivElement | null>, speed: number, isReverse: boolean) {
  useEffect(() => {
    const row = ref.current
    if (!row) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let offset = 0
    let halfW = 0
    let lastTime: number | null = null
    let rafId = 0
    let running = false

    const tick = (timestamp: number) => {
      if (lastTime === null) lastTime = timestamp
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05)
      lastTime = timestamp
      offset += speed * delta
      if (offset >= halfW) offset -= halfW
      row.style.transform = `translateX(${isReverse ? offset - halfW : -offset}px)`
      if (running) rafId = requestAnimationFrame(tick)
    }

    const start = () => { if (!running) { running = true; lastTime = null; rafId = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(rafId) }

    requestAnimationFrame(() => {
      halfW = row.scrollWidth / 2
      start()
    })

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop()
    }, { threshold: 0 })
    obs.observe(row)

    return () => { stop(); obs.disconnect() }
  }, [speed, isReverse])
}

function PillRow({ pills, isReverse }: { pills: typeof ROW1; isReverse: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useMarquee(ref, 45, isReverse)

  const doubled = [...pills, ...pills]

  return (
    <div
      className={`pill-row${isReverse ? ' pill-row--reverse' : ''}`}
      ref={ref}
      aria-hidden="true"
    >
      {doubled.map((p, i) => (
        <span key={i} className={`pill-tag${p.solid ? ' pill-tag--solid' : ''}`}>{p.label}</span>
      ))}
    </div>
  )
}

export function SystemSection({
  kicker = 'The Served System',
  heading = 'Make dinner happen.',
  description = 'Served connects your pantry, your recipes, and your grocery store into one seamless AI ecosystem.',
}: SystemProps) {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.unobserve(header)
        setTimeout(() => header.classList.add('sys-header-visible'), 200)
      }
    }, { threshold: 0.25 })

    obs.observe(header)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="system-block">
      <div className="system-header" ref={headerRef}>
        <p className="system-kicker">{kicker}</p>
        <h2>{heading}</h2>
        <p className="system-sub">{description}</p>
      </div>
      <div className="system-visual">
        <div className="pill-rows">
          <PillRow pills={ROW1} isReverse={false} />
          <PillRow pills={ROW2} isReverse={true} />
        </div>
      </div>
    </section>
  )
}
