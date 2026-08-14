import { useState } from 'react'
import './Contact.css'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const EMAIL = 'daniel@vlcorp.mx'

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Instagram', url: 'https://www.instagram.com' },
]

const Contact = () => {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    // Honeypot: real users never fill this hidden field
    if (form.botcheck.value) return

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name.value}`)
      const body = encodeURIComponent(
        `${form.message.value}\n\nPhone: ${form.phone.value || '-'}\nEmail: ${form.email.value}`
      )
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          message: form.message.value,
          botcheck: form.botcheck.value,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact">
      <h2 className="section-heading contact-heading" data-reveal="left">
        Contact
      </h2>

      <div className="contact-grid">
        <div className="contact-intro" data-reveal>
          <p className="contact-say">
            Let&rsquo;s build something
            <span> together.</span>
          </p>
          <p className="contact-sub">
            Whether it is AI integration, a proof of concept or a website — tell
            me briefly what you have in mind.
          </p>

          <a className="contact-direct" href={`mailto:${EMAIL}`}>
            <small>Direct</small>
            <b>{EMAIL}</b>
          </a>

          <ul className="contact-social">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          data-reveal
          style={{ '--reveal-delay': '0.12s' }}
        >
          <input
            type="checkbox"
            name="botcheck"
            className="botcheck"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="contact-row">
            <label className="contact-field">
              Your Name
              <input type="text" name="name" required autoComplete="name" />
            </label>
            <label className="contact-field">
              Email Address
              <input type="email" name="email" required autoComplete="email" />
            </label>
          </div>
          <label className="contact-field">
            Phone Number (optional)
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <label className="contact-field">
            Message
            <textarea
              name="message"
              rows="3"
              required
              placeholder="Write your message here..."
            />
          </label>

          <button className="send-button" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
            <span aria-hidden="true">&rarr;</span>
          </button>

          {status === 'sent' && (
            <p className="contact-status" role="status">
              Thanks! Your message has been sent.
            </p>
          )}
          {status === 'error' && (
            <p className="contact-status contact-status-error" role="status">
              Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
