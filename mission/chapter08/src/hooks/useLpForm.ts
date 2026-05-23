import { useState } from 'react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
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
