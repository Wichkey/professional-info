import ThemeSwitch from '../theme/ThemeSwitch';
import PromptDMark from '../logo/PromptDMark';
import { NAV_LINKS } from '../data/content';
import resumePdf from '../assets/resume.pdf';
import './Nav.css';

export default function Nav() {
  return (
    <header className="nav" data-build="Nav" data-build-kind="chips">
      <a className="nav__logo" href="#top" aria-label="Daniel Mehler, back to top">
        <PromptDMark />
        <span className="nav__name">Daniel Mehler</span>
      </a>
      <nav className="nav__links" aria-label="Sections">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav__actions">
        <ThemeSwitch />
        <a className="nav__cv" href={resumePdf} download="Daniel-Mehler-CV.pdf">
          download cv
        </a>
      </div>
    </header>
  );
}
