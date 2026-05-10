import { useParams, useNavigate } from 'react-router-dom'
import { useLp } from '../hooks/useLps'
import { timeAgo } from '../lib/timeAgo'
import { DetailSkeleton } from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import useLocalStorage from '../hooks/useLocalStorage'
import type { UserToken } from '../types/lp'

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>()
  const navigate = useNavigate()
  const [token] = useLocalStorage<UserToken | null>('token', null)

  const { data: lp, isLoading, isError, refetch } = useLp(Number(lpId))

  const isAuthor = !!token && !!lp && token.name === lp.author.name

  if (isLoading) return <DetailSkeleton />
  if (isError) return <ErrorMessage onRetry={() => refetch()} />

  if (!lp) return null

  return (
    <div className="relative min-h-full p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-neutral-800 p-8">

        {/* 작성자 + 업로드일 */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {lp.author.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-sm text-white">
                {lp.author.name[0]}
              </div>
            )}
            <span className="font-medium text-white">{lp.author.name}</span>
          </div>
          <span className="text-sm text-neutral-400">{timeAgo(lp.createdAt)}</span>
        </div>

        {/* 제목 + 수정/삭제 */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{lp.title}</h1>
          {isAuthor && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => navigate(`/lp/${lp.id}/edit`)}
                className="text-neutral-400 hover:text-white"
                aria-label="수정"
              >
                <EditIcon />
              </button>
              <button
                type="button"
                className="text-neutral-400 hover:text-red-400"
                aria-label="삭제"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        {/* LP 원형 이미지 */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-2xl">
            {lp.thumbnail ? (
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-700 text-neutral-400">
                No Image
              </div>
            )}
            {/* LP 중앙 구멍 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-white/80" />
            </div>
          </div>
        </div>

        {/* 본문 */}
        <p className="mb-6 leading-relaxed text-neutral-300">{lp.content}</p>

        {/* 태그 */}
        {lp.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-neutral-700 px-3 py-1 text-sm text-neutral-300"
              >
                # {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div className="flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-neutral-300 hover:text-pink-400"
          >
            <span className="text-2xl text-pink-500">♥</span>
            <span className="text-lg font-medium">{lp.likes.length}</span>
          </button>
        </div>
      </div>

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        onClick={() => navigate('/lp/new')}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-2xl text-white shadow-lg hover:bg-pink-400"
        aria-label="LP 추가"
      >
        +
      </button>
    </div>
  )
}

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export default LpDetailPage
