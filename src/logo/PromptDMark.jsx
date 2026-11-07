import './PromptDMark.css';

export default function PromptDMark({ size = 28, className = '' }) {
  return (
    <svg
      className={`prompt-d ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="7" width="3.5" height="18" className="prompt-d__ink" />
      <path d="M11.5 7H16L25 16L16 25H11.5L20.5 16Z" className="prompt-d__ink" />
      <rect x="21" y="21.5" width="5" height="3.5" className="prompt-d__cursor" />
    </svg>
  );
}
