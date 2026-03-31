/*
  App.tsx
  [컴포넌트 트리]
  App
  └── TodoProvider  (Context 공급 — 전역 상태 보유)
      └── Todo      (레이아웃 컨테이너)
          ├── TodoInput   (할 일 입력)
          └── TodoSection (할 일 / 완료 목록)
              └── TodoItem (개별 항목)
 */

import Todo from "./components/Todo";
import { TodoProvider } from "./context/TodoContext";
import "./index.css";

export default function App() {
  return (
    //  Provider 바깥 컴포넌트는 Context에 접근할 수 없다.
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}
