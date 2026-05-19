import { useEffect, useRef, useState } from 'react';

type LpFormOptions = {
  initialTitle?: string;
  initialContent?: string;
  initialThumbnail?: string | null;
  initialTags?: string[];
};

export function useLpForm({
  initialTitle = '',
  initialContent = '',
  initialThumbnail = null,
  initialTags = [],
}: LpFormOptions = {}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialThumbnail ?? null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
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
    setThumbnailFile(file);
    setThumbnailPreview(url);
  };

  const handleRemoveThumbnail = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const validate = (): string => {
    if (!title.trim()) return '제목을 입력해주세요.';
    if (!content.trim()) return '내용을 입력해주세요.';
    return '';
  };

  return {
    title, setTitle,
    content, setContent,
    thumbnailFile,
    thumbnailPreview,
    tagInput, setTagInput,
    tags,
    error, setError,
    handleFileChange,
    handleRemoveThumbnail,
    handleAddTag,
    handleTagKeyDown,
    handleRemoveTag,
    validate,
  };
}
