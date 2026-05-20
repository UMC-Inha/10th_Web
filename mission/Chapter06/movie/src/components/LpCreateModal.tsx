import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

interface InitialData {
  title: string
  content: string
  thumbnail: string
  tags: string[]
}

interface Props {
  onClose: () => void
  lpId?: number        // 있으면 수정 모드
  initialData?: InitialData
}

const VinylPlaceholder = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
    <circle cx="100" cy="100" r="100" fill="#1a1a1a" />
    <circle cx="100" cy="100" r="70" fill="#111" />
    <circle cx="100" cy="100" r="50" fill="#1a1a1a" />
    <circle cx="100" cy="100" r="30" fill="#111" />
    <circle cx="100" cy="100" r="12" fill="#222" />
    <circle cx="100" cy="100" r="5" fill="#555" />
  </svg>
)

const LpCreateModal = ({ onClose, lpId, initialData }: Props) => {
  const isEditMode = !!lpId
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail ?? '')
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setThumbnail(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput('')
  }

  const mutation = useMutation({
    mutationFn: () =>
      isEditMode
        ? api.patch(`/v1/lps/${lpId}`, { title, content, thumbnail, tags, published: true })
        : api.post('/v1/lps', { title, content, thumbnail, tags, published: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps', 'list'] })
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['lps', 'detail', lpId] })
      }
      onClose()
    },
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-neutral-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-lg text-white/50 hover:text-white"
          aria-label="닫기"
        >
          ✕
        </button>

        <h2 className="mb-5 text-center text-sm font-semibold text-white">
          {isEditMode ? 'LP 수정' : 'LP 추가'}
        </h2>

        {/* 썸네일 */}
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-36 w-36 overflow-hidden rounded-full"
            aria-label="이미지 선택"
          >
            {thumbnail ? (
              <img src={thumbnail} alt="LP 썸네일" className="h-full w-full object-cover" />
            ) : (
              <VinylPlaceholder />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-400 outline-none focus:border-white/50"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-400 outline-none focus:border-white/50"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return
                if (e.key === 'Enter') handleAddTag()
              }}
              className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-400 outline-none focus:border-white/50"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-lg bg-pink-500 px-4 text-sm font-semibold text-white hover:bg-pink-400"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-neutral-700 px-3 py-1 text-xs text-white"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    className="text-white/50 hover:text-white"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {mutation.isError && (
            <p className="text-xs text-red-400">
              {isEditMode ? 'LP 수정에 실패했습니다.' : 'LP 추가에 실패했습니다.'} 다시 시도해주세요.
            </p>
          )}

          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={!title || mutation.isPending}
            className="mt-1 w-full rounded-lg bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mutation.isPending
              ? (isEditMode ? '수정 중...' : '추가 중...')
              : (isEditMode ? 'Edit LP' : 'Add LP')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LpCreateModal
