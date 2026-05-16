import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { updateLp } from '../../apis/lpsApi';
import { uploadImage } from '../../apis/uploadsApi';
import { useLpForm } from '../../hooks/useLpForm';
import type { LpDetailDto } from '../../types/lp';
import LpFormFields from './LpFormFields';

type LpEditModalProps = {
  lp: LpDetailDto;
  onClose: () => void;
};

function LpEditModal({ lp, onClose }: LpEditModalProps) {
  const queryClient = useQueryClient();
  const overlayRef = useRef<HTMLDivElement>(null);

  const form = useLpForm({
    initialTitle: lp.title,
    initialContent: lp.content,
    initialThumbnail: lp.thumbnail,
    initialTags: lp.tags.map((t) => t.name),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl: string | null | undefined = form.thumbnailPreview;
      if (form.thumbnailFile) {
        try {
          thumbnailUrl = await uploadImage(form.thumbnailFile);
        } catch {
          // 업로드 실패 시 기존 썸네일 유지
        }
      }
      return updateLp(lp.id, {
        title: form.title.trim(),
        content: form.content.trim(),
        thumbnail: thumbnailUrl,
        tags: form.tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lp.id] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },
    onError: (err) => {
      form.setError(err instanceof Error ? err.message : 'LP 수정에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = form.validate();
    if (validationError) {
      form.setError(validationError);
      return;
    }
    updateMutation.mutate();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-6 py-4">
          <h2 className="text-lg font-bold text-white">LP 수정하기</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <LpFormFields
            title={form.title}
            onTitleChange={form.setTitle}
            content={form.content}
            onContentChange={form.setContent}
            thumbnailPreview={form.thumbnailPreview}
            onFileChange={form.handleFileChange}
            onRemoveThumbnail={form.handleRemoveThumbnail}
            tagInput={form.tagInput}
            onTagInputChange={form.setTagInput}
            tags={form.tags}
            onAddTag={form.handleAddTag}
            onTagKeyDown={form.handleTagKeyDown}
            onRemoveTag={form.handleRemoveTag}
            error={form.error}
            titleId="edit-lp-title"
            contentId="edit-lp-content"
          />

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-11 w-full rounded-xl bg-pink-500 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LpEditModal;
