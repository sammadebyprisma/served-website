'use client'

import { useEffect, useRef } from 'react'

type MarqueeRow = {
  text: string
  reverse?: boolean
}

type QuestionMarqueeProps = {
  blockType: 'questionMarquee'
  heading?: string
  rows?: MarqueeRow[]
}

// Default rows match the original HTML content (one repetition each)
const DEFAULT_ROWS: MarqueeRow[] = [
  { text: "Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Is there chicken left?\u00a0 Do we have soy sauce?\u00a0 Do we need these onions?\u00a0 Did we run out of pasta?", reverse: false },
  { text: "We need to eat more vegetables.\u00a0 Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Is there chicken left?\u00a0 Do we have soy sauce?\u00a0 Did we run out of pasta?", reverse: true },
  { text: "Is there chicken left?\u00a0 We need to use this cream this week.\u00a0 Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Do we have soy sauce?\u00a0 Did we run out of pasta?", reverse: false },
  { text: "Are we out of garlic yet?\u00a0 We need to eat more vegetables.\u00a0 Do we have enough rice?\u00a0 What's for dinner?\u00a0 We need to use this cream this week.\u00a0 Is there chicken left?", reverse: true },
]

// ── Single scrolling question row ────────────────────────────────
function QuestionTrack({ text, isReverse }: { text: string; isReverse: boolean }) {
  const trackRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const SPEED = 35
    let halfW    = 0
    let offset   = 0
    let lastTime: number | null = null
    let rafId    = 0
    let running  = false

    const tick = (ts: number) => {
      if (lastTime !== null) {
        const delta = Math.min((ts - lastTime) / 1000, 0.05)
        offset += SPEED * delta
        if (offset >= halfW) offset -= halfW
        track.style.transform = `translateX(${isReverse ? offset - halfW : -offset}px)`
      }
      lastTime = ts
      if (running) rafId = requestAnimationFrame(tick)
    }

    const start = () => { if (!running) { running = true; lastTime = null; rafId = requestAnimationFrame(tick) } }
    const stop  = () => { running = false; cancelAnimationFrame(rafId) }

    requestAnimationFrame(() => {
      halfW = Math.round(track.scrollWidth / 2)
      if (isReverse) offset = halfW
      start()
    })

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop()
    }, { threshold: 0 })
    obs.observe(track)

    return () => { stop(); obs.disconnect() }
  }, [isReverse])

  // Duplicate the text inline for a seamless loop (halfW = scrollWidth / 2)
  return (
    <span className="question-track" ref={trackRef}>
      {text + '\u00a0 ' + text}
    </span>
  )
}

export function QuestionMarqueeSection({ rows }: QuestionMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.unobserve(wrap)
        setTimeout(() => wrap.classList.add('q-marquee-visible'), 100)
      }
    }, { threshold: 0.10 })

    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  const activeRows = rows && rows.length > 0 ? rows : DEFAULT_ROWS

  return (
    <div className="question-marquee-block" aria-hidden="true">
      <div className="question-marquee" ref={wrapRef}>
        {activeRows.map((row, i) => (
          <div key={i} className={`question-row${row.reverse ? ' question-row--reverse' : ''}`}>
            <QuestionTrack text={row.text} isReverse={!!row.reverse} />
          </div>
        ))}
      </div>
    </div>
  )
}
