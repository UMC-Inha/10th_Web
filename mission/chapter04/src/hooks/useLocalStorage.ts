import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    window.localStorage.removeItem(key);
  }, [initialValue, key]);

  return {
    storedValue,
    setValue,
    removeValue,
  };
}
