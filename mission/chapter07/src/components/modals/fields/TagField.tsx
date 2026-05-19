import { useLpFormContext } from '../LpFormContext';

export function TagField() {
  const { tagInput, setTagInput, tags, handleAddTag, handleTagKeyDown, handleRemoveTag } = useLpFormContext();

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">태그</label>
      <div className="flex gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="태그 입력 후 추가 버튼 클릭"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
        >
          추가
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs text-pink-300"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 rounded-full hover:text-pink-100 transition-colors"
                aria-label={`${tag} 태그 삭제`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
