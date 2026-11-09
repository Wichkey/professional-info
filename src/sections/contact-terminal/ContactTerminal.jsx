import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../build/motion';
import { CAPTCHA_STEP, CONFIRM_STEP, EMPTY_VALUES, FIELDS } from './fields';
import LogLine from './LogLine';
import NeonBackdrop from './NeonBackdrop';
import PromptInput from './PromptInput';
import { WEB3FORMS_KEY, loadCaptchaScript, openMailDraft, sendMessage } from './submit';
import './ContactTerminal.css';

const CAPTCHA_DONE = 'dmContactCaptchaDone';
const CAPTCHA_EXPIRED = 'dmContactCaptchaExpired';
// Keeps the progress bar from claiming 100% before the server has answered.
const PROGRESS_CAP = 0.9;

const isTouch = () => window.matchMedia?.('(pointer: coarse)').matches === true;

function previousStep(step) {
  const target = step - 1;
  return target === CAPTCHA_STEP && !WEB3FORMS_KEY ? target - 1 : target;
}

export default function ContactTerminal({ autoFocus = false, onClose, onSent }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('input');
  const [values, setValues] = useState(EMPTY_VALUES);
  const [log, setLog] = useState([]);
  const [captchaToken, setCaptchaToken] = useState(null);

  const nextId = useRef(0);
  const interacted = useRef(autoFocus);
  const inputRef = useRef(null);
  const captchaRef = useRef(null);
  const confirmRef = useRef(null);
  const botcheckRef = useRef(null);

  const push = useCallback((entry) => {
    const id = nextId.current++;
    setLog((current) => [...current, { id, ...entry }]);
    return id;
  }, []);

  const patch = useCallback((id, changes) => {
    setLog((current) => current.map((e) => (e.id === id ? { ...e, ...changes } : e)));
  }, []);

  const trimLogFrom = useCallback((fromStep) => {
    setLog((current) => current.filter((e) => e.step === undefined || e.step < fromStep));
  }, []);

  useEffect(loadCaptchaScript, []);

  useEffect(() => {
    if (!interacted.current) return;
    if (phase !== 'input') return;
    if (step < CAPTCHA_STEP) inputRef.current?.focus();
    else if (step === CAPTCHA_STEP) captchaRef.current?.focus({ preventScroll: true });
    else confirmRef.current?.focus();
  }, [step, phase]);

  const advanceFrom = useCallback(
    (from) => {
      let next = from + 1;
      if (next === CAPTCHA_STEP && !WEB3FORMS_KEY) next += 1;
      if (next === CAPTCHA_STEP && captchaToken) {
        push({ kind: 'field', step: CAPTCHA_STEP, prompt: 'verify:', value: 'human', status: 'ok' });
        next += 1;
      }
      setStep(next);
    },
    [captchaToken, push],
  );

  const goBack = useCallback(() => {
    if (step === 0) return;
    interacted.current = true;
    const target = previousStep(step);
    trimLogFrom(target);
    setStep(target);
  }, [step, trimLogFrom]);

  const commitField = useCallback(() => {
    interacted.current = true;
    const field = FIELDS[step];
    const value = values[field.key];
    const error = field.validate(value);
    if (error) {
      push({ kind: 'field', step, prompt: field.prompt, value, status: 'error' });
      push({ kind: 'error', step, text: error });
      return;
    }
    const skipped = field.optional && !value.trim();
    push({ kind: 'field', step, prompt: field.prompt, value: skipped ? '—' : value.trim(), status: skipped ? 'skip' : 'ok' });
    advanceFrom(step);
  }, [advanceFrom, push, step, values]);

  const commitCaptcha = useCallback(() => {
    push({ kind: 'field', step: CAPTCHA_STEP, prompt: 'verify:', value: 'human', status: 'ok' });
    setStep(CONFIRM_STEP);
  }, [push]);

  // hCaptcha calls these by name, so they are published on window and always
  // read the latest state through a ref.
  const latest = useRef({});
  latest.current = { step, commitCaptcha, push, trimLogFrom };
  useEffect(() => {
    window[CAPTCHA_DONE] = (token) => {
      setCaptchaToken(token);
      const { step: current, commitCaptcha: commit } = latest.current;
      if (current === CAPTCHA_STEP) commit();
    };
    window[CAPTCHA_EXPIRED] = () => {
      setCaptchaToken(null);
      const { step: current, push: add, trimLogFrom: trim } = latest.current;
      if (current === CONFIRM_STEP) {
        trim(CAPTCHA_STEP);
        add({ kind: 'error', step: CAPTCHA_STEP, text: 'the check expired, verify once more' });
        setStep(CAPTCHA_STEP);
      }
    };
    return () => {
      delete window[CAPTCHA_DONE];
      delete window[CAPTCHA_EXPIRED];
    };
  }, []);

  const send = useCallback(async () => {
    interacted.current = true;
    const fields = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    };

    if (!WEB3FORMS_KEY) {
      push({ kind: 'info', text: 'opening your mail app…' });
      openMailDraft(fields);
      return;
    }

    const token = window.hcaptcha?.getResponse?.() || captchaToken;
    if (!token) {
      trimLogFrom(CAPTCHA_STEP);
      push({ kind: 'error', step: CAPTCHA_STEP, text: 'please verify you are human first' });
      setStep(CAPTCHA_STEP);
      return;
    }

    const reduce = prefersReducedMotion();
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduce ? 0 : ms));
    setPhase('process');
    push({ kind: 'field', prompt: 'send message to daniel?', value: 'yes', status: 'ok' });

    const connect = push({ kind: 'process', text: 'connecting to mail relay…', status: 'pending' });
    await wait(500);
    patch(connect, { status: 'ok' });

    const sending = push({ kind: 'process', text: 'sending message', status: 'pending', progress: 0 });
    let progress = 0;
    const ticker = window.setInterval(() => {
      progress = Math.min(PROGRESS_CAP, progress + 0.07);
      patch(sending, { progress });
    }, 90);

    try {
      await Promise.all([
        sendMessage(fields, { captcha: token, botcheck: botcheckRef.current?.checked ?? false }),
        wait(1100),
      ]);
    } catch (error) {
      window.clearInterval(ticker);
      window.hcaptcha?.reset();
      setCaptchaToken(null);
      patch(sending, { status: 'fail' });
      push({ kind: 'error', text: `could not send (${error.message}). verify again and press enter to retry` });
      setPhase('input');
      setStep(CAPTCHA_STEP);
      return;
    }

    window.clearInterval(ticker);
    window.hcaptcha?.reset();
    patch(sending, { progress: 1, status: 'ok' });
    await wait(350);
    push({ kind: 'process', text: 'message delivered to daniel', status: 'ok', bright: true });
    await wait(350);
    push({ kind: 'process', text: 'answer expected within a day', status: 'ok' });
    await wait(450);
    push({ kind: 'process', text: 'closing session…', status: 'pending', bright: true });
    await wait(1100);
    setPhase('done');
    onSent(fields.name);
  }, [captchaToken, onSent, patch, push, trimLogFrom, values]);

  const onFieldKey = (e) => {
    if (e.nativeEvent.isComposing) return;
    const field = FIELDS[step];
    if (e.key === 'Enter') {
      if (field.multiline && (e.shiftKey || isTouch())) return;
      e.preventDefault();
      commitField();
    } else if (e.key === 'Backspace' && values[field.key] === '' && step > 0) {
      e.preventDefault();
      goBack();
    }
  };

  const onStepKey = (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      goBack();
    } else if (e.key === 'Enter' && step === CAPTCHA_STEP && captchaToken) {
      e.preventDefault();
      commitCaptcha();
    }
  };

  const focusCurrent = (e) => {
    if (phase !== 'input' || e.target.closest('button, a, .cterm__captcha')) return;
    interacted.current = true;
    if (step < CAPTCHA_STEP) inputRef.current?.focus();
    else if (step === CONFIRM_STEP) confirmRef.current?.focus();
  };

  const field = FIELDS[step];
  const armed = step === CONFIRM_STEP || phase !== 'input';

  return (
    <div className={`cterm-stage${armed ? ' is-armed' : ''}`}>
      <NeonBackdrop />
      {/* Clicks only forward focus to the real input; keyboard users reach it directly. */}
      <div className="cterm" onClick={focusCurrent}>
        <div className="cterm__head">
          <span className={`cterm__dot${phase === 'input' ? '' : ' is-busy'}`} />
          <span>daniel-mehler.com · contact</span>
          {onClose ? (
            <button type="button" className="cterm__close" onClick={onClose}>
              esc close
              <span className="cterm__close-glyph" aria-hidden="true">
                ×
              </span>
              <span className="visually-hidden">Close the contact terminal</span>
            </button>
          ) : (
            <span className="cterm__head-aside">{phase === 'input' ? 'session open' : 'sending'}</span>
          )}
        </div>

        <ol className="cterm__log" role="log" aria-live="polite" aria-label="Contact terminal">
          {log.map((entry) => (
            <LogLine key={entry.id} entry={entry} />
          ))}
        </ol>

        {phase === 'input' && field && (
          <PromptInput
            key={field.key}
            ref={inputRef}
            field={field}
            value={values[field.key]}
            onChange={(v) => setValues((current) => ({ ...current, [field.key]: v }))}
            onKeyDown={onFieldKey}
            onSubmit={commitField}
            onBack={goBack}
            canGoBack={step > 0}
          />
        )}

        {phase === 'input' && step === CAPTCHA_STEP && (
          <div className="cterm__step" ref={captchaRef} tabIndex={-1} onKeyDown={onStepKey}>
            <p className="cterm__prompt-label">
              <span aria-hidden="true">&gt; </span>verify: {captchaToken ? 'done, press enter' : 'one quick check that you are human'}
            </p>
            <div className="cterm__touch cterm__touch--left">
              <button type="button" className="cterm__key cterm__key--ghost" onClick={goBack}>
                back
              </button>
              {captchaToken && (
                <button type="button" className="cterm__key" onClick={commitCaptcha}>
                  return <span aria-hidden="true">↵</span>
                </button>
              )}
            </div>
          </div>
        )}

        {WEB3FORMS_KEY && (
          <div className={`cterm__captcha${phase === 'input' && step === CAPTCHA_STEP ? '' : ' is-hidden'}`}>
            <div
              className="h-captcha"
              data-captcha="true"
              data-theme="dark"
              data-callback={CAPTCHA_DONE}
              data-expired-callback={CAPTCHA_EXPIRED}
            />
          </div>
        )}

        {phase === 'input' && step === CONFIRM_STEP && (
          <div className="cterm__step cterm__confirm">
            <p className="cterm__prompt-label cterm__prompt-label--bright">
              <span aria-hidden="true">&gt; </span>send message to daniel? <span className="cterm__dim">[enter]</span>
            </p>
            <div className="cterm__confirm-keys">
              <button ref={confirmRef} type="button" className="cterm__enter" onClick={send} onKeyDown={onStepKey}>
                <span className="cterm__enter-label">enter</span>
                <span className="cterm__enter-glyph" aria-hidden="true">
                  ↵
                </span>
                <span className="visually-hidden">Send message to Daniel</span>
              </button>
              <button type="button" className="cterm__key cterm__key--ghost" onClick={goBack}>
                back
              </button>
            </div>
          </div>
        )}

        <p className={`cterm__hint${phase === 'input' ? '' : ' is-hidden'}`} aria-hidden="true">
          <span className="cterm__hint-keys">
            {step === CONFIRM_STEP
              ? 'enter sends · backspace goes back'
              : step === CAPTCHA_STEP
                ? 'solve the check · backspace goes back'
                : field?.multiline
                  ? 'enter to continue · shift+enter for a new line · backspace on an empty line goes back'
                  : 'enter to continue · backspace on an empty line goes back'}
          </span>
          <span className="cterm__hint-touch">tap return to continue · back edits the line before</span>
        </p>

        <input
          ref={botcheckRef}
          type="checkbox"
          name="botcheck"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
