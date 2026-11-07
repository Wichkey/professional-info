import { LINES, lineState } from './timeline';

const BLOCKS = 8;

function ProgressBar({ value }) {
  const filled = Math.round(value * BLOCKS);
  return (
    <span className="term__progress">
      {' '}
      {'█'.repeat(filled)}
      <span className="term__progress-empty">{'░'.repeat(BLOCKS - filled)}</span>
      <span className="term__pct">{Math.round(value * 100)}%</span>
    </span>
  );
}

export default function Terminal({ t, dimmed }) {
  return (
    <div className={`term${dimmed ? ' is-dimmed' : ''}`}>
      <ol className="term__lines">
        {LINES.map((line) => {
          const s = lineState(line, t);
          if (!s.visible) return null;
          return (
            <li key={line.stamp} className={`term__line${line.signoff ? ' term__line--signoff' : ''}`}>
              <span className="term__stamp">{line.stamp}</span>
              <span className={`term__text${line.caret ? ' term__text--bright' : ''}`}>
                {s.shownText}
                {s.shownStrong && <span className="term__strong">{s.shownStrong}</span>}
                {s.progress !== null && <ProgressBar value={s.progress} />}
                {s.caret && <span className="term__caret" />}
              </span>
              {s.ok && <span className="term__ok">ok</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
