import { THEME } from "../context/ThemeContext";
import { useTheme } from "../context/useTheme";
import clsx from "clsx";

function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;
  return (
    <div
      className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-gray-800")}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-black" : "text-white",
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        dolorum, harum nostrum quod numquam minima adipisci vitae, non animi
        consequuntur libero possimus deleniti veritatis accusantium laboriosam
        rerum quas cupiditate ratione.
      </p>
    </div>
  );
}

export default ThemeContent;
