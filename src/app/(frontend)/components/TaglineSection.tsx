'use client'

import { useEffect, useRef } from 'react'

type TaglineProps = {
  blockType: 'tagline'
  text?: string
}

const DEFAULT_PHRASES = [
  'Everything except the dishes.',
  'Make dinner happen.',
  'Your AI Kitchen assistant.',
]

export function TaglineSection({ text }: TaglineProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const SPEED = 85
    let halfW = 0
    let offset = 0
    let lastTime: number | null = null
    let rafId = 0
    let running = false

    const tick = (ts: number) => {
      if (lastTime !== null) {
        const delta = Math.min((ts - lastTime) / 1000, 0.05)
        offset += SPEED * delta
        if (offset >= halfW) offset -= halfW
        track.style.transform = `translateX(${-offset}px)`
      }
      lastTime = ts
      if (running) rafId = requestAnimationFrame(tick)
    }

    const start = () => { if (!running) { running = true; lastTime = null; rafId = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(rafId) }

    requestAnimationFrame(() => {
      const spans = track.querySelectorAll('span')
      const half = Math.floor(spans.length / 2)
      halfW = spans[half]
        ? (spans[half] as HTMLElement).offsetLeft
        : Math.round(track.scrollWidth / 2)
      start()
    })

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop()
    }, { threshold: 0 })
    obs.observe(track)

    return () => { stop(); obs.disconnect() }
  }, [])

  const phrases = text ? [text] : DEFAULT_PHRASES
  const doubled = [...phrases, ...phrases]

  return (
    <section className="tagline-block" aria-hidden="true">
      <div className="tagline-track" ref={trackRef}>
        {doubled.map((phrase, i) => (
          <span key={i}>{phrase}</span>
        ))}
      </div>
    </section>
  )
}
