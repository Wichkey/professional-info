import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import Icon from '../components/Icon';
import { EDUCATION } from '../data/content';
import './Education.css';

export default function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <BuildScope className="education__top">
        <SectionLabel label="Education" aside="2021 — 2026" />
        <h2 id="education-title" className="education__title display accent" data-build="Heading" data-build-kind="heading">
          Where it started.
        </h2>
      </BuildScope>

      <BuildScope as="ul" className="education__grid">
        {EDUCATION.map((d) => (
          <li
            key={d.degree}
            className={`degree${d.featured ? ' degree--featured' : ''}`}
            data-build={d.degree}
            data-build-kind="card"
          >
            <div className="degree__top">
              <span className="degree__badge">
                <Icon name={d.icon} size={30} />
              </span>
              <p className="degree__when">
                <span className="mono">{d.years}</span>
                <span>{d.place}</span>
              </p>
            </div>
            <div className="degree__name">
              <p>{d.school}</p>
              <h3>{d.degree}</h3>
            </div>
            <ul className="degree__grades" aria-label="Grades">
              {d.grades.map((g) => (
                <li key={g.label} className={g.primary ? 'is-primary' : undefined}>
                  {g.label}
                </li>
              ))}
            </ul>
            <div className="degree__thesis">
              <Icon name="doc" size={22} />
              <div>
                <p className="degree__thesis-head">
                  Thesis <span className="mono">{d.thesisGrade}</span>
                </p>
                <p className="degree__thesis-text">{d.thesis}</p>
              </div>
            </div>
          </li>
        ))}
      </BuildScope>
    </section>
  );
}
