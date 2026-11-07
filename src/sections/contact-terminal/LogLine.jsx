const BLOCKS = 8;

const STATUS_TEXT = { ok: 'ok', skip: 'skip', error: '!', fail: 'failed' };

function Progress({ value }) {
  const filled = Math.round(value * BLOCKS);
  return (
    <span className="cterm__progress">
      {' '}
      {'█'.repeat(filled)}
      <span className="cterm__progress-empty">{'░'.repeat(BLOCKS - filled)}</span>
      <span className="cterm__pct">{Math.round(value * 100)}%</span>
    </span>
  );
}

export default function LogLine({ entry }) {
  if (entry.kind === 'error') {
    return <li className="cterm__line cterm__line--error">{entry.text}</li>;
  }
  if (entry.kind === 'info') {
    return <li className="cterm__line cterm__line--info">{entry.text}</li>;
  }

  const pending = entry.status === 'pending';
  return (
    <li className={`cterm__line${entry.bright ? ' is-bright' : ''}`}>
      <span className="cterm__text">
        <span aria-hidden="true">&gt; </span>
        {entry.kind === 'field' ? (
          <>
            {entry.prompt} <span className="cterm__value">{entry.value}</span>
          </>
        ) : (
          entry.text
        )}
        {entry.progress !== undefined && <Progress value={entry.progress} />}
        {pending && entry.progress === undefined && <span className="cterm__caret" aria-hidden="true" />}
      </span>
      {!pending && <span className={`cterm__status is-${entry.status}`}>{STATUS_TEXT[entry.status]}</span>}
    </li>
  );
}
