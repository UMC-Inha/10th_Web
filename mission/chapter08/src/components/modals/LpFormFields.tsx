type LpFormFieldsProps = {
  title: string;
  onTitleChange: (v: string) => void;
  content: string;
  onContentChange: (v: string) => void;
  thumbnailPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveThumbnail: () => void;
  tagInput: string;
  onTagInputChange: (v: string) => void;
  tags: string[];
  onAddTag: () => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  fieldErrors?: { title?: string; content?: string };
  error?: string;
  titleId?: string;
  contentId?: string;
};

export default function LpFormFields({
  title,
  onTitleChange,
  content,
  onContentChange,
  thumbnailPreview,
  onFileChange,
  onRemoveThumbnail,
  tagInput,
  onTagInputChange,
  tags,
  onAddTag,
  onTagKeyDown,
  onRemoveTag,
  fieldErrors = {},
  error = '',
  titleId = 'lp-title',
  contentId = 'lp-content',
}: LpFormFieldsProps) {
  return (
    <>
      {/* 썸네일 */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">LP 사진</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-pink-500/50 hover:bg-pink-500/5">
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="미리보기"
              className="h-48 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-500">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-sm">클릭하여 이미지 선택</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
        {thumbnailPreview && (
          <button
            type="button"
            onClick={onRemoveThumbnail}
            className="mt-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            이미지 제거
          </button>
        )}
      </div>

      {/* 제목 */}
      <div>
        <label htmlFor={titleId} className="mb-1.5 block text-sm font-medium text-slate-300">
          제목 <span className="text-pink-500">*</span>
        </label>
        <input
          id={titleId}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="LP 제목을 입력하세요"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
        />
        {fieldErrors.title && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.title}</p>
        )}
      </div>

      {/* 내용 */}
      <div>
        <label htmlFor={contentId} className="mb-1.5 block text-sm font-medium text-slate-300">
          내용 <span className="text-pink-500">*</span>
        </label>
        <textarea
          id={contentId}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="LP에 대해 설명해주세요..."
          rows={4}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
        />
        {fieldErrors.content && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.content}</p>
        )}
      </div>

      {/* 태그 */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">태그</label>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagKeyDown}
            placeholder="태그 입력 후 추가 버튼 클릭"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
          />
          <button
            type="button"
            onClick={onAddTag}
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
                  onClick={() => onRemoveTag(tag)}
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

      {/* 에러 */}
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}
    </>
  );
}
