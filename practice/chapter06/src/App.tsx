import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useCustomFetch } from './hooks/useCustomFetch';
import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlaceholder';
import InfinitePostsAutoJsonPlaceholder from './components/InfinitePostsAutoJsonPlaceholder';

const queryClient = new QueryClient();

type Tab = 'custom-fetch' | 'infinite-button' | 'infinite-auto';

// jsonplaceholder API 타입
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string };
}

// ─────────────────────────────────────────────────────────
// 실제 데이터를 표시하는 하위 컴포넌트
// (AbortController 테스트를 위해 별도 컴포넌트로 분리)
// ─────────────────────────────────────────────────────────
function UserCard({ userId }: { userId: number }) {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const { data, isPending, isError } = useCustomFetch<User>(url);

  if (isPending && !data) {
    return (
      <div className="card loading">
        <div className="spinner" />
        <p>Loading... (User ID: {userId})</p>
        <p className="hint">네트워크 탭에서 요청을 확인하세요</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card error">
        <p className="error-icon">⚠️</p>
        <p>에러 발생 (User ID: {userId})</p>
        <p className="hint">콘솔에서 재시도 로그를 확인하세요</p>
      </div>
    );
  }

  return (
    <div className="card success">
      {isPending && <div className="revalidating">백그라운드 갱신 중...</div>}
      <h3>{data?.name}</h3>
      <p>📧 {data?.email}</p>
      <p>📞 {data?.phone}</p>
      <p>🏢 {data?.company.name}</p>
      <p>🏙️ {data?.address.city}</p>
      <p className="hint">User ID: {data?.id}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// useCustomFetch 데모 섹션 (기존 코드)
// ─────────────────────────────────────────────────────────
function CustomFetchDemo() {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleRandomUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleRetryTest = () => {
    setUserId(999999);
  };

  const handleClearCache = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.includes('jsonplaceholder')
    );
    keys.forEach((k) => localStorage.removeItem(k));
    alert(`캐시 ${keys.length}개 삭제 완료. 페이지를 새로고침하거나 다시 요청해보세요.`);
  };

  return (
    <>
      <p>
        React Query의 핵심 기능을 직접 구현한 커스텀 훅입니다.
        <br />
        <strong>콘솔(F12)</strong>을 열어 캐시 히트 / 재시도 / 취소 로그를 확인하세요.
      </p>

      <section className="features">
        <div className="feature-card">
          <span className="badge green">✓</span>
          <div>
            <strong>캐싱 (staleTime 5분)</strong>
            <p>같은 URL 요청 시 5분 이내라면 캐시 반환, 네트워크 생략</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="badge blue">✓</span>
          <div>
            <strong>AbortController (요청 취소)</strong>
            <p>URL 변경 / 언마운트 시 진행 중인 요청 자동 취소, Race Condition 방지</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="badge orange">✓</span>
          <div>
            <strong>자동 재시도 (지수 백오프)</strong>
            <p>실패 시 1s → 2s → 4s 간격으로 최대 3회 자동 재시도</p>
          </div>
        </div>
      </section>

      <section className="controls">
        <h2>테스트 버튼</h2>
        <div className="buttons">
          <button onClick={handleRandomUser} className="btn primary">
            🎲 다른 사용자 불러오기
            <span>AbortController 테스트 — 빠르게 클릭!</span>
          </button>
          <button onClick={() => setIsVisible((v) => !v)} className="btn secondary">
            {isVisible ? '🙈 컴포넌트 숨기기' : '👁️ 컴포넌트 보이기'}
            <span>언마운트 테스트</span>
          </button>
          <button onClick={handleRetryTest} className="btn warning">
            💥 재시도 테스트 (404 에러)
            <span>콘솔에서 Retry 로그 확인</span>
          </button>
          <button onClick={handleClearCache} className="btn danger">
            🗑️ 캐시 초기화
            <span>localStorage 캐시 삭제</span>
          </button>
        </div>
        <p className="current-id">현재 User ID: <strong>{userId}</strong></p>
      </section>

      <section className="demo">
        {isVisible ? (
          <UserCard key={userId} userId={userId} />
        ) : (
          <div className="card hidden-msg">
            <p>컴포넌트가 언마운트되었습니다.</p>
            <p className="hint">콘솔에서 [Fetch Cancelled] 메시지를 확인하세요.</p>
          </div>
        )}
      </section>

      <section className="explanation">
        <h2>단계별 구현 설명</h2>

        <details open>
          <summary>1단계 — 기본 fetch + 로딩/에러 상태</summary>
          <p>
            <code>useEffect</code> 안에서 fetch를 실행하고, <code>isPending</code>과{' '}
            <code>isError</code> 상태를 관리합니다.
          </p>
          <pre>{`const [data, setData] = useState(null);
const [isPending, setIsPending] = useState(false);
const [isError, setIsError] = useState(false);

useEffect(() => {
  setIsPending(true);
  fetch(url)
    .then(r => r.json())
    .then(d => { setData(d); setIsPending(false); })
    .catch(() => { setIsError(true); setIsPending(false); });
}, [url]);`}</pre>
        </details>

        <details>
          <summary>2단계 — localStorage 캐싱 (staleTime)</summary>
          <p>
            요청 전 <code>localStorage</code>를 확인합니다. 캐시가 <strong>신선(5분 이내)</strong>하면
            네트워크 요청을 완전히 생략합니다. 낡은 캐시가 있으면 먼저 화면에 표시하고
            백그라운드에서 갱신합니다 <em>(stale-while-revalidate)</em>.
          </p>
          <pre>{`const now = Date.now();
const cachedItem = localStorage.getItem(url);
if (cachedItem) {
  const { data, lastFetched } = JSON.parse(cachedItem);
  if (now - lastFetched < STALE_TIME) {
    setData(data);  // 캐시 히트 → 네트워크 생략
    return;
  }
  setData(data);  // stale → 먼저 표시 후 갱신
}
// ... 네트워크 요청 후 localStorage.setItem(...)로 저장`}</pre>
        </details>

        <details>
          <summary>3단계 — AbortController (Race Condition 방지)</summary>
          <p>
            <code>useRef</code>로 <code>AbortController</code>를 보관하고, fetch에 <code>signal</code>을
            전달합니다. <code>useEffect</code> cleanup에서 <code>abort()</code>를 호출하면:
          </p>
          <ul>
            <li>URL이 바뀔 때 이전 요청이 즉시 취소됩니다</li>
            <li>컴포넌트가 언마운트될 때 진행 중인 요청이 취소됩니다</li>
          </ul>
          <pre>{`const abortRef = useRef(null);

useEffect(() => {
  abortRef.current = new AbortController();
  fetch(url, { signal: abortRef.current.signal })
    ...
    .catch(err => {
      if (err.name === 'AbortError') return;  // 취소는 에러 아님
      setIsError(true);
    });
  return () => abortRef.current?.abort();  // cleanup
}, [url]);`}</pre>
        </details>

        <details>
          <summary>4단계 — 자동 재시도 (지수 백오프)</summary>
          <p>
            <code>fetchData</code>를 재귀 호출하되, 재시도 간격을{' '}
            <code>2^n × 1초</code> 로 늘립니다. <code>setTimeout</code> ID를 <code>useRef</code>로
            보관하여 언마운트 시 <code>clearTimeout</code>으로 취소합니다.
          </p>
          <pre>{`const retryRef = useRef(null);

const fetchData = async (retry = 0) => {
  try { ... }
  catch (err) {
    if (err.name === 'AbortError') return;
    if (retry < MAX_RETRIES) {
      const delay = 1000 * 2 ** retry; // 1s, 2s, 4s
      retryRef.current = setTimeout(() => fetchData(retry + 1), delay);
    } else {
      setIsError(true);
    }
  }
};

return () => {
  abortRef.current?.abort();
  clearTimeout(retryRef.current);  // 예약된 재시도도 취소
};`}</pre>
        </details>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// 메인 App
// ─────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState<Tab>('custom-fetch');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header>
          <h1>Chapter 06 — 데이터 패칭 데모</h1>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${tab === 'custom-fetch' ? 'active' : ''}`}
              onClick={() => setTab('custom-fetch')}
            >
              useCustomFetch
            </button>
            <button
              className={`tab-btn ${tab === 'infinite-button' ? 'active' : ''}`}
              onClick={() => setTab('infinite-button')}
            >
              무한 스크롤 (버튼)
            </button>
            <button
              className={`tab-btn ${tab === 'infinite-auto' ? 'active' : ''}`}
              onClick={() => setTab('infinite-auto')}
            >
              무한 스크롤 (자동)
            </button>
          </nav>
        </header>

        {tab === 'custom-fetch' && <CustomFetchDemo />}
        {tab === 'infinite-button' && <InfinitePostsJsonPlaceholder />}
        {tab === 'infinite-auto' && <InfinitePostsAutoJsonPlaceholder />}
      </div>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
