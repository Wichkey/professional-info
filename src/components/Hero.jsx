import './Hero.css'
import resumePdf from '../assets/resume.pdf'
import profilePhoto from '../assets/profile-photo.webp'
import linkedinIcon from '../assets/icons/linkedin.png'
import githubIcon from '../assets/icons/github.png'

const socials = [
  {
    name: 'linkedIn',
    icon: linkedinIcon,
    url: 'https://www.linkedin.com/in/daniel-mehler-536630305',
  },
  { name: 'Github', icon: githubIcon, url: 'https://github.com/Wichkey' },
]

const Hero = () => {
  return (
    <section className="hero">
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
          <img src={profilePhoto} alt="Portrait of Daniel Mehler" />
        </div>
      </div>

      <div className="hero-right" data-reveal="right" style={{ '--reveal-delay': '0.45s' }}>
        <h2 className="hero-title">AI for Businesses</h2>
        <h3 className="hero-subtitle">AI Expert &amp; Software Engineer</h3>
        <p className="hero-description">
          I build full-stack applications and implement AI agents to automate
          the processes companies run on, and advise them on where agents pay
          off — from fine-tuned models in production to the interfaces people
          actually work in.
        </p>
        <a
          className="resume-button hero-resume"
          href={resumePdf}
          download="Daniel-Mehler-CV.pdf"
        >
          Download my Resume
        </a>
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
