import { useState } from 'react'
import './Contact.css'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

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
      window.location.href = `mailto:daniel@vlcorp.mx?subject=${subject}&body=${body}`
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
      <h2 className="section-heading contact-heading">Contact</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
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
          <label className="contact-field">
            Phone Number (optional)
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
        </div>
        <label className="contact-field contact-field-message">
          Message
          <textarea
            name="message"
            rows="1"
            required
            placeholder="Write your message here..."
          />
        </label>
        <button className="send-button" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send'} <span aria-hidden="true">&rarr;</span>
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
    </section>
  )
}

export default Contact
