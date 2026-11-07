/** The hero's spotlight and thin light beams, drawn behind the contact terminal. */
export default function NeonBackdrop() {
  return (
    <div className="cterm-neon" aria-hidden="true">
      <span className="cterm-neon__glow cterm-neon__glow--outer" />
      <span className="cterm-neon__glow cterm-neon__glow--core" />
      <svg className="cterm-neon__beams" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cterm-beam" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
            <stop offset="0" stopColor="#e9dde4" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e9dde4" stopOpacity="0.6" />
            <stop offset="1" stopColor="#e9dde4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="140" x2="1440" y2="760" stroke="url(#cterm-beam)" vectorEffect="non-scaling-stroke" />
        <line x1="1440" y1="180" x2="0" y2="700" stroke="url(#cterm-beam)" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="452" x2="1440" y2="452" stroke="url(#cterm-beam)" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
