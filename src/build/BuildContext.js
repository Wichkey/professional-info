import { createContext, useContext } from 'react';

export const BuildContext = createContext({ enabled: false });

export function useBuildEnabled() {
  return useContext(BuildContext).enabled;
}
