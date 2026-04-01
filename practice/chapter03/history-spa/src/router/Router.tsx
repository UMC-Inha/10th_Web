import { useEffect } from "react";
import useRouter from "./useRouter";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import UserPage from "../pages/UserPage";
import FirstPage from "../pages/about/FirstPage";
import SecondPage from "../pages/about/SecondPage";

// 렌더링마다 재생성되지 않도록 컴포넌트 외부에 선언
// 구체적인 경로를 앞에 두어야 함 (/about/first가 /about보다 먼저)
const routes = [
  { path: "/", component: HomePage },
  { path: "/about/first", component: FirstPage },
  { path: "/about/second", component: SecondPage },
  { path: "/about", component: AboutPage },
];

// /user/:id는 동적 경로라 routes 배열 대신 startsWith로 별도 처리
function matchRoute(path: string): React.ReactNode | null {
  const route = routes.find((route) => route.path === path);
  if (route) return <route.component />;
  if (path.startsWith("/user/")) return <UserPage />;
  return null;
}

function Router() {
  const { currentPath, navigate } = useRouter();
  const matched = matchRoute(currentPath);

  // 매칭되는 경로가 없으면 홈으로 리다이렉트
  // matched는 JSX라 렌더링마다 새 참조 생성 → 불필요한 effect 실행 방지를 위해 deps 제외
  useEffect(() => {
    if (!matched) navigate("/");
  }, [currentPath, navigate]);

  return matched ?? <HomePage />;
}

export default Router;
