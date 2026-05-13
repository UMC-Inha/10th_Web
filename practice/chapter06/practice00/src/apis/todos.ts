export interface TodoResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<TodoResponse[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 발생했습니다.');
  }
  
  const data = await response.json();

    return data.slice(0, 10);
};