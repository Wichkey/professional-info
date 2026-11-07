import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import ExternalLink from '../components/ExternalLink';
import Icon from '../components/Icon';
import { PROJECTS } from '../data/content';
import './Projects.css';

function GroupHead({ title, count }) {
  return (
    <h3 className="projects__group" data-build={title.toLowerCase()} data-build-kind="heading">
      {title}
      <span className="mono">{String(count).padStart(2, '0')}</span>
    </h3>
  );
}

function LinkOut({ link }) {
  return (
    <ExternalLink className="text-link" href={link.href}>
      {link.label}
      <Icon name="external" size={10} />
    </ExternalLink>
  );
}

export default function Projects() {
  const { products, sideBuilds, research } = PROJECTS;
  const total = products.length + sideBuilds.length + research.length;

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <BuildScope className="projects__top">
        <SectionLabel label="Projects" aside={`${total} builds`} />
        <div className="projects__intro">
          <h2 id="projects-title" className="projects__title display" data-build="Heading" data-build-kind="heading">
            Everything I&apos;ve built.
          </h2>
          <p data-build="Intro">{PROJECTS.intro}</p>
        </div>
      </BuildScope>

      <BuildScope className="projects__block">
        <GroupHead title="Products" count={products.length} />
        <ul className="projects__products">
          {products.map((p) => (
            <li key={p.title} className="product" data-build={p.title} data-build-kind="card">
              <div className="product__top">
                <span className={`product__icon${p.live ? ' product__icon--live' : ''}`}>
                  <Icon name={p.icon} size={24} />
                </span>
                <span className={`status-pill${p.live ? '' : ' status-pill--done'}`}>
                  <span className={`product__dot${p.live ? '' : ' product__dot--past'}`} aria-hidden="true" />
                  {p.status}
                </span>
              </div>
              <h4 className="product__title">{p.title}</h4>
              <p className="product__text">{p.text}</p>
              <div className="product__tags">
                {p.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                {p.link && (
                  <span className="product__link">
                    <LinkOut link={p.link} />
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </BuildScope>

      <BuildScope className="projects__block">
        <GroupHead title="Side builds" count={sideBuilds.length} />
        <ul className="projects__side">
          {sideBuilds.map((p) => (
            <li key={p.title} className="side" data-build={p.title} data-build-kind="card">
              <div className="side__top">
                <Icon name={p.icon} size={24} className="accent" />
                {p.status === 'shipped' ? (
                  <span className="status-pill side__shipped">
                    <Icon name="check" size={10} strokeWidth={2} />
                    shipped
                  </span>
                ) : (
                  <span className="status-pill">{p.status}</span>
                )}
              </div>
              <h4 className="side__title">{p.title}</h4>
              <p className="side__text">{p.text}</p>
              <div className="side__foot">
                <span className="mono">{p.meta}</span>
                {p.link && <LinkOut link={p.link} />}
              </div>
            </li>
          ))}
        </ul>
      </BuildScope>

      <BuildScope className="projects__block projects__block--last">
        <GroupHead title="Research" count={research.length} />
        <ul className="projects__research">
          {research.map((r) => (
            <li key={r.title} className="research" data-build={r.title.toLowerCase()}>
              <span className="research__icon">
                <Icon name={r.icon} size={22} />
              </span>
              <h4 className="research__title">{r.title}</h4>
              <p className="research__text">{r.text}</p>
              <span className="research__stack mono">{r.stack}</span>
              <span className="research__year mono">{r.year}</span>
              <span className="research__pill mono">research</span>
            </li>
          ))}
        </ul>
      </BuildScope>
    </section>
  );
}
