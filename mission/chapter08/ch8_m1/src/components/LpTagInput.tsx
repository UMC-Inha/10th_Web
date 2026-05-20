interface LpTagInputProps {
  tagInput: string;
  tags: string[];
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function LpTagInput({
  tagInput, tags,
  onTagInputChange, onAddTag, onRemoveTag, onKeyDown,
}: LpTagInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[#888]">태그</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={onTagInputChange}
          onKeyDown={onKeyDown}
          placeholder="태그를 입력하세요"
          maxLength={30}
          className="flex-1 py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
        />
        <button
          type="button"
          onClick={onAddTag}
          disabled={!tagInput.trim()}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2a2a2a] text-[#aaa] hover:bg-[#333] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          추가
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff2d78]/20 text-[#ff2d78] text-xs"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="leading-none text-[#ff2d78]/70 hover:text-[#ff2d78] cursor-pointer bg-transparent border-none p-0"
                aria-label={`${tag} 태그 삭제`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
