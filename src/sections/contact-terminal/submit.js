import { EMAIL } from '../../data/content';

export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
// Loaded straight from hCaptcha: the Web3Forms client script only pulls the API in for
// widgets it finds in the markup, and this one is rendered by hand.
export const CAPTCHA_SCRIPT = 'https://js.hcaptcha.com/1/api.js?render=explicit';
// Web3Forms' own public key, the one it fills in for forms without a key of their own.
export const CAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

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

/**
 * The widget is invisible, so none of hCaptcha's own chrome sits in the terminal: the
 * token is asked for while sending instead. hCaptcha only renders the widgets that are
 * in the page when its script loads, and the terminal mounts later than that, so the
 * widget is drawn by hand. Returns the function that stops waiting for the script.
 */
export function renderCaptcha(host, onReady) {
  if (!WEB3FORMS_KEY || !host) return undefined;
  let timer = 0;
  const attempt = () => {
    // React mounts the terminal twice in development, and hCaptcha refuses a second
    // widget in the same container, so an existing one is reused.
    if (host.dataset.widgetId) {
      onReady(host.dataset.widgetId);
      return true;
    }
    if (!window.hcaptcha?.render) return false;
    host.dataset.widgetId = window.hcaptcha.render(host, { sitekey: CAPTCHA_SITEKEY, size: 'invisible', theme: 'dark' });
    onReady(host.dataset.widgetId);
    return true;
  };
  if (!attempt()) timer = window.setInterval(() => attempt() && window.clearInterval(timer), 120);
  return () => window.clearInterval(timer);
}

/** Runs the check. Resolves with the token, throws hCaptcha's own reason otherwise. */
export async function solveCaptcha(widgetId) {
  if (!widgetId || !window.hcaptcha?.execute) throw new Error('the check did not load');
  try {
    const { response } = await window.hcaptcha.execute(widgetId, { async: true });
    if (!response) throw new Error('no answer from the check');
    return response;
  } catch (reason) {
    // hCaptcha rejects with a bare string such as 'challenge-closed'.
    throw reason instanceof Error ? reason : new Error(String(reason?.error ?? reason));
  }
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
