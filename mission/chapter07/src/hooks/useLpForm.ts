import { useEffect, useRef, useState } from 'react';

type LpFormOptions = {
  initialTitle?: string;
  initialContent?: string;
  initialThumbnail?: string | null;
  initialTags?: string[];
};

type FormState = {
  title: string;
  content: string;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  tagInput: string;
  tags: string[];
};

export function useLpForm({
  initialTitle = '',
  initialContent = '',
  initialThumbnail = null,
  initialTags = [],
}: LpFormOptions = {}) {
  const initialFormState: FormState = {
    title: initialTitle,
    content: initialContent,
    thumbnailFile: null,
    thumbnailPreview: initialThumbnail ?? null,
    tagInput: '',
    tags: initialTags,
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState('');

  // Object URL은 브라우저 메모리를 직접 점유하므로, 이전 URL을 추적해 해제함
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // 훅을 사용하는 컴포넌트가 언마운트될 때 마지막 Object URL 해제
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전 Object URL이 있으면 먼저 해제
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setFormState((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: url }));
  };

  const handleRemoveThumbnail = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFormState((prev) => ({ ...prev, thumbnailFile: null, thumbnailPreview: null }));
  };

  const handleAddTag = () => {
    const trimmed = formState.tagInput.trim();
    if (!trimmed || formState.tags.includes(trimmed)) {
      setFormState((prev) => ({ ...prev, tagInput: '' }));
      return;
    }
    setFormState((prev) => ({ ...prev, tags: [...prev.tags, trimmed], tagInput: '' }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormState((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const validate = (): string => {
    if (!formState.title.trim()) return '제목을 입력해주세요.';
    if (!formState.content.trim()) return '내용을 입력해주세요.';
    return '';
  };

  const resetForm = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFormState(initialFormState);
    setError('');
  };

  return {
    // 폼 입력 데이터 묶음 — 제출 시 formState 하나만 참조해도 됨
    formState,
    // 개별 필드 접근 (기존 소비 컴포넌트 호환)
    title: formState.title,
    setTitle: (title: string) => setFormState((prev) => ({ ...prev, title })),
    content: formState.content,
    setContent: (content: string) => setFormState((prev) => ({ ...prev, content })),
    thumbnailFile: formState.thumbnailFile,
    thumbnailPreview: formState.thumbnailPreview,
    tagInput: formState.tagInput,
    setTagInput: (tagInput: string) => setFormState((prev) => ({ ...prev, tagInput })),
    tags: formState.tags,
    error,
    setError,
    handleFileChange,
    handleRemoveThumbnail,
    handleAddTag,
    handleTagKeyDown,
    handleRemoveTag,
    validate,
    resetForm,
  };
}
