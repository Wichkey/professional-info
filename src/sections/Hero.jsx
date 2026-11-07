import { useRef } from 'react';
import Nav from './Nav';
import { useTheme } from '../theme/ThemeContext';
import { useManualBuild } from '../build/useManualBuild';
import { HERO } from '../data/content';
import blue1600 from '../assets/hero-blue-1600.webp';
import blue2560 from '../assets/hero-blue-2560.webp';
import blue3840 from '../assets/hero-blue-3840.webp';
import pink1600 from '../assets/hero-pink-1600.webp';
import pink2560 from '../assets/hero-pink-2560.webp';
import pink3840 from '../assets/hero-pink-3840.webp';
import '../build/build.css';
import './Hero.css';

const portrait = (w1600, w2560, w3840) => ({
  src: w2560,
  srcSet: `${w1600} 1600w, ${w2560} 2560w, ${w3840} 3840w`,
});

const PORTRAITS = {
  blue: portrait(blue1600, blue2560, blue3840),
  pink: portrait(pink1600, pink2560, pink3840),
};

// The image is drawn at 95% of its cover size, so on screens taller
// than the photo's 1.747 aspect it renders wider than the viewport.
const PORTRAIT_SIZES = '(max-aspect-ratio: 1747/1000) 166vh, 95vw';

export default function Hero({ buildStart }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const image = PORTRAITS[theme] ?? PORTRAITS.blue;
  useManualBuild(ref, buildStart);

  return (
    <section ref={ref} id="top" className="hero build-scope" aria-labelledby="hero-title">
      <img
        className="hero__bg"
        data-build-id="hero-bg"
        sizes={PORTRAIT_SIZES}
        srcSet={image.srcSet}
        src={image.src}
        alt="Daniel Mehler in a dark room, lit by a single spotlight"
        width="3840"
        height="2198"
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
