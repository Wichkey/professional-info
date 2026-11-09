import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../build/motion';
import { CONFIRM_STEP, EMPTY_VALUES, FIELDS } from './fields';
import LogLine from './LogLine';
import PromptInput from './PromptInput';
import { WEB3FORMS_KEY, loadCaptchaScript, openMailDraft, renderCaptcha, sendMessage, solveCaptcha } from './submit';
import './ContactTerminal.css';

// Keeps the progress bar from claiming 100% before the server has answered.
const PROGRESS_CAP = 0.9;

const isTouch = () => window.matchMedia?.('(pointer: coarse)').matches === true;

export default function ContactTerminal({ autoFocus = false, onClose, onSent }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('input');
  const [values, setValues] = useState(EMPTY_VALUES);
  const [log, setLog] = useState([]);

  const nextId = useRef(0);
  const interacted = useRef(autoFocus);
  const inputRef = useRef(null);
  const captchaIdRef = useRef(null);
  const captchaHostRef = useRef(null);
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

  useEffect(() => {
    loadCaptchaScript();
    return renderCaptcha(captchaHostRef.current, (id) => {
      captchaIdRef.current = id;
    });
  }, []);

  useEffect(() => {
    if (!interacted.current) return;
    if (phase !== 'input') return;
    if (step < CONFIRM_STEP) inputRef.current?.focus();
    else confirmRef.current?.focus();
  }, [step, phase]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    interacted.current = true;
    const target = step - 1;
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
    setStep(step + 1);
  }, [push, step, values]);

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

    const reduce = prefersReducedMotion();
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduce ? 0 : ms));
    setPhase('process');
    // The whole sequence belongs to the confirm step, so stepping back past it takes a
    // failed attempt out of the log.
    const trace = (entry) => push({ step: CONFIRM_STEP, ...entry });
    trace({ kind: 'field', prompt: 'send message to daniel?', value: 'yes', status: 'ok' });

    // hCaptcha only draws its own challenge overlay when it decides to challenge.
    const verifying = trace({ kind: 'process', text: 'verifying you are human…', status: 'pending' });
    let token;
    try {
      token = await solveCaptcha(captchaIdRef.current);
    } catch (error) {
      window.hcaptcha?.reset(captchaIdRef.current);
      patch(verifying, { status: 'fail' });
      trace({ kind: 'error', text: `could not verify you are human (${error.message}). press enter to try again` });
      setPhase('input');
      return;
    }
    patch(verifying, { status: 'ok' });
    await wait(250);

    const connect = trace({ kind: 'process', text: 'connecting to mail relay…', status: 'pending' });
    await wait(500);
    patch(connect, { status: 'ok' });

    const sending = trace({ kind: 'process', text: 'sending message', status: 'pending', progress: 0 });
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
      window.hcaptcha?.reset(captchaIdRef.current);
      patch(sending, { status: 'fail' });
      trace({ kind: 'error', text: `could not send (${error.message}). press enter to retry` });
      setPhase('input');
      return;
    }

    window.clearInterval(ticker);
    window.hcaptcha?.reset(captchaIdRef.current);
    patch(sending, { progress: 1, status: 'ok' });
    await wait(350);
    trace({ kind: 'process', text: 'message delivered to daniel', status: 'ok', bright: true });
    await wait(350);
    trace({ kind: 'process', text: 'answer expected within a day', status: 'ok' });
    await wait(450);
    trace({ kind: 'process', text: 'closing session…', status: 'pending', bright: true });
    await wait(1100);
    setPhase('done');
    onSent(fields.name);
  }, [onSent, patch, push, values]);

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
    if (e.key !== 'Backspace') return;
    e.preventDefault();
    goBack();
  };

  const focusCurrent = (e) => {
    if (phase !== 'input' || e.target.closest('button, a')) return;
    interacted.current = true;
    if (step < CONFIRM_STEP) inputRef.current?.focus();
    else confirmRef.current?.focus();
  };

  const field = FIELDS[step];

  return (
    /* Clicks only forward focus to the real input; keyboard users reach it directly. */
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

      <p className="cterm__brief">
        <span aria-hidden="true">&gt; </span>please type in the following information
      </p>

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

      {WEB3FORMS_KEY && <div ref={captchaHostRef} className="cterm__captcha" aria-hidden="true" />}

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
  );
}
