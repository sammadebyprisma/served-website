import React from 'react'
import './globals.css'
import { NavHeader } from './components/NavHeader'

export const metadata = {
  title: 'Served — What\'s for dinner?',
  description: 'Your AI kitchen assistant for smart grocery management.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="served-page">
          <NavHeader />
          {children}
          <footer className="served-footer">
            <a className="footer-logo" href="/">
              <img src="/assets/logo.png" alt="Served" />
            </a>
            <div className="footer-icon" aria-hidden="true">
              <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_footer)">
                  <path d="M0 24.0957C0 37.7023 10.9105 48.7344 24.3672 48.7344C37.8238 48.7344 48.7344 37.7023 48.7344 24.0957H0Z" fill="#122E21"/>
                  <path d="M36.2823 12.0478C28.7533 10.0164 26.3663 7.61286 24.3672 0C22.3681 7.61286 19.9911 10.0164 12.4521 12.0478C19.9811 14.0793 22.3681 16.4828 24.3672 24.0957C26.3763 16.4727 28.7533 14.0692 36.2823 12.0478Z" fill="#122E21"/>
                </g>
                <defs>
                  <clipPath id="clip0_footer">
                    <rect width="48.7344" height="48.7344" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <nav className="served-footer-links" aria-label="Footer">
              <a href="#features">Features</a>
              <a href="#replenishment">Replenishment</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#waitlist">Waitlist</a>
            </nav>
            <p className="footer-legal">© 2026 Served. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
