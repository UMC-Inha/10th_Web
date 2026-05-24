import { useCallback, useEffect, useState } from 'react';

/**
 * 사이드바 열림/닫힘 상태와 관련 유틸리티 함수를 제공하는 커스텀 훅
 *
 * - open()   : 사이드바 열기
 * - close()  : 사이드바 닫기
 * - toggle() : 현재 상태 반전
 * - ESC 키 입력 시 자동으로 닫힘
 * - 사이드바가 열리면 body 스크롤을 막아 배경 콘텐츠가 스크롤되지 않음
 */
function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // 사이드바 열림 시 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}

export default useSidebar;
