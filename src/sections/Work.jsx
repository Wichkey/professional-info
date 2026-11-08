import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import ExternalLink from '../components/ExternalLink';
import Icon from '../components/Icon';
import { WORK } from '../data/content';
import './Work.css';

function LinkOut({ link }) {
  return (
    <ExternalLink className="text-link" href={link.href}>
      {link.label}
      <Icon name="external" size={10} />
    </ExternalLink>
  );
}

function Rail({ now = false, last = false }) {
  return (
    <div className={`work__rail${now ? ' work__rail--now' : ''}${last ? ' work__rail--last' : ''}`} aria-hidden="true">
      <span className="work__rail-dot" />
      <span className="work__rail-line" />
    </div>
  );
}

export default function Work() {
  const { oblivion, earlier } = WORK;

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <BuildScope className="work__label">
        <SectionLabel label="Work" aside="2025 → now" />
      </BuildScope>

      <div className="work__grid">
        <BuildScope className="work__aside">
          <h2 id="work-title" className="work__title display" data-build="Heading" data-build-kind="heading">
            Where I build.
          </h2>
          <p className="work__intro" data-build="Intro">
            {WORK.intro}
          </p>
          <ul className="work__legend" data-build="Legend" data-build-kind="chips">
            <li>
              <span className="work__key work__key--now" aria-hidden="true" />
              Running now
            </li>
            <li>
              <span className="work__key work__key--build" aria-hidden="true" />
              In build
            </li>
            <li>
              <span className="work__key work__key--done" aria-hidden="true" />
              Finished
            </li>
          </ul>
        </BuildScope>

        <ol className="work__timeline">
          <li className="work__entry">
            <Rail now />
            <div className="work__body work__body--oblivion">
              <BuildScope className="work__block work__block--oblivion">
                <p className="work__meta" data-build="Meta" data-build-kind="chips">
                  <span>{oblivion.meta}</span>
                  <span className="status-pill status-pill--solid">now</span>
                </p>
                <div className="work__head work__head--oblivion" data-build="oblivion · entry 1" data-build-kind="heading">
                  <Icon name="layers" size={26} className="accent work__head-icon" />
                  <h3 className="work__name work__name--big">{oblivion.title}</h3>
                  <span className="work__role">{oblivion.role}</span>
                  <ExternalLink className="work__more-link" href={oblivion.link.href}>
                    More on {oblivion.link.label}
                    <Icon name="external" size={12} />
                  </ExternalLink>
                </div>
                <p className="work__text work__text--long" data-build="Copy">
                  <span className="work__lead">{oblivion.lead}</span> {oblivion.text}
                </p>
                <p className="work__text work__text--short" data-build="Copy">
                  <span className="work__lead">{oblivion.lead}</span> {oblivion.short}
                </p>
                <dl className="work__statements" data-build="Vision · Mission" data-build-kind="card">
                  {oblivion.statements.map((s) => (
                    <div key={s.label} className="work__statement">
                      <dt>{s.label}</dt>
                      <dd>{s.text}</dd>
                    </div>
                  ))}
                </dl>
              </BuildScope>

              <BuildScope as="ul" className="work__projects" aria-label="Oblivion projects">
                {oblivion.projects.map((p, i) => (
                  <li
                    key={p.title}
                    className="work__project"
                    data-build={`oblivion/projects · ${i + 1} of ${oblivion.projects.length}`}
                    data-build-kind="card"
                  >
                    <div className="work__project-head">
                      <span
                        className={`work__key work__key--small work__key--${p.status === 'built' ? 'done' : 'build'}`}
                        aria-hidden="true"
                      />
                      <h4>{p.title}</h4>
                      <span className="visually-hidden">({p.status})</span>
                    </div>
                    <p>{p.text}</p>
                    {p.link && (
                      <span className="work__project-link">
                        <LinkOut link={p.link} />
                      </span>
                    )}
                  </li>
                ))}
              </BuildScope>
            </div>
          </li>

          {earlier.map((entry, i) => (
            <li key={entry.title} className="work__entry">
              <Rail last={i === earlier.length - 1} />
              <BuildScope className="work__body work__block">
                <p className="work__meta" data-build={`entry ${i + 2} · meta`} data-build-kind="chips">
                  <span>{entry.meta}</span>
                  <span className="status-pill status-pill--done">done</span>
                </p>
                <div className="work__head" data-build={`entry ${i + 2} · ${entry.title.toLowerCase()}`} data-build-kind="heading">
                  <Icon name={entry.icon} size={24} className="accent" />
                  <h3 className="work__name">{entry.title}</h3>
                  <span className={`work__role work__role--small${entry.muted ? ' work__role--muted' : ''}`}>
                    {entry.by}
                  </span>
                </div>
                <div className="work__text" data-build="Copy">
                  {entry.role && <p className="work__job">{entry.role}</p>}
                  <p>{entry.text}</p>
                </div>
              </BuildScope>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
