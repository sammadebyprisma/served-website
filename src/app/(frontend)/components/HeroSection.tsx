'use client'

import { useEffect, useRef } from 'react'

type MediaValue = {
  url?: string
  alt?: string
}

type HeroProps = {
  blockType: 'hero'
  eyebrow?: string
  headline: string
  subheadline?: string
  primaryCTA?: { label?: string; href?: string }
  secondaryCTA?: { label?: string; href?: string }
  bowlLeftImage?: MediaValue
  bowlRightImage?: MediaValue
}

export function HeroSection({
  eyebrow = 'Now accepting early SIGNUPS',
  headline = "What's for dinner?",
  subheadline = 'Your AI kitchen assistant for smart grocery management.',
  primaryCTA = { label: 'Join the Waitlist', href: '#waitlist' },
  secondaryCTA = { label: 'See How It Works', href: '#how-it-works' },
  bowlLeftImage,
  bowlRightImage,
}: HeroProps) {
  const leftBowlRef = useRef<HTMLDivElement>(null)
  const rightBowlRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bowls = [leftBowlRef.current, rightBowlRef.current].filter(Boolean)

    bowls.forEach(bowl => {
      if (!bowl) return
      const img = bowl.querySelector('img')
      if (!img) {
        bowl.classList.add('is-loaded')
        return
      }

      const trigger = () => {
        bowl.classList.add('is-loaded')
        bowl.addEventListener('animationend', () => {
          bowl.classList.add('pills-active')
        }, { once: true })
      }

      if (img.complete && img.naturalWidth > 0) {
        trigger()
      } else {
        img.addEventListener('load', trigger, { once: true })
        img.addEventListener('error', trigger, { once: true })
      }
    })
  }, [])

  const leftSrc = bowlLeftImage?.url ?? '/assets/bowl-left.png'
  const rightSrc = bowlRightImage?.url ?? '/assets/bowl-right.png'

  return (
    <section className="hero-block">
      <div className="hero-bowl hero-bowl--left" aria-hidden="true" ref={leftBowlRef}>
        <img src={leftSrc} alt="" />
        <span className="hero-pill hero-pill--carrots">Carrots</span>
        <span className="hero-pill hero-pill--chickpeas">Chickpeas</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15.3925 7.78203C10.5294 6.46987 8.98755 4.91736 7.69627 0C6.40499 4.91736 4.86959 6.46987 0 7.78203C4.86317 9.09419 6.40499 10.6467 7.69627 15.5641C8.99397 10.6402 10.5294 9.0877 15.3925 7.78203Z" fill="#122E21"/>
          </svg>
          {eyebrow}
        </p>
        <h1>{headline}</h1>
        <p className="hero-sub">{subheadline}</p>
        <div className="hero-actions">
          {primaryCTA?.label && (
            <a className="btn-primary" href={primaryCTA.href ?? '#waitlist'}>{primaryCTA.label}</a>
          )}
          {secondaryCTA?.label && (
            <a className="btn-secondary" href={secondaryCTA.href ?? '#how-it-works'}>{secondaryCTA.label}</a>
          )}
        </div>
      </div>
      <div className="hero-bowl hero-bowl--right" aria-hidden="true" ref={rightBowlRef}>
        <img src={rightSrc} alt="" />
        <span className="hero-pill hero-pill--sweet-potato">Sweet Potato</span>
        <span className="hero-pill hero-pill--flank-steak">Flank Steak</span>
      </div>
    </section>
  )
}
