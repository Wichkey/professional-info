import './Header.css'
import resumePdf from '../assets/resume.pdf'

const sections = [
  { label: 'Education', href: '#qualifications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]

const Header = () => {
  // A link inside <details> navigates but leaves the panel open.
  const closeMenu = (e) => {
    e.currentTarget.closest('details').open = false
  }

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

        <details className="section-menu">
          <summary aria-label="Jump to a section">Sections</summary>
          <ul onClick={closeMenu}>
            {sections.map((s) => (
              <li key={s.label}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </header>
  )
}

export default Header
