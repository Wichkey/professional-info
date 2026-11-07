import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BuildContext } from './build/BuildContext';
import { canAnimate } from './build/motion';
import Intro from './intro/Intro';
import { introAlreadyPlayed, markIntroPlayed } from './intro/session';
import About from './sections/About';
import Contact from './sections/Contact';
import Education from './sections/Education';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Modernize from './sections/Modernize';
import Projects from './sections/Projects';
import Shutdown from './shutdown/Shutdown';
import Skills from './sections/Skills';
import Work from './sections/Work';
import ThemeProvider from './theme/ThemeProvider';

// The hero is the first build a visitor sees, so it plays slower than the sections below.
const HERO_STRETCH = 1.6;
const PLAIN_START = { origin: null, speed: 0.9, stretch: HERO_STRETCH };

export default function App() {
  const [buildEnabled] = useState(canAnimate);
  const [introOpen, setIntroOpen] = useState(() => buildEnabled && !introAlreadyPlayed());
  const [heroStart, setHeroStart] = useState(() => (introOpen ? null : PLAIN_START));
  const [shutdownFor, setShutdownFor] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if (introOpen) markIntroPlayed();
  }, [introOpen]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.inert = introOpen || shutdownFor !== null;
  }, [introOpen, shutdownFor]);

  const handleReveal = useCallback((origin) => {
    setHeroStart({ origin, speed: 1.3, stretch: HERO_STRETCH });
  }, []);

  const handleFinish = useCallback(() => setIntroOpen(false), []);
  const handleSent = useCallback((name) => setShutdownFor(name), []);

  const build = useMemo(() => ({ enabled: buildEnabled }), [buildEnabled]);

  return (
    <ThemeProvider>
      <BuildContext.Provider value={build}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main" ref={mainRef}>
          <Hero buildStart={heroStart} />
          <About />
          <Work />
          <Projects />
          <Skills />
          <Education />
          <Modernize />
          <Contact onSent={handleSent} />
        </main>
        <Footer />
        {introOpen && <Intro onReveal={handleReveal} onFinish={handleFinish} />}
        {shutdownFor !== null && <Shutdown name={shutdownFor} />}
      </BuildContext.Provider>
    </ThemeProvider>
  );
}
