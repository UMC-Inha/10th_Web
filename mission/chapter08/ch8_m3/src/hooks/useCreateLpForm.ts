import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp, updateLp } from '../api/lpApi';
import { uploadImage } from '../api/userApi';
import type { Lp } from '../types/lp';

interface UseCreateLpFormProps {
  initialLp?: Lp;
  onClose: () => void;
}

export function useCreateLpForm({ initialLp, onClose }: UseCreateLpFormProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialLp;

  const [title, setTitle] = useState(initialLp?.title ?? '');
  const [content, setContent] = useState(initialLp?.content ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialLp?.thumbnail ?? '');
  const [previewUrl, setPreviewUrl] = useState(initialLp?.thumbnail ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(initialLp?.tags?.map((t) => t.name) ?? []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let finalThumbnail = thumbnailUrl;
      if (selectedFile) {
        finalThumbnail = await uploadImage(selectedFile);
      }
      if (!finalThumbnail) throw new Error('썸네일 이미지를 선택해주세요.');
      if (isEditMode) {
        return updateLp(initialLp.id, { title, content, thumbnail: finalThumbnail, tags });
      }
      return createLp({ title, content, thumbnail: finalThumbnail, tags, published: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['lp', String(initialLp.id)] });
      }
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message || '요청에 실패했습니다.');
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setThumbnailUrl('');
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    if (!content.trim()) { setError('내용을 입력해주세요.'); return; }
    if (!selectedFile && !thumbnailUrl) { setError('썸네일 이미지를 선택해주세요.'); return; }
    if (tags.length === 0) { setError('태그를 최소 1개 입력해주세요.'); return; }
    mutate();
  };

  return {
    fileInputRef,
    isEditMode,
    title, setTitle,
    content, setContent,
    previewUrl,
    tags,
    tagInput, setTagInput,
    error,
    isPending,
    handleFileChange,
    addTag,
    removeTag,
    handleSubmit,
  };
}
