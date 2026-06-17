import { memo } from 'react';

interface HeavySongListProps {
  onVote: (title: string) => void;
}

// 💡 중요: React.memo로 감싸주어야 useCallback의 참조 고정 효과를 볼 수 있습니다!
export const HeavySongList = memo(function HeavySongList({ onVote }: HeavySongListProps) {
  console.log("🚨 [자식 컴포넌트] HeavySongList가 렌더링되었습니다!");

  const mockSongs = [
    { id: 1, title: "Hype Boy", singer: "NewJeans" },
    { id: 2, title: "Supernova", singer: "aespa" },
    { id: 3, title: "Spot!", singer: "Zico (feat. JENNIE)" }
  ];

  return (
    <div className="border border-zinc-200 rounded-xl p-5 bg-zinc-50 shadow-sm mt-4">
      <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">
        🔥 인기 곡 투표 리스트 (무거운 자식)
      </h3>
      <p className="text-xs text-amber-600 mb-4 font-medium">
        💡 부모의 인풋창에 글자를 쳐도, `useCallback` 덕분에 이 리스트는 재렌더링(로그 출력)되지 않습니다!
      </p>
      
      <div className="flex flex-col gap-2">
        {mockSongs.map((song) => (
          <div 
            key={song.id} 
            className="flex items-center justify-between bg-white p-3 rounded-lg border border-zinc-100 shadow-sm"
          >
            <div>
              <h4 className="font-bold text-zinc-800 text-sm md:text-base">{song.title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{song.singer}</p>
            </div>
            <button
              onClick={() => onVote(song.title)}
              className="px-3 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              투표하기 👍
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});