import './Hero.css'

const socials = [
  { name: 'linkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com' },
  { name: 'Github', icon: '/icons/github.png', url: 'https://github.com' },
]

const Hero = () => {
  return (
    <section className="hero" id="top">
      <div className="hero-left" data-reveal="left" style={{ '--reveal-delay': '0.25s' }}>
        <span className="hero-chip">Hello, i am</span>
        <h1 className="hero-name">
          Daniel
          <span className="hero-lastname">
            <span className="hero-dash" />
            Mehler
          </span>
        </h1>
        <a className="contact-button" href="#contact">
          contact me
        </a>
        <div className="hero-socials">
          <span className="hero-chip">
            socials <span className="hero-dash hero-dash-small" />
          </span>
          <ul className="socials-list">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  <img src={s.icon} alt="" width="32" height="32" />
                  <span>{s.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero-center" data-reveal="down" style={{ '--reveal-delay': '0.35s' }}>
        <div className="hero-photo">
          <img src="/profile-photo.webp" alt="Portrait of Daniel Mehler" />
        </div>
      </div>

      <div className="hero-right" data-reveal="right" style={{ '--reveal-delay': '0.45s' }}>
        <h2 className="hero-title">AI for Businesses</h2>
        <h3 className="hero-subtitle">Ai expert &amp; software engineer</h3>
        <p className="hero-description">
          I specialize in advising companies on AI integration, including
          fine-tuning models and implementing proof-of-concept solutions.
          Additionally, I design and develop interactive websites and create
          custom algorithms tailored to specific needs.
        </p>
      </div>

      <div className="hero-bottom" data-reveal="fade" style={{ '--reveal-delay': '0.6s' }}>
        <nav className="hero-nav" aria-label="Section navigation">
          <span className="nav-rule" />
          <a href="#qualifications">Education</a>
          <span className="nav-dash" />
          <a href="#skills">Skills</a>
          <span className="nav-dash" />
          <a href="#projects">Projects</a>
        </nav>
        <blockquote className="hero-quote">
          <p>&ldquo;Those who can imagine anything, can create the impossible.&rdquo;</p>
          <cite>- Alan Turing</cite>
        </blockquote>
      </div>
    </section>
  )
}

export default Hero
