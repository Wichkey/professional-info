import { forwardRef, useState } from 'react';

/**
 * A real labelled input drawn as terminal text: the field itself is invisible
 * and laid over a mirror that shows the value with a block caret.
 */
const PromptInput = forwardRef(function PromptInput({ field, value, onChange, onKeyDown, onSubmit, onBack, canGoBack }, ref) {
  const [caret, setCaret] = useState(value.length);
  const [focused, setFocused] = useState(false);
  const id = `cterm-${field.key}`;
  const Tag = field.multiline ? 'textarea' : 'input';

  const syncCaret = (e) => setCaret(e.currentTarget.selectionStart ?? e.currentTarget.value.length);
  const at = Math.min(caret, value.length);

  return (
    <div className="cterm__prompt">
      <div className={`cterm__prompt-line${field.multiline ? ' is-multiline' : ''}`}>
        <label className="cterm__prompt-label" htmlFor={id}>
          <span aria-hidden="true">&gt; </span>
          {field.prompt}
          <span className="visually-hidden"> {field.label}</span>
        </label>
        <span className="cterm__field">
          <span className="cterm__mirror" aria-hidden="true">
            {value.slice(0, at)}
            <span className={`cterm__caret${focused ? '' : ' is-idle'}`} />
            {value.slice(at)}
          </span>
          <Tag
            ref={ref}
            id={id}
            className="cterm__input"
            name={field.key}
            type={field.multiline ? undefined : field.type}
            inputMode={field.inputMode}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength}
            required={!field.optional}
            rows={field.multiline ? 1 : undefined}
            enterKeyHint={field.multiline ? 'enter' : 'next'}
            autoCapitalize={field.type === 'email' ? 'none' : undefined}
            spellCheck={field.multiline ? undefined : false}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              syncCaret(e);
            }}
            onSelect={syncCaret}
            onKeyUp={syncCaret}
            onFocus={(e) => {
              setFocused(true);
              syncCaret(e);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
          />
        </span>
      </div>
      <div className="cterm__touch">
        {canGoBack && (
          <button type="button" className="cterm__key cterm__key--ghost" onClick={onBack}>
            back
          </button>
        )}
        <button type="button" className="cterm__key" onClick={onSubmit}>
          return <span aria-hidden="true">↵</span>
        </button>
      </div>
    </div>
  );
});

export default PromptInput;
