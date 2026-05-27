import { useState, useRef, useEffect, type ChangeEvent, type MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp, uploadLpThumbnail } from "../apis/lp";

type LpPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function LpPostModal({ isOpen, onClose }: LpPostModalProps) {
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [lpTag, setLpTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const mutation = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      resetForm();
      onClose();
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const resetForm = () => {
    setLpName("");
    setLpContent("");
    setLpTag("");
    setTags([]);
    setSelectedFile(null);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleAddTag = () => {
    const trimmedTag = lpTag.trim();
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) {
      setLpTag("");
      return;
    }
    setTags((prev) => [...prev, trimmedTag]);
    setLpTag("");
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!lpName.trim() || !lpContent.trim()) {
      alert("LP 제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (tags.length === 0) {
      alert("태그를 하나 이상 추가해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const thumbnail = selectedFile
        ? await uploadLpThumbnail(selectedFile)
        : undefined;

      await mutation.mutateAsync({
        title: lpName,
        content: lpContent,
        tags,
        published: true,
        thumbnail,
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      alert("LP 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-950/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl"
        onClick={handleModalClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-pink-500"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-5 pt-4">
          <button
            type="button"
            onClick={handleImageAreaClick}
            className="relative flex h-36 w-36 flex-col items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 shadow-inner shadow-pink-500/20 transition hover:ring-2 hover:ring-pink-500/50"
          >
            <div className="absolute inset-0 bg-black/20" />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="LP thumbnail preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
                <div className="h-20 w-20 rounded-full border border-zinc-700 bg-zinc-900/70 shadow-lg shadow-black/40" />
                <p className="text-xs text-zinc-400">LP 사진 추가</p>
              </div>
            )}
            <span className="absolute bottom-3 rounded-full bg-pink-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
              Click to add
            </span>
          </button>

          <div className="w-full space-y-4">
            <input
              value={lpName}
              onChange={(e) => setLpName(e.target.value)}
              placeholder="LP Name"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />

            <textarea
              value={lpContent}
              onChange={(e) => setLpContent(e.target.value)}
              placeholder="LP Content"
              rows={4}
              className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />

            <div className="flex gap-3">
              <input
                value={lpTag}
                onChange={(e) => setLpTag(e.target.value)}
                placeholder="LP Tag"
                className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-400"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/80 text-[10px] font-bold text-white transition hover:bg-pink-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:bg-pink-600/70"
          >
            {isSubmitting ? "Posting..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LpPostModal;

