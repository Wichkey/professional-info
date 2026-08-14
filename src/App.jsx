import Header from './components/Header'
import Hero from './components/Hero'
import Qualifications from './components/Qualifications'
import Internship from './components/Internship'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { useReveal } from './hooks/useReveal'

const App = () => {
  useReveal()

  return (
    <div className="page">
      <div className="landing">
        <Header />
        <Hero />
      </div>
      <main>
        <div className="rail">
          <Qualifications />
          <Internship />
          <Skills />
          <Projects />
        </div>
        <Contact />
      </main>
    </div>
  )
}

export default App
