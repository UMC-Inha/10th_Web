import type { MouseEvent } from 'react'; // 마우스 클릭시
import type { LinkProps } from './types';
import { getCurrentPath, navigateTo } from './utils'; //getCurrentPath: 현재 주소를 확인

// to: 목적지, children : 글자
export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // 현재 내가 있는 주소와 목적지 주소가 같으면 아무일 하지 않음
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};