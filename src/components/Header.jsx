import './Header.css'

const Header = () => {
  return (
    <header className="header" data-reveal="fade" style={{ '--reveal-delay': '0.15s' }}>
      <a className="logo" href="#top" aria-label="Daniel Mehler home">
        <span className="logo-d">D</span>
        <span className="logo-m">m</span>
        <span className="logo-dot">.</span>
      </a>
      <a className="resume-button" href="/resume.pdf" download>
        Download my Resume
      </a>
    </header>
  )
}

export default Header
