import { useTheme } from '../theme/ThemeContext';
import oldSite from '../assets/old-site.webp';
import newBlue from '../assets/intro-new-blue.webp';
import newPink from '../assets/intro-new-pink.webp';

const NEW_SITE = { blue: newBlue, pink: newPink };

// Per burst: horizontal bands as [top %, height %, shift px, shows new site].
const BANDS = [
  [
    [22, 4, -18, false],
    [57, 6, 26, true],
    [81, 3, -12, false],
  ],
  [
    [8, 5, 34, false],
    [27, 7, -40, true],
    [49, 3, 22, false],
    [63, 9, -28, true],
    [88, 4, 46, false],
  ],
  [
    [4, 8, -52, true],
    [17, 4, 38, false],
    [30, 11, 60, true],
    [46, 5, -34, false],
    [55, 12, -70, true],
    [72, 6, 44, true],
    [86, 7, -58, false],
  ],
  [
    [0, 13, 80, true],
    [14, 6, -64, false],
    [21, 16, -96, true],
    [38, 5, 72, false],
    [44, 18, 110, true],
    [63, 6, -88, false],
    [70, 14, -60, true],
    [85, 9, 92, true],
    [95, 5, -40, true],
  ],
];

// Fragments of the new site that stay visible during the calm after a burst.
const RESIDUE = [
  [],
  [[57, 2, 0]],
  [[27, 3, 6], [63, 2, -4]],
  [[30, 4, 10], [55, 5, -8], [72, 2, 4]],
];

export default function OldSite({ burst, done }) {
  const { theme } = useTheme();
  const oldBg = { backgroundImage: `url(${oldSite})` };
  const newBg = { backgroundImage: `url(${NEW_SITE[theme] ?? newBlue})` };
  const level = burst || 0;
  const bands = level ? BANDS[level - 1] : [];
  const residue = level ? [] : RESIDUE[Math.min(done, RESIDUE.length - 1)];

  return (
    <div className={`intro-old${level ? ` is-burst is-burst-${level}` : ''}`}>
      <div className="intro-old__roll" key={level}>
        <div className="intro-old__base" style={oldBg} />
        {level > 0 && (
          <>
            <div className="intro-old__rgb intro-old__rgb--a" style={oldBg} />
            <div className="intro-old__rgb intro-old__rgb--b" style={oldBg} />
            {bands.map(([top, height, shift, isNew], i) => (
              <div
                key={top}
                className={`intro-old__slice${isNew ? ' intro-old__slice--new' : ''}`}
                style={{
                  ...(isNew ? newBg : oldBg),
                  clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`,
                  '--shift': `${shift}px`,
                  animationDelay: `${i * 29}ms`,
                }}
              />
            ))}
          </>
        )}
        {residue.map(([top, height, shift]) => (
          <div
            key={top}
            className="intro-old__residue"
            style={{ ...newBg, clipPath: `inset(${top}% 0 ${100 - top - height}% 0)`, transform: `translateX(${shift}px)` }}
          />
        ))}
      </div>
      <div className="intro-old__scan" />
      {level > 0 && <div className="intro-old__noise" />}
    </div>
  );
}
