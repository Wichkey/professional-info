import { useRef } from 'react';
import Nav from './Nav';
import { useTheme } from '../theme/ThemeContext';
import { useManualBuild } from '../build/useManualBuild';
import { HERO } from '../data/content';
import heroBlue from '../assets/hero-blue.webp';
import heroPink from '../assets/hero-pink.webp';
import '../build/build.css';
import './Hero.css';

const PORTRAITS = { blue: heroBlue, pink: heroPink };

export default function Hero({ buildStart }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  useManualBuild(ref, buildStart);

  return (
    <section ref={ref} id="top" className="hero build-scope" aria-labelledby="hero-title">
      <img
        className="hero__bg"
        data-build-id="hero-bg"
        src={PORTRAITS[theme] ?? heroBlue}
        alt="Daniel Mehler in a dark room, lit by a single spotlight"
        width="1024"
        height="586"
        fetchPriority="high"
      />
      <div className="hero__shade" aria-hidden="true" />
      <Nav />

      <div
        className="hero__portrait-anchor"
        data-build="Portrait · 38%"
        data-build-kind="image"
        data-build-reveals="hero-bg"
        aria-hidden="true"
      />

      <ul className="hero__notes" data-build="Notes">
        {HERO.notes.map((lines) => (
          <li key={lines.join(' ')}>
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </li>
        ))}
      </ul>

      <div className="hero__title" data-build="H1 · display" data-build-kind="heading">
        <p className="hero__eyebrow">{HERO.eyebrow}</p>
        <h1 id="hero-title" className="hero__h1">
          {HERO.title[0]}
          <br />
          {HERO.title[1]}
        </h1>
      </div>

      <ul className="hero__tags" data-build="Keywords" data-build-kind="chips">
        {HERO.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </section>
  );
}
