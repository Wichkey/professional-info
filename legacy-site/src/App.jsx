import Header from './components/Header'
import Hero from './components/Hero'
import Qualifications from './components/Qualifications'
import Internship from './components/Internship'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useReveal } from './hooks/useReveal'

const App = () => {
  useReveal()

  return (
    <div className="page">
      {/* The #top anchor sits here rather than on the hero so "back to top"
          lands above the header instead of scrolling past it. */}
      <div className="landing" id="top">
        <Header />
        <Hero />
      </div>
      <main>
        <div className="rail">
          <Qualifications />
          <Internship />
          <Skills />
          <Projects />
          <Contact />
          {/* Closes the timeline: the line turns a corner and runs out
              under the section instead of just stopping. */}
          <div className="rail-terminal" aria-hidden="true" />
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default App
