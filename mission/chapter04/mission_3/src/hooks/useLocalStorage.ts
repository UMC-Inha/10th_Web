import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬스토리지에서 값을 가져오는 함수
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 저장된 값이 있으면 파싱해서 반환, 없으면 초기값 반환
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 값을 저장하는 함수
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;