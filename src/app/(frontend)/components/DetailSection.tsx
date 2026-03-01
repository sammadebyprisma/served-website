'use client'

import { useEffect, useRef } from 'react'

type CheckItem = { text: string }

type DetailProps = {
  blockType: 'detail'
  sectionId?: string
  kicker?: string
  heading: string
  description?: string
  checkItems?: CheckItem[]
  image?: { url?: string; alt?: string }
  backgroundColor?: 'dark' | 'light' | 'warm' | 'plum'
  reversed?: boolean
}

// Gold check circle SVG used for all check items
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10.5131 14.1195L8.17684 11.7832C8.01084 11.6172 7.80734 11.5342 7.56634 11.5342C7.32534 11.5342 7.11192 11.6256 6.92609 11.8082C6.76025 11.9781 6.67734 12.1833 6.67734 12.424C6.67734 12.6645 6.76225 12.8677 6.93209 13.0337L9.91034 16.037C10.0822 16.2068 10.2826 16.2917 10.5116 16.2917C10.7406 16.2917 10.942 16.2068 11.1158 16.037L17.0191 10.1277C17.2058 9.94506 17.2991 9.73423 17.2991 9.49523C17.2991 9.25623 17.2058 9.0439 17.0191 8.85823C16.8364 8.69223 16.6204 8.6134 16.3711 8.62173C16.1218 8.63006 15.9126 8.71723 15.7436 8.88323L10.5131 14.1195ZM12.0008 22.1495C10.6098 22.1495 9.297 21.8838 8.06234 21.3525C6.82784 20.8211 5.74959 20.0945 4.82759 19.1725C3.90559 18.2505 3.17892 17.1725 2.64759 15.9385C2.11625 14.7045 1.85059 13.3919 1.85059 12.0007C1.85059 10.5931 2.11625 9.2719 2.64759 8.03723C3.17892 6.80273 3.90525 5.72857 4.82659 4.81473C5.74792 3.90073 6.82575 3.17723 8.06009 2.64423C9.29442 2.11107 10.6073 1.84448 11.9988 1.84448C13.4068 1.84448 14.7284 2.1109 15.9636 2.64373C17.1986 3.17657 18.2728 3.89965 19.1863 4.81298C20.1 5.72632 20.8233 6.80032 21.3561 8.03498C21.8891 9.26965 22.1556 10.5913 22.1556 12C22.1556 13.3916 21.889 14.7047 21.3558 15.9392C20.8228 17.1737 20.0993 18.2517 19.1853 19.1732C18.2715 20.0947 17.1976 20.8211 15.9636 21.3525C14.7296 21.8838 13.4087 22.1495 12.0008 22.1495ZM12.0001 20.4462C14.3508 20.4462 16.3462 19.6233 17.9863 17.9775C19.6263 16.3315 20.4463 14.339 20.4463 12C20.4463 9.64932 19.6263 7.6539 17.9863 6.01373C16.3462 4.37373 14.3498 3.55373 11.9971 3.55373C9.66109 3.55373 7.66984 4.37373 6.02334 6.01373C4.377 7.6539 3.55384 9.65031 3.55384 12.003C3.55384 14.339 4.37675 16.3302 6.02259 17.9767C7.66859 19.6231 9.66109 20.4462 12.0001 20.4462Z" fill="#FFC155"/>
    </svg>
  )
}

export function DetailSection({
  sectionId,
  kicker,
  heading,
  description,
  checkItems = [],
  image,
  backgroundColor = 'dark',
  reversed = false,
}: DetailProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.unobserve(section)
        setTimeout(() => section.classList.add('detail-visible'), 200)
      }
    }, { threshold: 0.15 })

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  const bgClass = `detail-block--bg-${backgroundColor}`
  const innerClass = `detail-block__inner${reversed ? ' detail-block__inner--reverse' : ''}`

  return (
    <section
      className={`detail-block ${bgClass}`}
      id={sectionId}
      ref={sectionRef}
    >
      <div className={innerClass}>
        <div className="detail-copy">
          {kicker && <p className="system-kicker">{kicker}</p>}
          <h3>{heading}</h3>
          {description && <p>{description}</p>}
          {checkItems.length > 0 && (
            <ul className="check-list">
              {checkItems.map((item, i) => (
                <li key={i} className="check-item">
                  <CheckIcon />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="detail-visual">
          {image?.url && (
            <img src={image.url} alt={image.alt ?? ''} loading="lazy" />
          )}
        </div>
      </div>
    </section>
  )
}
