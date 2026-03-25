import clsx from 'clsx';
import { useTheme, THEME } from './ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav className={clsx(
      'p-4 w-full flex justify-end transition-colors duration-300', 
      isLightMode ? 'bg-white' : 'bg-black' 
    )}>
      <ThemeToggleButton />
    </nav>
  );
}