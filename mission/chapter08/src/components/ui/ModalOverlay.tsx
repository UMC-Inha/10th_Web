import { useEffect, useRef, type ReactNode } from 'react';
import { Z_INDEX } from '../../constants/zIndex';

type ModalOverlayProps = {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ModalOverlay({ onClose, children, className = '', labelledBy }: ModalOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const previousActive = document.activeElement as HTMLElement | null;

    const getFocusableElements = () =>
      Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusFirst = () => {
      const focusable = getFocusableElements();
      focusable[0]?.focus();
    };

    focusFirst();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActive?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className={`fixed inset-0 ${Z_INDEX.modal} flex items-center justify-center bg-black/70 px-4 ${className}`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
}

export default ModalOverlay;
