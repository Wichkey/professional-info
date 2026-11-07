import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import Icon from '../components/Icon';
import { ABOUT } from '../data/content';
import './About.css';

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <BuildScope className="about__top">
        <SectionLabel label="About" aside="who builds this" />
        <div className="about__intro">
          <h2 id="about-title" className="about__headline display" data-build="Headline" data-build-kind="heading">
            {ABOUT.headline}
            <span className="accent">{ABOUT.headlineAccent}</span>
          </h2>
          <p className="about__lede" data-build="Intro">
            {ABOUT.intro}
          </p>
        </div>
      </BuildScope>

      <BuildScope as="ul" className="about__pillars">
        {ABOUT.pillars.map((pillar) => (
          <li key={pillar.title} className="about__pillar" data-build={pillar.title} data-build-kind="card">
            <Icon name={pillar.icon} size={32} className="accent" />
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </li>
        ))}
      </BuildScope>

      <BuildScope className="about__facts">
        <ul data-build="Facts" data-build-kind="chips">
          {ABOUT.facts.map((fact) => (
            <li key={fact.text}>
              <Icon name={fact.icon} size={18} />
              {fact.text}
            </li>
          ))}
        </ul>
        <p className="about__open" data-build="Status">
          <span className="about__dot" aria-hidden="true" />
          Open for projects
        </p>
      </BuildScope>
    </section>
  );
}
