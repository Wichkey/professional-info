import { useCallback, useRef, useState } from 'react';
import BuildScope from '../build/BuildScope';
import SectionLabel from '../components/SectionLabel';
import ExternalLink from '../components/ExternalLink';
import Icon from '../components/Icon';
import ContactDialog from './contact-terminal/ContactDialog';
import ContactTerminal from './contact-terminal/ContactTerminal';
import { CURSOR_PATH } from '../build/swarm';
import { CONTACT, EMAIL, LINKS } from '../data/content';
import resumePdf from '../assets/resume.pdf';
import './Contact.css';

const CHANNELS = [
  { icon: 'mail', title: 'Email', sub: 'answer within a day', href: `mailto:${EMAIL}` },
  { icon: 'linkedin', title: 'LinkedIn', sub: 'daniel-mehler', href: LINKS.linkedin, external: true },
  { icon: 'github', title: 'GitHub', sub: 'Wichkey', href: LINKS.github, external: true },
  { icon: 'download', title: 'CV', sub: 'PDF download', href: resumePdf, download: 'Daniel-Mehler-CV.pdf' },
];

function Channel({ channel }) {
  const body = (
    <>
      <Icon name={channel.icon} size={24} className="accent" />
      <span className="channel__text">
        <span className="channel__title">{channel.title}</span>
        <span className="channel__sub mono">{channel.sub}</span>
      </span>
      <Icon name={channel.download ? 'arrowDown' : 'arrowUpRight'} size={16} className="channel__arrow" />
    </>
  );

  if (channel.external) {
    return (
      <ExternalLink className="channel" href={channel.href}>
        {body}
      </ExternalLink>
    );
  }
  return (
    <a className="channel" href={channel.href} download={channel.download}>
      {body}
    </a>
  );
}

export default function Contact({ onSent }) {
  const [open, setOpen] = useState(false);
  const openerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus();
  }, []);

  // The shutdown sequence takes over from here, so the link keeps no focus.
  const handleSent = useCallback(
    (name) => {
      setOpen(false);
      onSent(name);
    },
    [onSent],
  );

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <BuildScope className="contact__top">
        <SectionLabel label="Contact" aside="Open for projects" dot />
        <h2 id="contact-title" className="contact__title display accent" data-build="Heading" data-build-kind="heading">
          {CONTACT.title[0]}
          <br />
          {CONTACT.title[1]}
        </h2>
        <div className="contact__row">
          <p className="contact__text" data-build="Copy">
            {CONTACT.text}
          </p>
          <div className="contact__cta-wrap" data-build="CTA" data-build-kind="chips">
            <button ref={openerRef} type="button" className="contact__cta" onClick={() => setOpen(true)}>
              Contact me
              <Icon name="arrowRight" className="contact__cta-arrow" strokeWidth={2.2} />
            </button>
            <span className="contact__cursor" aria-hidden="true">
              <svg width="20" height="22" viewBox="0 0 20 22">
                <path d={CURSOR_PATH} />
              </svg>
              <span>Agent</span>
            </span>
          </div>
        </div>
      </BuildScope>

      <BuildScope className="contact__form-wrap">
        <ContactTerminal onSent={onSent} />
      </BuildScope>

      <BuildScope as="ul" className="contact__channels">
        {CHANNELS.map((channel) => (
          <li key={channel.title} data-build={channel.title} data-build-kind="card">
            <Channel channel={channel} />
          </li>
        ))}
      </BuildScope>

      {open && <ContactDialog onClose={close} onSent={handleSent} />}
    </section>
  );
}
