import { useContext } from "react";
import { RouterContext } from "./RouterContext";

// Provider 외부에서 사용 시 에러를 던져 잘못된 사용을 방지
function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

export default useRouter;
