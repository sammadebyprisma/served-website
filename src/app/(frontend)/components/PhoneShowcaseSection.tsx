'use client'

import { useEffect, useRef } from 'react'

type MediaValue = { url?: string; alt?: string }

type PhoneShowcaseProps = {
  blockType: 'phoneShowcase'
  phoneLeft?: MediaValue
  phoneCenter?: MediaValue
  phoneRight?: MediaValue
}

export function PhoneShowcaseSection({ phoneLeft, phoneCenter, phoneRight }: PhoneShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // Capture non-null ref for use in closures below
    const el = section

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function clamp(v: number, min: number, max: number) {
      return Math.min(max, Math.max(min, v))
    }

    function applyPhoneStyles(enterProgress: number, fanProgress: number) {
      const minSpread = Math.max(120, Math.min(180, window.innerWidth * 0.14))
      const maxSpread = Math.max(180, Math.min(260, window.innerWidth * 0.20))
      const spread      = minSpread + (maxSpread - minSpread) * fanProgress
      const tilt        = 9 + (8 * fanProgress)
      const sideScale   = 0.82 + (0.08 * fanProgress)
      const sideOpacity = 0.55 + (0.35 * fanProgress)
      const stageY      = 56 - (66 * enterProgress)

      el.style.setProperty('--phones-stage-y',      stageY.toFixed(1) + 'px')
      el.style.setProperty('--phones-left-x',       (-spread).toFixed(1) + 'px')
      el.style.setProperty('--phones-right-x',      spread.toFixed(1) + 'px')
      el.style.setProperty('--phones-left-rot',     (-tilt).toFixed(2) + 'deg')
      el.style.setProperty('--phones-right-rot',    tilt.toFixed(2) + 'deg')
      el.style.setProperty('--phones-side-scale',   sideScale.toFixed(3))
      el.style.setProperty('--phones-side-opacity', sideOpacity.toFixed(3))
    }

    function updatePhones() {
      const rect = el.getBoundingClientRect()
      const vh   = window.innerHeight || 1
      const enterProgress = clamp((vh * 0.9 - rect.top) / (vh * 0.55), 0, 1)
      const fanProgress   = clamp((vh * 0.62 - rect.top) / (vh + (rect.height * 0.35)), 0, 1)
      applyPhoneStyles(enterProgress, fanProgress)
    }

    let rafId = 0
    function requestUpdate() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updatePhones)
    }

    if (prefersReduced) {
      applyPhoneStyles(1, 1)
    } else {
      requestUpdate()
      window.addEventListener('scroll', requestUpdate, { passive: true })
      window.addEventListener('resize', requestUpdate, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const leftSrc   = phoneLeft?.url   ?? '/assets/phone-kitchen.png'
  const centerSrc = phoneCenter?.url ?? '/assets/phone-home.png'
  const rightSrc  = phoneRight?.url  ?? '/assets/Served-Phone-Picture-v2.png'

  return (
    <section
      className="phones-block phones-block--enhanced"
      id="features"
      aria-hidden="true"
      ref={sectionRef}
    >
      <div className="phones-stage">
        <div className="sys-phone sys-phone--left">
          <img src={leftSrc} alt="" />
        </div>
        <div className="sys-phone sys-phone--center">
          <img src={centerSrc} alt="" />
        </div>
        <div className="sys-phone sys-phone--right">
          <img src={rightSrc} alt="" />
        </div>
      </div>
    </section>
  )
}
