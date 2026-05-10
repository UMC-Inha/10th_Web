import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLps } from '../hooks/useLps'
import { timeAgo } from '../lib/timeAgo'
import { GridSkeleton } from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import type { SortOrder } from '../types/lp'

const HomePage = () => {
  const navigate = useNavigate()
  const [order, setOrder] = useState<SortOrder>('desc')
  const { data, isLoading, isError, refetch } = useLps(order)

  return (
    <div className="relative min-h-full p-4">
      {/* 정렬 버튼 */}
      <div className="mb-4 flex justify-end gap-2">
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

      {isLoading && <GridSkeleton />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {/* LP 그리드 */}
      {data && (
        <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-6 px-4">
          {data.data.map((lp) => (
            <button
              key={lp.id}
              type="button"
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="group relative aspect-square bg-neutral-800 transition-transform duration-200 hover:scale-[1.1] hover:z-10"
            >
              {lp.thumbnail ? (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-700 text-xs text-neutral-400">
                  No Image
                </div>
              )}

              {/* 호버 오버레이: 제목 / 업로드일 / 좋아요 */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="truncate text-sm font-semibold text-white">{lp.title}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{timeAgo(lp.createdAt)}</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <span className="text-pink-400">♥</span>
                    {lp.likes.length}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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

export default HomePage
