import { useState, useCallback, useEffect } from 'react';

function isCompatibleWithSchema<T>(parsed: unknown, schema: T): boolean {
  if (schema === null || typeof schema !== 'object') return true;
  if (parsed === null || typeof parsed !== 'object') return false;
  return Object.keys(schema as object).every(k => k in (parsed as object));
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);
      return isCompatibleWithSchema(parsedItem, initialValue) ? (parsedItem as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`useLocalStorage: '${key}' 저장 실패`);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch {
      console.error(`useLocalStorage: '${key}' 삭제 실패`);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (event.newValue === null) {
        setStoredValue(initialValue);
      } else {
        try {
          const parsed = JSON.parse(event.newValue);
          setStoredValue(isCompatibleWithSchema(parsed, initialValue) ? (parsed as T) : initialValue);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;
