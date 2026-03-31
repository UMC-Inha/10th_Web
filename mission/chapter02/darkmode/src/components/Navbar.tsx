import clsx from "clsx";
import { THEME } from "../context/ThemeContext";
import { useTheme } from "../context/useTheme";
import ThemeToggleButton from "./ThemeToggleButton";

function Navbar() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav
      className={clsx(
        "p-4 w-full flex justify-end",
        isLightMode ? "bg-white" : "bg-gray-800",
      )}
    >
      <ThemeToggleButton />
    </nav>
  );
}

export default Navbar;
