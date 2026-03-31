import clsx from 'clsx';
import { useTheme, THEME } from './ThemeProvider';

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className={clsx(
      'p-8 m-4 rounded-lg shadow-md transition-all duration-300',
      isLightMode 
        ? 'bg-gray-50 text-gray-800'
        : 'bg-gray-700 text-gray-100' 
    )}>
      <h2 className="text-xl font-bold mb-4">내용 영역 (ThemeContent)</h2>
    </div>
  );
}