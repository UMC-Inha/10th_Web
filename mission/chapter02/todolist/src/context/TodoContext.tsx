/*
  TodoContext.tsx
 
  [localStorage]
  페이지를 새로고침해도 todos 데이터가 유지되도록
  useState 초기값에서 localStorage를 읽고, todos 변경 시마다 useEffect로 저장
 
  [useCallback + useMemo]
  - useCallback: 함수가 매 렌더마다 새로 생성되지 않도록 메모이제이션
  - useMemo: Context value 객체가 매 렌더마다 새로 생성되어 불필요한 하위 컴포넌트 리렌더링이 발생하는 것을 방지
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Todo } from "../types/todo";

// localStorage에 todos를 저장할 때 사용하는 키
const STORAGE_KEY = "todos";

// Context로 공유할 값의 타입 정의
interface TodoContextType {
  todos: Todo[]; // 전체 할 일 목록
  addTodo: (text: string) => void; // 새로운 할 일 추가
  completeTodo: (id: string) => void; // 특정 할 일을 완료 상태로 변경
  deleteTodo: (id: string) => void; // 특정 할 일 삭제
}

/*
 TodoContext 정의
 초기값을 undefined로 설정해 Provider 없이 사용하면 에러가 발생하도록 한다.
*/
const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

// TodoProvider 정의
export function TodoProvider({ children }: TodoProviderProps) {
  /*
   todos 상태
   lazy initializer 사용: 컴포넌트 마운트 시 딱 한 번만 localStorage를 읽는다. 이후 렌더에서는 실행되지 않는다.
  */
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // 저장된 값이 있으면 파싱해서 반환, 없으면 빈 배열로 시작
      return stored ? (JSON.parse(stored) as Todo[]) : [];
    } catch {
      // JSON 파싱 실패 시 빈 배열
      return [];
    }
  });

  // todos가 변경될 때마다 localStorage에 저장 -> 새로고침 후에도 데이터가 유지
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  /*
  addTodo 함수:
   새로운 할 일을 목록에 추가
    - 앞뒤 공백만 있는 입력은 무시
    - ID는 crypto.randomUUID()로 브라우저 내장 UUID 생성
    - useCallback: 의존성 배열이 []로 한 번만 생성
   */
  const addTodo = useCallback((text: string) => {
    const trimmedText = text.trim();

    // 공백 입력 리턴
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      isCompleted: false,
    };

    // 함수형 업데이트
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  /*
  completeTodo 함수:
   특정 ID의 할 일을 완료(isCompleted: true) 상태로 변경
   완료된 항목은 "완료" 섹션으로 이동하고 삭제만 가능해짐
  */
  const completeTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map(
        (todo) =>
          todo.id === id
            ? { ...todo, isCompleted: true } // 해당 항목만 완료 처리
            : todo, // 나머지는 그대로 유지
      ),
    );
  }, []);

  /*
  deleteTodo:
   특정 ID의 할 일을 목록에서 영구 삭제
  */
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  /*
   Context value를 useMemo로 메모이제이션
   - useMemo는 의존성 배열의 값이 바뀌지 않으면 이전에 만든 객체를 그대로 재사용함
   - Context에 넘기는 참조가 같으므로 불필요한 리렌더가 발생하지 않음
   */
  const value = useMemo(
    () => ({
      todos,
      addTodo,
      completeTodo,
      deleteTodo,
    }),
    [todos, addTodo, completeTodo, deleteTodo],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// 커스텀 hook
export function useTodoContext() {
  const context = useContext(TodoContext);

  // Provider 없이 사용하는 경우
  if (!context) {
    throw new Error("useTodoContext는 TodoProvider 안에서 사용해야 합니다.");
  }

  return context;
}
