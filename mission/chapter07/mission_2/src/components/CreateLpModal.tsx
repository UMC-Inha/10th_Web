import { useEffect, useRef, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createLp } from '../api/lp';
import { uploadImage } from '../api/upload';

interface CreateLpModalProps {
  onClose: () => void;
}

const CreateLpModal = ({ onClose }: CreateLpModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: createLpMutate, isPending } = useMutation({
    mutationFn: async () => {
      let thumbnailUrl = '';

      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }

      return createLp({
        title,
        content,
        thumbnail: thumbnailUrl,
        tags,
        published: true,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },

    onError: (error) => {
      console.error('LP 생성 실패:', error);
      alert('LP 생성에 실패했습니다.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);

    setPreviewUrl((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }

      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed || tags.includes(trimmed)) return;

    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('LP 이름을 입력해주세요.');
      return;
    }

    createLpMutate();
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-[#2a2a2a] rounded-2xl w-[90%] max-w-md p-6 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-40 h-40 object-cover rounded-xl border-2 border-pink-500"
            />
          ) : (
            <div className="w-40 h-40 relative flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="#111"
                  stroke="#333"
                  strokeWidth="4"
                />
                <circle cx="100" cy="100" r="65" fill="#222" />
                <circle cx="100" cy="100" r="40" fill="#1a1a1a" />
                <circle cx="100" cy="100" r="12" fill="#444" />
                <circle cx="100" cy="100" r="6" fill="#888" />
                <circle cx="100" cy="100" r="2" fill="#fff" />
              </svg>

              <span className="absolute bottom-2 text-xs text-gray-400">
                클릭해서 사진 추가
              </span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="LP Name"
          className="bg-[#3a3a3a] text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="LP Content"
          className="bg-[#3a3a3a] text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="LP Tag"
            className="flex-1 bg-[#3a3a3a] text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />

          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors border border-gray-600"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-[#3a3a3a] text-gray-300 text-sm px-3 py-1 rounded-full"
              >
                {tag}

                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-white ml-1 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="w-full py-3 rounded-xl text-white font-semibold transition-all
            bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isPending ? 'LP 생성 중...' : 'Add LP'}
        </button>
      </div>
    </div>
  );
};

export default CreateLpModal;
