import { createContext, useContext, useState, type ReactNode } from "react";

interface CounterContextType {
  count: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

// Context 생성 (초기값: undefined)
// undefined: Provider로 감싸지 않은 곳에서 실수로 useContext를 호출했을 경우 타입 단계에서 경고
export const CounterContext = createContext<CounterContextType | undefined>(
  undefined,
);

// Context Provider 생성
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => prev - 1);

  return (
    <CounterContext.Provider
      value={{ count, handleIncrement, handleDecrement }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export const useCount = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
      "useCount는 반드시 CountProvider 내부에서 사용되어야 합니다.",
    );
  }
  return context;
};
