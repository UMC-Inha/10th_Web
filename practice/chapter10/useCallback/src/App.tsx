import { useState, useCallback } from 'react';
import { HeavySongList } from './components/HeavySongList';

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [lastVoted, setLastVoted] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(0);

  // ❌ 최적화 전 일반 함수 패턴 (비교용 주석)
  // const handleVote = (title: string) => {
  //   setLastVoted(title);
  //   setVoteCount((prev) => prev + 1);
  // }; // -> 이 상태라면 인풋창에 글자 칠 때마다 함수 주소가 바뀌어 자식이 계속 리렌더링됨!

  // ⭕ useCallback 최적화 패턴: 함수형 업데이트를 활용해 의존성 배열을 []로 고정!
  const handleVote = useCallback((title: string) => {
    setLastVoted(title);
    setVoteCount((prev) => prev + 1);
  }, []); // 의존성이 없으므로 앱이 구동될 때 생성된 최초의 메모리 주소를 영원히 보존합니다.

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 font-sans">
      <main className="max-w-md w-full bg-white shadow-xl border border-zinc-200 rounded-2xl p-6 flex flex-col gap-6">
        
        {/* 상단 헤더 구역 */}
        <div className="border-b border-zinc-100 pb-4">
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            🍠 10주차 useCallback 실습 스튜디오
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            F12를 눌러 콘솔 창을 켜고 리렌더링 방어벽을 확인해 보세요.
          </p>
        </div>

        {/* 부모의 독립적인 상태 변경용 인풋 구역 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-600">부모 컴포넌트 독립 상태 제어</label>
          <input
            type="text"
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-300"
            placeholder="여기에 아무 글자나 마구 타이핑해 보세요..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <p className="text-[11px] text-zinc-400 italic">
            현재 입력된 값: <span className="text-zinc-600 font-mono font-bold">{keyword || "없음"}</span>
          </p>
        </div>

        {/* 스토어 대시보드 스냅샷 구역 */}
        <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl flex justify-between items-center shadow-inner">
          <div>
            <p className="text-[11px] text-zinc-400 font-medium">최근 투표한 곡</p>
            <p className="text-sm font-bold mt-0.5 truncate max-w-[180px]">
              {lastVoted ? `🎵 ${lastVoted}` : "아직 없음 😢"}
            </p>
          </div>
          <div className="text-right border-l border-zinc-700 pl-4">
            <p className="text-[11px] text-zinc-400 font-medium">누적 투표 수</p>
            <p className="text-xl font-black text-amber-400">{voteCount}표</p>
          </div>
        </div>

        {/* 자식 컴포넌트에 메모이즈된 콜백 전달 */}
        <HeavySongList onVote={handleVote} />

      </main>
    </div>
  );
}