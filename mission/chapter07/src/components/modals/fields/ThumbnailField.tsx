import { useLpFormContext } from '../LpFormContext';

export function ThumbnailField() {
  const { thumbnailPreview, handleFileChange, handleRemoveThumbnail } = useLpFormContext();

  return (
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
          onChange={handleFileChange}
        />
      </label>
      {thumbnailPreview && (
        <button
          type="button"
          onClick={handleRemoveThumbnail}
          className="mt-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          이미지 제거
        </button>
      )}
    </div>
  );
}
