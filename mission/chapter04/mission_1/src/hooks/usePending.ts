import { useState } from 'react';

function usePending(initialValue: boolean = false) {
  const [isPending, setIsPending] = useState(initialValue);

  return [isPending, setIsPending] as const;
}

export default usePending;