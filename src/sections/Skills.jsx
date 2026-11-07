import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import Icon from '../components/Icon';
import { SKILLS } from '../data/content';
import './Skills.css';

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <BuildScope className="skills__top">
        <SectionLabel label="Skills" aside="used in production" />
        <div className="skills__intro">
          <h2 id="skills-title" className="skills__title display" data-build="Heading" data-build-kind="heading">
            What I work with.
          </h2>
          <ul className="skills__legend" data-build="Legend" data-build-kind="chips">
            <li>
              <span className="chip chip--daily">daily</span>
            </li>
            <li>
              <span className="chip">regularly</span>
            </li>
          </ul>
        </div>
      </BuildScope>

      <BuildScope as="ul" className="skills__grid">
        {SKILLS.groups.map((group) => (
          <li key={group.title} className="skills__cell" data-build={group.title} data-build-kind="chips">
            <h3 className="skills__group">
              <Icon name={group.icon} size={28} className="accent" />
              {group.title}
            </h3>
            <ul className="skills__chips" aria-label={`${group.title}, used daily`}>
              {group.daily.map((s) => (
                <li key={s} className="chip chip--daily">
                  {s}
                </li>
              ))}
            </ul>
            <ul className="skills__chips" aria-label={`${group.title}, used regularly`}>
              {group.regular.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </BuildScope>

      <BuildScope className="skills__spoken-wrap">
        <div className="skills__spoken" data-build="Spoken" data-build-kind="card">
          <h3 className="skills__spoken-title">
            <Icon name="speech" size={22} className="accent" />
            Spoken
          </h3>
          <ul className="skills__langs">
            {SKILLS.languages.map((lang) => (
              <li key={lang.name}>
                <span className="skills__lang">{lang.name}</span>
                <span className="skills__bars" role="img" aria-label={`${lang.level}, ${lang.bars} of 4`}>
                  {[0, 1, 2, 3].map((b) => (
                    <span key={b} className={b < lang.bars ? 'is-on' : undefined} />
                  ))}
                </span>
                <span className="skills__level mono">{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </BuildScope>
    </section>
  );
}
