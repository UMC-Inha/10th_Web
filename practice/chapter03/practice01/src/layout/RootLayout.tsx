import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// Outlet을 사용하여 하위 라우트의 콘텐츠를 렌더링
const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
