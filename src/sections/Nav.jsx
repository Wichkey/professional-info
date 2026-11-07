import { useEffect, useId, useRef, useState } from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import PromptDMark from '../logo/PromptDMark';
import { NAV_LINKS } from '../data/content';
import resumePdf from '../assets/resume.pdf';
import './Nav.css';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={rootRef} className={`nav${open ? ' is-open' : ''}`} data-build="Nav" data-build-kind="chips">
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
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-bars" aria-hidden="true" />
        </button>
      </div>
      <div id={menuId} className="nav__menu" hidden={!open}>
        <nav aria-label="Sections">
          <ul className="nav__menu-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__menu-foot">
          <ThemeSwitch />
          <a className="nav__menu-cv btn btn--accent" href={resumePdf} download="Daniel-Mehler-CV.pdf" onClick={close}>
            download cv
          </a>
        </div>
      </div>
    </header>
  );
}
