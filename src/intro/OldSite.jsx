import oldSite from '../assets/old-site.webp';

const SLICES = [
  [0, 78],
  [18, 64],
  [31, 57],
  [46, 41],
  [63, 27],
  [80, 9],
];

export default function OldSite({ glitching }) {
  const bg = { backgroundImage: `url(${oldSite})` };

  return (
    <div className={`intro-old${glitching ? ' is-glitching' : ''}`}>
      <div className="intro-old__roll">
        <div className="intro-old__base" style={bg} />
        {glitching && (
          <>
            <div className="intro-old__rgb intro-old__rgb--a" style={bg} />
            <div className="intro-old__rgb intro-old__rgb--b" style={bg} />
            {SLICES.map(([top, bottom], i) => (
              <div
                key={top}
                className="intro-old__slice"
                style={{ ...bg, clipPath: `inset(${top}% 0 ${bottom}% 0)`, animationDelay: `${i * 37}ms` }}
              />
            ))}
          </>
        )}
      </div>
      <div className="intro-old__scan" />
      {glitching && <div className="intro-old__noise" />}
    </div>
  );
}
