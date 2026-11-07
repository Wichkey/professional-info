import { useLayoutEffect } from 'react';
import { useBuildEnabled } from './BuildContext';
import { runBuild } from './runBuild';

/** Builds the scope once, the first time it scrolls into view. */
export function useBuildOnView(ref) {
  const enabled = useBuildEnabled();

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!enabled || !scope) return undefined;

    scope.classList.add('is-pending');
    let stop = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        stop = runBuild(scope);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(scope);

    return () => {
      observer.disconnect();
      stop?.();
      scope.classList.remove('is-pending');
    };
  }, [enabled, ref]);
}
