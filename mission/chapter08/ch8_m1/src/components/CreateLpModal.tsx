import { useCreateLpForm } from '../hooks/useCreateLpForm';
import LpImageUpload from './LpImageUpload';
import LpTagInput from './LpTagInput';
import type { Lp } from '../types/lp';

interface CreateLpModalProps {
  onClose: () => void;
  initialLp?: Lp;
}

export default function CreateLpModal({ onClose, initialLp }: CreateLpModalProps) {
  const {
    fileInputRef, isEditMode,
    title, setTitle,
    content, setContent,
    previewUrl,
    tags, tagInput, setTagInput,
    error, isPending,
    handleFileChange, addTag, removeTag, handleSubmit,
  } = useCreateLpForm({ initialLp, onClose });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={onClose}
    >
      <div
        className="bg-[#111] border border-[#2a2a2a] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">
            {isEditMode ? 'LP 수정' : 'LP 추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors text-xl leading-none cursor-pointer bg-transparent border-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <LpImageUpload
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888]">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              maxLength={100}
              className="w-full py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888]">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP에 대한 설명을 입력하세요"
              rows={4}
              maxLength={2000}
              className="w-full py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors resize-none"
            />
          </div>

          <LpTagInput
            tagInput={tagInput}
            tags={tags}
            onTagInputChange={(e) => setTagInput(e.target.value)}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.nativeEvent.isComposing) return;
                addTag();
              }
            }}
          />

          {error && (
            <p className="text-xs text-[#ff4d4f] text-center py-2 px-3 bg-[rgba(255,77,79,0.1)] border border-[rgba(255,77,79,0.3)] rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg text-sm font-semibold bg-[#ff2d78] text-white hover:bg-[#e0266a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer mt-1"
          >
            {isPending ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? 'LP 수정' : 'Add LP')}
          </button>
        </form>
      </div>
    </div>
  );
}
