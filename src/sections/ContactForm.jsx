import { useEffect, useState } from 'react';
import { EMAIL } from '../data/content';
import './ContactForm.css';

const CAPTCHA_SCRIPT = 'https://web3forms.com/client/script.js';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const MESSAGES = {
  captcha: 'Please confirm you are not a robot.',
  sent: 'Thanks! Your message has been sent.',
  error: 'Something went wrong. Please try again or email me directly.',
};

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!WEB3FORMS_KEY || document.querySelector(`script[src="${CAPTCHA_SCRIPT}"]`)) return;
    const script = document.createElement('script');
    script.src = CAPTCHA_SCRIPT;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone');
    const message = data.get('message');

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\nPhone: ${phone || '-'}\nEmail: ${email}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    const captcha = form.querySelector('textarea[name=h-captcha-response]')?.value;
    if (!captcha) {
      setStatus('captcha');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          phone,
          message,
          botcheck: form.elements.botcheck.checked,
          'h-captcha-response': captcha,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      window.hcaptcha?.reset();
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} data-build="Form" data-build-kind="card">
      <p className="contact-form__title">Or leave a message here</p>
      <div className="contact-form__row">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>
            Phone <em>optional</em>
          </span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea name="message" rows="4" required />
      </label>
      <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} aria-hidden="true" />
      {WEB3FORMS_KEY && <div className="h-captcha" data-captcha="true" data-theme="dark" />}
      <div className="contact-form__foot">
        <button className="btn btn--outline contact-form__submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className={`contact-form__status contact-form__status--${status}`} role="status" aria-live="polite">
          {MESSAGES[status] ?? ''}
        </p>
      </div>
    </form>
  );
}
