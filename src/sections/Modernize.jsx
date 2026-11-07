import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import ExternalLink from '../components/ExternalLink';
import { useTheme } from '../theme/ThemeContext';
import { LINKS, MODERNIZE } from '../data/content';
import oldSite from '../assets/old-site.webp';
import newSiteBlue from '../assets/new-site-blue.webp';
import newSitePink from '../assets/new-site-pink.webp';
import './Modernize.css';

const NEW_SITE = { blue: newSiteBlue, pink: newSitePink };

export default function Modernize() {
  const { theme } = useTheme();

  return (
    <section id="modernize" className="section modernize" aria-labelledby="modernize-title">
      <BuildScope className="modernize__top">
        <SectionLabel label="Oblivion" aside="old site → new site, rebuilt by agents" />
        <h2 id="modernize-title" className="modernize__title display" data-build="Heading" data-build-kind="heading">
          {MODERNIZE.title[0]}
          <br />
          <span className="accent">{MODERNIZE.title[1]}</span>
        </h2>
      </BuildScope>

      <BuildScope className="modernize__row">
        <div className="modernize__copy">
          <p className="modernize__text" data-build="Copy">
            {MODERNIZE.text}
          </p>
          <div className="modernize__actions" data-build="CTA" data-build-kind="chips">
            <ExternalLink className="btn btn--accent modernize__cta" href={LINKS.oblivion}>
              Modernize with Oblivion <span aria-hidden="true">↗</span>
            </ExternalLink>
            <a className="btn btn--outline modernize__talk" href="#contact">
              Talk to me
            </a>
          </div>
          <p className="modernize__domain mono">oblivion.vision</p>
        </div>

        <div className="modernize__compare">
          <figure className="shot shot--before" data-build="before" data-build-kind="image">
            <img src={oldSite} alt="The previous version of this website" width="1440" height="900" loading="lazy" />
            <figcaption>
              <span>before</span>
              <span>built by hand</span>
            </figcaption>
          </figure>
          <span className="modernize__arrow" aria-hidden="true">
            <span />›
          </span>
          <figure className="shot shot--after" data-build="after" data-build-kind="image">
            <img
              src={NEW_SITE[theme] ?? newSiteBlue}
              alt="This website after agents rebuilt it"
              width="720"
              height="405"
              loading="lazy"
            />
            <figcaption>
              <span>after</span>
              <span>rebuilt by agents</span>
            </figcaption>
          </figure>
        </div>
      </BuildScope>
    </section>
  );
}
