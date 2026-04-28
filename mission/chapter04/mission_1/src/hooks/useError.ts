import { useState } from 'react';

function useError(initialValue: boolean = false) {
  const [isError, setIsError] = useState(initialValue);

  return [isError, setIsError] as const;
}

export default useError;