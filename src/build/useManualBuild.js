import { useEffect, useLayoutEffect } from 'react';
import { useBuildEnabled } from './BuildContext';
import { runBuild } from './runBuild';

/**
 * Keeps the scope hidden until `start` is set, then builds it once.
 * `start` is null while waiting, or `{ origin, speed }`.
 */
export function useManualBuild(ref, start) {
  const enabled = useBuildEnabled();

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!enabled || !scope) return undefined;
    scope.classList.add('is-pending');
    return () => scope.classList.remove('is-pending');
  }, [enabled, ref]);

  useEffect(() => {
    const scope = ref.current;
    if (!enabled || !scope || !start) return undefined;
    const stop = runBuild(scope, { speed: start.speed ?? 1, origin: start.origin ?? null });
    return stop;
  }, [enabled, ref, start]);
}
