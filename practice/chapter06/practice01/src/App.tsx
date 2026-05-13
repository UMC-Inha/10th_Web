// src/App.tsx

/*
 * 1. 훅(Hooks) 사용 이유
 *    - 외부 데이터는 UI 상태로 관리되어야 함 (useState)
 *    - 데이터 호출은 컴포넌트 렌더링 외의 부수 효과이므로 제어가 필요함 (useEffect)
 * 
 * 2. 네트워크 최적화의 필요성
 *    - 무분별한 반복 요청은 서버 부하 증가 및 네트워크 비용 상승의 원인
 *    - 변동성이 적은 데이터는 불필요한 통신을 최소화해야 함
 * 
 * 3. React Query를 통한 해결 (Caching)
 *    - 'Query Key'를 고유 식별자로 사용하여 데이터를 메모리에 캐싱
 *    - 동일 키 요청 시 네트워크 통신 없이 캐시된 데이터를 반환하여 UX 및 성능 최적화
 */

import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WelcomeData } from './components/UserDataDisplay';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
}

export default App