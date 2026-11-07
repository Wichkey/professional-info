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

    // The first callback covers whatever is already on screen at load.
    let isFirstBatch = true

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

          // Authored delays choreograph the hero on load, so they only make
          // sense for what is already on screen. Once the layout stacks on a
          // phone, the same elements scroll in one at a time — and a 0.6s
          // delay then reads as lag. Anything arriving later is re-timed
          // against its own batch instead.
          if (el.hasAttribute('data-reveal-stagger') || !isFirstBatch) {
            el.style.setProperty('--reveal-delay', `${step * 0.07}s`)
            step += 1
          }
          el.classList.add('is-visible')
          observer.unobserve(el)
        })

        if (arriving.length) isFirstBatch = false
      },
      // threshold 0 so sections taller than the viewport still trigger
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
