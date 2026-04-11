import { useState } from "react";

function useToggle(initial: boolean = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const toggle = () => setIsOpen((prev) => !prev);

  return [isOpen, toggle] as const;
}

export default useToggle;