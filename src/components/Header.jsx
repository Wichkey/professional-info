import { useEffect, useRef, useState } from 'react'
import './Header.css'
import resumePdf from '../assets/resume.pdf'

const sections = [
  { label: 'Education', href: '#qualifications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]

const Header = () => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // The panel stays mounted so it can animate out as well as in, which
  // <details> cannot do — it stops rendering its content the moment it closes.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className="header" data-reveal="fade" style={{ '--reveal-delay': '0.15s' }}>
      <a className="logo" href="#top" aria-label="Daniel Mehler home">
        <span className="logo-d">D</span>
        <span className="logo-m">m</span>
        <span className="logo-dot">.</span>
      </a>

      <div className="header-actions">
        <a className="resume-button" href={resumePdf} download="Daniel-Mehler-CV.pdf">
          Download my Resume
        </a>

        <div className="section-menu" ref={menuRef}>
          <button
            type="button"
            className="section-menu-toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            Sections
          </button>
          <ul className={open ? 'is-open' : undefined} onClick={() => setOpen(false)}>
            {sections.map((s, i) => (
              <li key={s.label} style={{ '--item-index': i }}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
