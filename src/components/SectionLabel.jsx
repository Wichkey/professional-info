import './SectionLabel.css';

export default function SectionLabel({ label, aside, dot = false }) {
  return (
    <div className="section-label" data-build={`label · ${label.toLowerCase()}`} data-build-kind="text">
      <span className="section-label__tab">{label}</span>
      <span className="section-label__line" aria-hidden="true" />
      <span className="section-label__aside">
        {dot && <span className="section-label__dot" aria-hidden="true" />}
        {aside}
      </span>
    </div>
  );
}
