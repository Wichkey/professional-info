import { useEffect, useRef } from 'react';
import oldSite from '../assets/old-site.webp';
import oldSitePhone from '../assets/old-site-phone.webp';
import oldSitePhone2x from '../assets/old-site-phone-2x.webp';

// intro.css picks the desktop or the phone capture of the old site per screen width.
const OLD_SITE_VARS = {
  '--old-site': `url(${oldSite})`,
  '--old-site-phone': `-webkit-image-set(url(${oldSitePhone}) 1x, url(${oldSitePhone2x}) 2x)`,
};

// Pixel sizes of the captures above (the top four screens of the old page).
const DESKTOP_ASPECT = 3600 / 1440;
const PHONE_ASPECT = 3376 / 390;
const PHONE_QUERY = '(max-width: 560px)';
const EASE = 0.22;

// Scrolling during the old-site phase pans the capture instead of the page; every
// glitch layer reads the same --old-y so the bursts stay aligned with it.
function useOldSiteScroll(nodeRef, scrollRef) {
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;
    let target = 0;
    let current = 0;
    let frame = 0;

    const maxY = () => {
      const aspect = window.matchMedia(PHONE_QUERY).matches ? PHONE_ASPECT : DESKTOP_ASPECT;
      return Math.max(0, node.clientWidth * aspect - node.clientHeight);
    };
    const paint = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) current = target;
      node.style.setProperty('--old-y', `${current.toFixed(1)}px`);
      frame = current === target ? 0 : requestAnimationFrame(paint);
    };

    scrollRef.current = {
      by(dy) {
        target = Math.min(maxY(), Math.max(0, target + dy));
        if (!frame) frame = requestAnimationFrame(paint);
      },
    };
    return () => {
      scrollRef.current = null;
      cancelAnimationFrame(frame);
    };
  }, [nodeRef, scrollRef]);
}

// Per burst: horizontal bands of the old site as [top %, height %, shift px, flickers].
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

// Displaced bands of the old site that stay torn during the calm after a burst.
const RESIDUE = [
  [],
  [[57, 2, 0]],
  [[27, 3, 6], [63, 2, -4]],
  [[30, 4, 10], [55, 5, -8], [72, 2, 4]],
];

export default function OldSite({ burst, done, scrollRef }) {
  const ref = useRef(null);
  useOldSiteScroll(ref, scrollRef);
  const level = burst || 0;
  const bands = level ? BANDS[level - 1] : [];
  const residue = level ? [] : RESIDUE[Math.min(done, RESIDUE.length - 1)];

  return (
    <div ref={ref} className={`intro-old${level ? ` is-burst is-burst-${level}` : ''}`} style={OLD_SITE_VARS}>
      <div className="intro-old__roll" key={level}>
        <div className="intro-old__base" />
        {level > 0 && (
          <>
            <div className="intro-old__rgb intro-old__rgb--a" />
            <div className="intro-old__rgb intro-old__rgb--b" />
            {bands.map(([top, height, shift, flickers], i) => (
              <div
                key={top}
                className={`intro-old__slice${flickers ? ' intro-old__slice--flicker' : ''}`}
                style={{
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
            style={{ clipPath: `inset(${top}% 0 ${100 - top - height}% 0)`, transform: `translateX(${shift}px)` }}
          />
        ))}
      </div>
      <div className={`glitch-scan${level ? ' is-burst' : ''}`} />
      {level > 0 && <div className="glitch-noise" />}
    </div>
  );
}
