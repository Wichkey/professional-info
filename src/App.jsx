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
import Skills from './sections/Skills';
import Work from './sections/Work';
import ThemeProvider from './theme/ThemeProvider';

const PLAIN_START = { origin: null, speed: 0.9 };

export default function App() {
  const [buildEnabled] = useState(canAnimate);
  const [introOpen, setIntroOpen] = useState(() => buildEnabled && !introAlreadyPlayed());
  const [heroStart, setHeroStart] = useState(() => (introOpen ? null : PLAIN_START));
  const mainRef = useRef(null);

  useEffect(() => {
    if (introOpen) markIntroPlayed();
  }, [introOpen]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.inert = introOpen;
  }, [introOpen]);

  const handleReveal = useCallback((origin) => {
    setHeroStart({ origin, speed: 1.3 });
  }, []);

  const handleFinish = useCallback(() => setIntroOpen(false), []);

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
          <Contact />
        </main>
        <Footer />
        {introOpen && <Intro onReveal={handleReveal} onFinish={handleFinish} />}
      </BuildContext.Provider>
    </ThemeProvider>
  );
}
