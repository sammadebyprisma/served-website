'use client'

import { useEffect, useRef, useState } from 'react'

type WaitlistProps = {
  blockType: 'waitlist'
  kicker?: string
  heading?: string
  subheading?: string
  buttonLabel?: string
  inputPlaceholder?: string
  successMessage?: string
}

// ── Scrolling question row (inside the waitlist card) ────────────
// The text is doubled inline; halfW = scrollWidth / 2 for seamless loop.
function QuestionRow({ text, isReverse }: { text: string; isReverse: boolean }) {
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

  return (
    <span className="question-track" ref={trackRef}>
      {text + '\u00a0 ' + text}
    </span>
  )
}

const QUESTION_ROWS = [
  { text: "Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Is there chicken left?\u00a0 Do we have soy sauce?\u00a0 Do we need these onions?\u00a0 Did we run out of pasta?", reverse: false },
  { text: "We need to eat more vegetables.\u00a0 Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Is there chicken left?\u00a0 Do we have soy sauce?\u00a0 Did we run out of pasta?", reverse: true },
  { text: "Is there chicken left?\u00a0 We need to use this cream this week.\u00a0 Are we out of olive oil?\u00a0 What's for dinner?\u00a0 Do we have soy sauce?\u00a0 Did we run out of pasta?", reverse: false },
  { text: "Are we out of garlic yet?\u00a0 We need to eat more vegetables.\u00a0 Do we have enough rice?\u00a0 What's for dinner?\u00a0 We need to use this cream this week.\u00a0 Is there chicken left?", reverse: true },
]

export function WaitlistSection({
  kicker = 'Early Access',
  heading = 'Make dinner happen.',
  subheading = 'Join the Served waitlist and be first to experience kitchen intelligence that actually works.',
  buttonLabel = 'Join Waitlist',
  inputPlaceholder = 'Enter your email',
  successMessage = "You're on the list! We'll be in touch soon.",
}: WaitlistProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.unobserve(section)
        setTimeout(() => section.classList.add('waitlist-visible'), 200)
      }
    }, { threshold: 0.15 })

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="waitlist-block" ref={sectionRef}>
      <div className="waitlist-inner">
        <p className="system-kicker system-kicker--dim">{kicker}</p>
        <h2>{heading}</h2>
        <p className="waitlist-sub">{subheading}</p>
        {submitted ? (
          <p className="waitlist-success">{successMessage}</p>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <input type="email" placeholder={inputPlaceholder} aria-label="Email address" required />
            <button type="submit">{buttonLabel}</button>
          </form>
        )}
        <div className="question-marquee" aria-hidden="true">
          {QUESTION_ROWS.map((row, i) => (
            <div key={i} className={`question-row${row.reverse ? ' question-row--reverse' : ''}`}>
              <QuestionRow text={row.text} isReverse={row.reverse} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
