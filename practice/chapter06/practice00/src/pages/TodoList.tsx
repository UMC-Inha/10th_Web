import { useQuery } from '@tanstack/react-query';
import { fetchTodos, type TodoResponse } from '../apis/todos';

export const TodoList = () => {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery<TodoResponse[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 30_000,           // 30초 동안은 fresh로 간주(불필요한 네트워크 감소)
    gcTime: 5 * 60 * 1000,       // 5분 후 사용되지 않는 캐시 정리(메모리 관리)
    retry: 1,                    // 실패 시 재시도 횟수(기본 3에서 낮추기 등)
    refetchOnWindowFocus: true,  // 포커스 복귀 시 최신화(팀 정책에 따라 on/off)
  });

  if (isPending) return (
    <div className="p-4 text-blue-500 font-bold italic">데이터를 불러오는 중입니다</div>
  );

  if (isError) return (
    <div className="p-4 text-red-500 font-bold border border-red-500 rounded">
      에러가 발생했어요: {error.message}
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">나의 할 일 목록</h2>
      
      <ul className="space-y-3">
        {data?.map((t) => (
          <li key={t.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <input 
              type='checkbox' 
              checked={t.completed} 
              readOnly 
              className="w-5 h-5 accent-indigo-500"
            /> 
            <span className={`text-gray-700 ${t.completed ? 'line-through text-gray-400' : ''}`}>
              {t.title}
            </span>
          </li>
        ))}
      </ul>

      <button 
        disabled={isFetching} 
        onClick={() => refetch()}
        className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-all ${
          isFetching 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
        }`}
      >
        {isFetching ? (
          <span className="flex items-center justify-center gap-2">
             갱신 중
          </span>
        ) : '목록 새로고침'}
      </button>

      {!isPending && isFetching && (
        <p className="text-xs text-right text-gray-400 animate-pulse">
          배경에서 데이터를 동기화하고 있어요...
        </p>
      )}
    </div>
  );
};