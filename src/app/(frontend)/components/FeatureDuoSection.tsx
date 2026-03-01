'use client'

import { useEffect, useRef } from 'react'

type MediaValue = { url?: string; alt?: string }

type FeatureDuoCard = {
  title?: string
  description?: string
  variant?: 'dark' | 'warm'
  image?: MediaValue
}

type FeatureDuoProps = {
  blockType: 'featureDuo'
  knowsSlider?: {
    slide1?: MediaValue
    slide2?: MediaValue
    slide3?: MediaValue
  }
  cards?: FeatureDuoCard[]
}

// ── Knows card slideshow ─────────────────────────────────────────
function KnowsCard({ title, description, images }: {
  title: string
  description: string
  images: string[]
}) {
  const cardRef  = useRef<HTMLElement>(null)
  const slotARef = useRef<HTMLImageElement>(null)
  const slotBRef = useRef<HTMLImageElement>(null)
  const sideLeftRef  = useRef<HTMLImageElement>(null)
  const sideRightRef = useRef<HTMLImageElement>(null)
  const cameraWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const N        = images.length
    const INTERVAL = 3400
    const TRANS_MS = 550

    const slotAEl    = slotARef.current
    const slotBEl    = slotBRef.current
    const sideLeft   = sideLeftRef.current
    const sideRight  = sideRightRef.current
    const cameraWrap = cameraWrapRef.current
    const dotEls     = Array.from(card.querySelectorAll<HTMLSpanElement>('.knows-scan-dot'))
    const dots       = Array.from(card.querySelectorAll<HTMLSpanElement>('.card-dot'))

    if (!slotAEl || !slotBEl) return
    // Capture non-null refs for use in closures below
    const slotA = slotAEl
    const slotB = slotBEl

    // Mutable state tracked in refs to avoid stale closures
    let current    = 0
    let activeSlot = slotA
    let inactSlot  = slotB
    let busy       = false
    let timer: ReturnType<typeof setInterval> | null = null

    function showUI() { cameraWrap?.classList.add('ui-active') }
    function hideUI() { cameraWrap?.classList.remove('ui-active') }

    function snapLeft(el: HTMLImageElement) {
      el.style.transition = 'none'
      el.classList.remove('slide-center', 'slide-exit')
      el.getBoundingClientRect() // force reflow
      el.style.transition = ''
    }

    function randomizeDots() {
      const MIN_DIST = 24
      const TOP_MAX  = 62
      const placed: { t: number; l: number }[] = []

      dotEls.forEach((dot, i) => {
        let top = 0, left = 0, ok = false, attempts = 0
        do {
          top  = 10 + Math.random() * (TOP_MAX - 10)
          left = 10 + Math.random() * 74
          ok   = true
          for (const p of placed) {
            const dt = top - p.t, dl = left - p.l
            if (Math.sqrt(dt * dt + dl * dl) < MIN_DIST) { ok = false; break }
          }
          attempts++
        } while (!ok && attempts < 40)

        placed.push({ t: top, l: left })
        dot.style.top   = top.toFixed(1)  + '%'
        dot.style.left  = left.toFixed(1) + '%'
        dot.style.right = ''
        const d = -(i * 1.4 + Math.random() * 1.8)
        dot.style.animationDelay = d.toFixed(2) + 's, ' + (d * 0.75).toFixed(2) + 's'
      })
    }

    function updateSides(nextCurrent: number) {
      const li = (nextCurrent + 1) % N
      const ri = (nextCurrent - 1 + N) % N
      if (sideLeft)  sideLeft.style.opacity  = '0'
      if (sideRight) sideRight.style.opacity = '0'
      setTimeout(() => {
        if (sideLeft)  { sideLeft.src  = images[li]; sideLeft.style.opacity  = '' }
        if (sideRight) { sideRight.src = images[ri]; sideRight.style.opacity = '' }
      }, 180)
    }

    function advance() {
      if (busy) return
      busy = true

      const next      = (current + 1) % N
      const afterNext = (current + 2) % N

      hideUI()
      updateSides(next)
      dots[current]?.classList.remove('active')
      dots[next]?.classList.add('active')

      inactSlot.src = images[next]
      activeSlot.classList.remove('slide-center')
      activeSlot.classList.add('slide-exit')
      inactSlot.classList.add('slide-center')

      const tmp  = activeSlot
      activeSlot = inactSlot
      inactSlot  = tmp
      current    = next

      setTimeout(() => {
        snapLeft(inactSlot)
        inactSlot.src = images[afterNext]
        randomizeDots()
        showUI()
        busy = false
      }, TRANS_MS + 80)
    }

    function init() {
      slotA.src = images[0]
      slotB.src = images[1 % N]
      slotA.classList.add('slide-center')
      if (sideLeft)  sideLeft.src  = images[1 % N]
      if (sideRight) sideRight.src = images[(N - 1) % N]
      dots[0]?.classList.add('active')
      randomizeDots()
    }

    const start = () => { if (!timer) timer = setInterval(advance, INTERVAL) }
    const stop  = () => { if (timer) { clearInterval(timer); timer = null } }

    init()

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && entries[0].intersectionRatio > 0.35) {
        card.classList.add('is-visible')
        showUI()
        start()
      } else {
        card.classList.remove('is-visible')
        hideUI()
        stop()
      }
    }, { threshold: [0.35, 0.65] })

    obs.observe(card)

    return () => { stop(); obs.disconnect() }
  }, [images])

  return (
    <article
      className="feature-card feature-card--dark feature-card-knows"
      id="knows-card"
      ref={cardRef}
    >
      <div className="knows-visual">
        <div className="knows-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="knows-photos" aria-hidden="true">
          <img
            className="knows-photo knows-photo-side knows-photo-left"
            ref={sideLeftRef}
            src={images[1] ?? images[0]}
            alt=""
          />
          <div className="knows-photo-center-wrap">
            <img className="knows-slide knows-slide-a" ref={slotARef} src={images[0]} alt="" />
            <img className="knows-slide knows-slide-b" ref={slotBRef} src={images[1] ?? images[0]} alt="" />
            <div className="camera-scan-wrap" ref={cameraWrapRef}>
              <span className="knows-scan-dot"></span>
              <span className="knows-scan-dot"></span>
              <span className="knows-scan-dot"></span>
              <span className="knows-scan-dot"></span>
              <span className="knows-scan-dot"></span>
            </div>
            <div className="scan-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <img
            className="knows-photo knows-photo-side knows-photo-right"
            ref={sideRightRef}
            src={images[(images.length - 1)] ?? images[0]}
            alt=""
          />
        </div>
      </div>
      <div className="card-dots" aria-hidden="true">
        {images.map((_, i) => (
          <span key={i} className={`card-dot${i === 0 ? ' active' : ''}`}></span>
        ))}
      </div>
    </article>
  )
}

// ── Recipe card ──────────────────────────────────────────────────
function RecipeCard({ title, description, bowlImage }: {
  title: string
  description: string
  bowlImage?: string
}) {
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && entries[0].intersectionRatio > 0.3) {
        card.classList.add('recipe-card-active')
        obs.unobserve(card)
      }
    }, { threshold: 0.3 })

    obs.observe(card)
    return () => obs.disconnect()
  }, [])

  return (
    <article className="feature-card feature-card--warm" id="recipe-card" ref={cardRef}>
      <div className="feature-card-visual recipe-visual">
        <div className="recipe-card-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="recipe-bowl-area" aria-hidden="true">
          <div className="recipe-bowl-wrap">
            <img
              src={bowlImage ?? '/assets/food-bowl.png'}
              alt=""
              className="food-bowl-img"
              loading="lazy"
            />
          </div>
          <div className="recipe-pills">
            <span className="recipe-pill recipe-pill--green-beans">Green Beans</span>
            <span className="recipe-pill recipe-pill--sweet-potato">Sweet Potato</span>
            <span className="recipe-pill recipe-pill--flank-steak">Flank Steak</span>
            <span className="recipe-pill recipe-pill--quinoa">Quinoa</span>
            <span className="recipe-pill recipe-pill--start-cooking">
              <img src="/assets/Served-Star-mark-yellow.svg" alt="" className="recipe-pill-icon" />
              Start Cooking
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function FeatureDuoSection({ knowsSlider, cards = [] }: FeatureDuoProps) {
  const KNOWS_IMAGES = [
    knowsSlider?.slide1?.url ?? '/assets/Image 1.png',
    knowsSlider?.slide2?.url ?? '/assets/Image 3.png',
    knowsSlider?.slide3?.url ?? '/assets/Rectangle 2.png',
    '/assets/Image 4.png',
  ]

  const darkCard = cards[0] ?? {}
  const warmCard = cards[1] ?? {}

  return (
    <section className="duo-block">
      <KnowsCard
        title={darkCard.title ?? 'Knows what you have.'}
        description={darkCard.description ?? "Capture and keep track of what's in your fridge and pantry."}
        images={KNOWS_IMAGES}
      />
      <RecipeCard
        title={warmCard.title ?? 'What to do with it.'}
        description={warmCard.description ?? "Tailored recipe suggestions based on what's in stock."}
        bowlImage={warmCard.image?.url}
      />
    </section>
  )
}
