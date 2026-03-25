import { useTheme } from './ThemeProvider';
export default function ThemeContent() {
  const { theme } = useTheme();
  const isLightMode = theme === 'LIGHT';
  return <div>ThemeContent</div>;
}
