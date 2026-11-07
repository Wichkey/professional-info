import { EMAIL } from '../../data/content';

export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
export const CAPTCHA_SCRIPT = 'https://web3forms.com/client/script.js';

/** Without a form key the site falls back to the visitor's mail app. */
export function openMailDraft({ name, email, phone, message }) {
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nPhone: ${phone || '-'}\nEmail: ${email}`);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function loadCaptchaScript() {
  if (!WEB3FORMS_KEY || document.querySelector(`script[src="${CAPTCHA_SCRIPT}"]`)) return;
  const script = document.createElement('script');
  script.src = CAPTCHA_SCRIPT;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

/** Resolves on success, throws with a short reason otherwise. */
export async function sendMessage({ name, email, phone, message }, { captcha, botcheck }) {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      name,
      email,
      phone,
      message,
      botcheck,
      'h-captcha-response': captcha,
    }),
  });
  let result = null;
  try {
    result = await response.json();
  } catch {
    // A non-JSON reply is handled as a failure below.
  }
  if (!result?.success) throw new Error(result?.message || `server answered ${response.status}`);
}
