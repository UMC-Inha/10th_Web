import { createContext, useEffect, useState } from "react";
import navigate from "./navigate";

type RouterContextType = {
  currentPath: string;
  state: object | null;
  navigate: (url: string, replace?: boolean, state?: object) => void;
};

// null: Provider 없이 사용 시 useRouter에서 명확한 에러를 던지기 위함
const RouterContext = createContext<RouterContextType | null>(null);

function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname,
  );
  const [state, setState] = useState<object | null>(
    window.history.state ?? null,
  );

  useEffect(() => {
    // useEffect 안에서만 쓰이므로 내부에 선언
    const handlePopstate = () => {
      // popstate 이벤트 발생 시 현재 URL과 state 업데이트 (뒤로/앞으로 가기 대응)
      setCurrentPath(window.location.pathname);
      setState(window.history.state ?? null);
    };

    // popstate: 뒤로/앞으로 가기 또는 navigate에서 수동 dispatch 시 발생
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate); // 메모리 누수 방지
    };
  }, []);

  return (
    <RouterContext.Provider value={{ navigate, currentPath, state }}>
      {children}
    </RouterContext.Provider>
  );
}

export { RouterProvider, RouterContext };
