import { useRef, type ReactNode } from 'react';

type ModalOverlayProps = {
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

function ModalOverlay({ onClose, children, className = '' }: ModalOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 ${className}`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
}

export default ModalOverlay;
