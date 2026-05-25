import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../../apis/lpsApi';
import { uploadImage } from '../../apis/uploadsApi';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { useLpForm } from '../../hooks/useLpForm';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import ModalOverlay from '../ui/ModalOverlay';
import LpFormFields from './LpFormFields';

type LpCreateModalProps = {
  onClose: () => void;
};

function LpCreateModal({ onClose }: LpCreateModalProps) {
  const queryClient = useQueryClient();
  const form = useLpForm();

  const createMutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl: string | null = null;
      if (form.thumbnailFile) {
        thumbnailUrl = await uploadImage(form.thumbnailFile);
      }
      return createLp({
        title: form.title.trim(),
        content: form.content.trim(),
        thumbnail: thumbnailUrl,
        published: true,
        tags: form.tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpsAll });
      onClose();
    },
    onError: (err) => {
      form.setError(getApiErrorMessage(err, 'LP 생성에 실패했습니다.'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validate()) return;
    createMutation.mutate();
  };

  return (
    <ModalOverlay onClose={onClose} labelledBy="lp-create-modal-title">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-6 py-4">
          <h2 id="lp-create-modal-title" className="text-lg font-bold text-white">LP 추가하기</h2>
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
            fieldErrors={form.fieldErrors}
            error={form.error}
            titleId="create-lp-title"
            contentId="create-lp-content"
          />

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="h-11 w-full rounded-xl bg-pink-500 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? '업로드 중...' : 'Add LP'}
          </button>
        </form>
      </div>
    </ModalOverlay>
  );
}

export default LpCreateModal;
