import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useComments } from '../hooks/useComments'
import { CommentSkeleton } from './LoadingSkeleton'
import useLocalStorage from '../hooks/useLocalStorage'
import api from '../lib/api'
import type { SortOrder, UserToken } from '../types/lp'
import { timeAgo } from '../lib/timeAgo'

interface Props {
  lpId: number
  hasToken: boolean
}

const CommentSection = ({ lpId, hasToken }: Props) => {
  const [order, setOrder] = useState<SortOrder>('asc')
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [token] = useLocalStorage<UserToken | null>('token', null)
  const queryClient = useQueryClient()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(lpId, order, hasToken)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const comments = data?.pages.flatMap((p) => p.data) ?? []

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: (content: string) =>
      api.post(`/v1/lps/${lpId}/comments`, { content }),
    onSuccess: () => {
      setInput('')
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      setInputError('댓글 내용을 입력해주세요.')
      return
    }
    setInputError('')
    submitComment(input.trim())
  }

  return (
    // 카드 래퍼 없음 — LpDetailPage의 카드 안에서 렌더됨
    <div className="p-8 pt-6 pb-8">

      {/* 헤더: 제목 + 정렬 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">댓글</h2>
        <div className="flex gap-2">
          {(['asc', 'desc'] as SortOrder[]).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrder(o)}
              className={`rounded border px-3 py-1 text-sm transition-colors ${
                order === o
                  ? 'border-white bg-white text-black'
                  : 'border-neutral-600 text-neutral-300 hover:border-white hover:text-white'
              }`}
            >
              {o === 'asc' ? '오래된순' : '최신순'}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 입력란 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (inputError) setInputError('')
            }}
            placeholder="댓글을 입력해주세요"
            disabled={!hasToken}
            className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm text-white placeholder-neutral-400 outline-none focus:border-neutral-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !hasToken}
            className="rounded-lg bg-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            작성
          </button>
        </div>
        {inputError && <p className="mt-1.5 text-xs text-red-400">{inputError}</p>}
        {!hasToken && <p className="mt-1.5 text-xs text-neutral-500">로그인 후 댓글을 작성하고 볼 수 있습니다.</p>}
      </form>

      {/* 비로그인 상태 */}
      {!hasToken && (
        <p className="py-4 text-center text-sm text-neutral-500">로그인 후 댓글을 볼 수 있습니다.</p>
      )}

      {/* 초기 로딩 — 상단 스켈레톤 */}
      {isLoading && <CommentSkeleton />}

      {/* 에러 */}
      {isError && <p className="py-4 text-center text-sm text-red-400">댓글을 불러오지 못했습니다.</p>}

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <ul className="space-y-5">
          {comments.map((comment) => {
            const isOwn = !!token && token.name === comment.author.name
            return (
              <li key={comment.id} className="flex items-start gap-3">
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-600 text-sm font-bold text-white">
                    {comment.author.name[0]}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{comment.author.name}</p>
                  <p className="mt-0.5 text-sm text-neutral-300">{comment.content}</p>
                  <p className="mt-1 text-xs text-neutral-500">{timeAgo(comment.createdAt)}</p>
                </div>
                {isOwn && (
                  <button type="button" className="shrink-0 text-neutral-500 hover:text-white" aria-label="댓글 옵션">
                    <DotsIcon />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* 추가 로딩 — 하단 스켈레톤 */}
      {isFetchingNextPage && <div className="mt-5"><CommentSkeleton count={3} /></div>}

      {/* IntersectionObserver 트리거 */}
      <div ref={sentinelRef} className="h-2" />
    </div>
  )
}

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
)

export default CommentSection
