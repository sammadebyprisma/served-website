'use client'

import { useEffect, useRef, useState } from 'react'

type MediaValue = { url?: string; alt?: string }

type KitchenItem = {
  name: string
  image?: MediaValue
  amount?: string
  tag?: string
  checked?: boolean
}

type KitchenProps = {
  blockType: 'kitchen'
  heading?: string
  subheading?: string
  inventoryItems?: KitchenItem[]
  primaryAction?: string
  secondaryAction?: string
}

type RowItem = { name: string; img: string; qty: string; checked: boolean }

const ROW1_DEFAULTS: RowItem[] = [
  { name: 'Whole Milk',      img: '/assets/Ingredient Tile Images/Whole Milk.png',       qty: '1 gallon', checked: true  },
  { name: 'Sourdough Bread', img: '/assets/Ingredient Tile Images/Bread.png',            qty: '1 loaf',   checked: false },
  { name: 'Brown Eggs',      img: '/assets/Ingredient Tile Images/Eggs.png',             qty: '1 dozen',  checked: false },
  { name: 'Walnuts',         img: '/assets/Ingredient Tile Images/Walnuts-OOS.png',      qty: '8 oz',     checked: true  },
]

const ROW2_DEFAULTS: RowItem[] = [
  { name: 'Extra Virgin Olive Oil', img: '/assets/Ingredient Tile Images/Extra Virgin Olive Oil.png', qty: '500 ml', checked: true  },
  { name: 'Red Onion',              img: '/assets/Ingredient Tile Images/Red Onion.png',              qty: '2 count', checked: false },
  { name: 'Fennel Bulbs',           img: '/assets/Ingredient Tile Images/Fennel Bulbs-OOS.png',       qty: '1 bunch', checked: false },
  { name: 'Potato',                 img: '/assets/Ingredient Tile Images/Potato-OOS.png',             qty: '2 lb',   checked: true  },
]

// ── Ingredient marquee track ─────────────────────────────────────
function IngredientTrack({ items, isReverse, checked, onCheck, pausedRef }: {
  items: RowItem[]
  isReverse: boolean
  checked: boolean[]
  onCheck: (i: number) => void
  pausedRef: React.MutableRefObject<boolean>
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const SPEED = 42
    let halfW    = 0
    let offset   = 0
    let lastTime: number | null = null
    let rafId    = 0
    let running  = false

    const tick = (ts: number) => {
      if (!pausedRef.current) {
        if (lastTime !== null) {
          const delta = Math.min((ts - lastTime) / 1000, 0.05)
          offset += SPEED * delta
          if (offset >= halfW) offset -= halfW
          track.style.transform = `translateX(${isReverse ? offset - halfW : -offset}px)`
        }
        lastTime = ts
      } else {
        lastTime = null
      }
      if (running) rafId = requestAnimationFrame(tick)
    }

    const start = () => { if (!running) { running = true; lastTime = null; rafId = requestAnimationFrame(tick) } }
    const stop  = () => { running = false; cancelAnimationFrame(rafId) }

    requestAnimationFrame(() => {
      const firstDupe = track.querySelector<HTMLElement>('.kitchen-ingredient-card[aria-hidden]')
      halfW = firstDupe ? firstDupe.offsetLeft : track.scrollWidth / 2
      if (isReverse) offset = halfW
      start()
    })

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop()
    }, { threshold: 0 })
    obs.observe(track)

    return () => { stop(); obs.disconnect() }
  }, [isReverse])

  const doubled = [...items, ...items]

  return (
    <div
      className={`kitchen-ingredient-row-track${isReverse ? ' kitchen-ingredient-row-track--reverse' : ''}`}
      ref={trackRef}
    >
      {doubled.map((item, j) => {
        const realIdx   = j % items.length
        const isChecked = checked[realIdx]
        const isDupe    = j >= items.length
        return (
          <div
            key={j}
            className="kitchen-ingredient-card"
            aria-hidden={isDupe ? 'true' : undefined}
          >
            <div className="kitchen-ingredient-card-img-wrap">
              <img src={item.img} alt={isDupe ? '' : item.name} loading="lazy" />
            </div>
            <div className="kitchen-ingredient-card-info">
              <span className="kitchen-ingredient-name">{item.name}</span>
              <span className="kitchen-ingredient-qty">{item.qty}</span>
              <span className="kitchen-ingredient-action-text">
                {isChecked ? 'Remove' : 'Add to list'}
              </span>
            </div>
            <span
              className={`kitchen-ingredient-checkbox${isChecked ? ' kitchen-ingredient-checkbox--checked' : ''}`}
              aria-hidden="true"
              onClick={() => onCheck(realIdx)}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Confirmation check SVG ────────────────────────────────────────
function ConfirmIcon() {
  return (
    <svg className="kitchen-confirm-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#079455" strokeWidth="1.5" opacity="0.1"/>
      <circle cx="20" cy="20" r="13" stroke="#079455" strokeWidth="1.5" opacity="0.3"/>
      <circle cx="20" cy="20" r="9" fill="#079455"/>
      <path d="M16.5 20l2.5 2.5 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function KitchenSection({
  heading,
  subheading,
  inventoryItems,
  primaryAction,
  secondaryAction,
}: KitchenProps) {
  // Build row data: use Payload items if present, else use defaults
  let row1Items: RowItem[], row2Items: RowItem[]
  if (inventoryItems && inventoryItems.length > 0) {
    const all = inventoryItems.map(item => ({
      name: item.name,
      img: (item.image as any)?.url ?? '',
      qty: item.amount ?? '',
      checked: item.checked ?? false,
    }))
    const mid = Math.ceil(all.length / 2)
    row1Items = all.slice(0, mid)
    row2Items = all.slice(mid)
  } else {
    row1Items = ROW1_DEFAULTS
    row2Items = ROW2_DEFAULTS
  }

  const [row1Checked, setRow1Checked] = useState(() => row1Items.map(i => i.checked))
  const [row2Checked, setRow2Checked] = useState(() => row2Items.map(i => i.checked))
  const [confirmState, setConfirmState] = useState<'idle' | 'add' | 'shop'>('idle')
  const pausedRef  = useRef<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.unobserve(section)
        setTimeout(() => section.classList.add('kitchen-visible'), 200)
      }
    }, { threshold: 0.12 })

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (confirmState !== 'idle') {
      const timer = setTimeout(() => setConfirmState('idle'), 2800)
      return () => clearTimeout(timer)
    }
  }, [confirmState])

  return (
    <section className="kitchen-block" id="how-it-works" ref={sectionRef}>
      <div className="kitchen-copy">
        <h2>{heading ?? 'When to get more of it.'}</h2>
        <p>{subheading ?? 'Reorder essentials or exactly what you need.'}</p>
      </div>
      <div className="kitchen-card-panel">
        <div
          className="kitchen-ingredient-rows"
          aria-label="Kitchen inventory preview"
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          <IngredientTrack
            items={row1Items}
            isReverse={false}
            checked={row1Checked}
            onCheck={i => setRow1Checked(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
            pausedRef={pausedRef}
          />
          <IngredientTrack
            items={row2Items}
            isReverse={true}
            checked={row2Checked}
            onCheck={i => setRow2Checked(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
            pausedRef={pausedRef}
          />
        </div>

        <div className="kitchen-cta">
          {confirmState === 'idle' ? (
            <div className="kitchen-cta-buttons" id="kitchen-cta-buttons">
              <button
                type="button"
                className="kitchen-btn-add"
                onClick={() => setConfirmState('add')}
              >
                {primaryAction ?? 'Add to Grocery list'}
                <img
                  src="/assets/Buttons/shopping-cart-03.svg"
                  alt=""
                  className="btn-cart-icon"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                className="kitchen-btn-shop"
                onClick={() => setConfirmState('shop')}
              >
                {secondaryAction ?? 'Shop with'}
                <div className="btn-shop-circles" aria-hidden="true">
                  <img src="/assets/Buttons/Ellipse 3.svg" alt="" className="btn-shop-circle" />
                  <img src="/assets/Buttons/Ellipse 1.svg" alt="" className="btn-shop-circle" />
                  <img src="/assets/Buttons/Aldi.svg"      alt="" className="btn-shop-circle" />
                  <img src="/assets/Buttons/+3 circle.svg" alt="" className="btn-shop-circle" />
                </div>
              </button>
            </div>
          ) : (
            <div className="kitchen-confirmation is-visible" role="status" aria-live="polite">
              <ConfirmIcon />
              {confirmState === 'add' ? 'Added items to grocery list' : 'Your order has been made!'}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
