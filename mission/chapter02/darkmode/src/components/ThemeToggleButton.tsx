import clsx from "clsx";
import { THEME } from "../context/ThemeContext";
import { useTheme } from "../context/useTheme";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;
  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 rounded-md mt-4 transition-all font-semibold",
        isLightMode ? "text-black" : "text-amber-400",
      )}
    >
      {isLightMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
    </button>
  );
}

export default ThemeToggleButton;
