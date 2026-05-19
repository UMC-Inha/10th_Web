import { createContext, useContext } from 'react';
import type { useLpForm } from '../../hooks/useLpForm';

type LpFormContextValue = ReturnType<typeof useLpForm>;

const LpFormContext = createContext<LpFormContextValue | null>(null);

type LpFormProviderProps = {
  value: LpFormContextValue;
  children: React.ReactNode;
};

export function LpFormProvider({ value, children }: LpFormProviderProps) {
  return <LpFormContext.Provider value={value}>{children}</LpFormContext.Provider>;
}

export function useLpFormContext() {
  const ctx = useContext(LpFormContext);
  if (!ctx) throw new Error('useLpFormContext는 LpFormProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
