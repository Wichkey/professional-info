import { useEffect } from 'react'

// Reveals every [data-reveal] element once it enters the viewport.
// The hero is already in view on load, so it animates immediately;
// everything further down waits until it is scrolled to.
export const useReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Elements marked [data-reveal-stagger] cascade against the others
        // arriving in the same batch, top to bottom, rather than against a
        // fixed index. A fixed index breaks as soon as the layout reflows —
        // stacked columns restart their count midway down the page — and
        // leaves late items waiting out a long delay after scrolling in.
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        let step = 0
        arriving.forEach((entry) => {
          const el = entry.target
          if (el.hasAttribute('data-reveal-stagger')) {
            el.style.setProperty('--reveal-delay', `${step * 0.07}s`)
            step += 1
          }
          el.classList.add('is-visible')
          observer.unobserve(el)
        })
      },
      // threshold 0 so sections taller than the viewport still trigger
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
