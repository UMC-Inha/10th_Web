import { TMDB_IMAGE_BASE_URL } from "../../constants/tmdb";
import type { CastMember, CrewMember } from "../../types/movie";

interface ScrollRowProps {
  items: CrewMember[] | CastMember[];
}

// 스크롤 가능한 행 컴포넌트
const ScrollRow = ({ items }: ScrollRowProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {/* 스크롤 가능한 행 */}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-2 shrink-0 w-24"
        >
          {/* 프로필 이미지 */}
          {item.profile_path ? (
            <img
              src={`${TMDB_IMAGE_BASE_URL}${item.profile_path}`}
              alt={item.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
            />
          ) : (
            // 프로필 이미지가 없을 경우 기본 아이콘 표시
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
              👤
            </div>
          )}
          {/* 이름 */}
          <span className="text-white text-xs text-center font-medium leading-tight">
            {item.name}
          </span>
          {/* 캐릭터 이름 */}
          {"character" in item && item.character && (
            <span className="text-gray-400 text-xs text-center leading-tight">
              {item.character}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScrollRow;
