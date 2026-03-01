'use client'

import { useEffect, useRef } from 'react'

export function NavHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const mobMenu = menuRef.current
    const toggleBtn = toggleRef.current
    if (!header) return

    // ── Nav hide on scroll down / reveal on scroll up ──
    let lastY = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      if (mobMenu?.classList.contains('is-open')) {
        lastY = currentY
        return
      }
      if (currentY <= 40) {
        header.classList.remove('nav-hidden')
      } else if (currentY - lastY > 6) {
        header.classList.add('nav-hidden')
      } else if (lastY - currentY > 6) {
        header.classList.remove('nav-hidden')
      }
      lastY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Mobile menu toggle ──
    const closeMenu = () => {
      toggleBtn?.classList.remove('is-open')
      mobMenu?.classList.remove('is-open')
      toggleBtn?.setAttribute('aria-expanded', 'false')
    }

    const onToggle = () => {
      const isOpen = toggleBtn?.classList.toggle('is-open') ?? false
      mobMenu?.classList.toggle('is-open', isOpen)
      toggleBtn?.setAttribute('aria-expanded', String(isOpen))
    }

    const onResize = () => {
      if (window.innerWidth > 750) closeMenu()
    }

    toggleBtn?.addEventListener('click', onToggle)
    window.addEventListener('resize', onResize)

    mobMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      toggleBtn?.removeEventListener('click', onToggle)
    }
  }, [])

  return (
    <header className="served-header" ref={headerRef}>
      <div className="served-header-inner">
        <nav className="served-nav" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#replenishment">Replenishment</a>
          <a href="#how-it-works">How it Works</a>
        </nav>
        <a className="served-logo" href="/">
          <img src="/assets/logo.png" alt="Served" height="30" />
        </a>
        <div className="served-header-right">
          <a className="served-header-cta" href="#waitlist">Join Waitlist</a>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="served-mobile-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="served-mobile-menu" ref={menuRef}>
        <nav aria-label="Mobile Primary">
          <a href="#features">Features</a>
          <a href="#replenishment">Replenishment</a>
          <a href="#how-it-works">How it Works</a>
          <a className="served-header-cta served-header-cta--mobile" href="#waitlist">Join Waitlist</a>
        </nav>
      </div>
    </header>
  )
}
