import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === 'LIGHT';
  return (
    <nav className={clsx(
      'p-4 w-full flex justify-end',
      isLightMode ? 'background-color white' : 'bg-black';
    )}>
      <ThemeToggleButton />
    </nav>
  );
}
