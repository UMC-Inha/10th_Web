import { NavLink } from "react-router-dom";

interface NavItemProps {
  url: string;
  children: React.ReactNode;
}

// 네비게이션 아이템 컴포넌트
const NavItem = ({ url, children }: NavItemProps) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        isActive
          ? "text-white font-semibold border-b-2 border-blue-400 pb-1 transition-colors"
          : "text-gray-400 hover:text-white pb-1 transition-colors"
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;
