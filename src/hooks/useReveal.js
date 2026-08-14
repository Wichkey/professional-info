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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      // threshold 0 so sections taller than the viewport still trigger
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
