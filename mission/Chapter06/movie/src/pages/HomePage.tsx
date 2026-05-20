import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLps } from '../hooks/useLps'
import { timeAgo } from '../lib/timeAgo'
import { GridSkeleton, BottomSkeleton } from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import LpCreateModal from '../components/LpCreateModal'
import type { SortOrder } from '../types/lp'

const HomePage = () => {
  const navigate = useNavigate()
  const [order, setOrder] = useState<SortOrder>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLps(order)

  // 무한스크롤 트리거: sentinelRef가 뷰포트에 들어오면 다음 페이지 fetch
  const sentinelRef = useRef<HTMLDivElement>(null)

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

  // pages 배열을 flat하게 펼쳐 LP 목록으로 변환
  const lps = data?.pages.flatMap((page) => page.data) ?? []

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

      {/* 초기 로딩 — 상단 스켈레톤 */}
      {isLoading && <GridSkeleton />}

      {/* 에러 */}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {/* LP 그리드 */}
      {isSuccess && (
        <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-6 px-4">
          {lps.map((lp) => (
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

              {/* 호버 오버레이 */}
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

      {/* 추가 로딩 — 하단 스켈레톤 (isFetchingNextPage) */}
      {isFetchingNextPage && <BottomSkeleton />}

      {/* IntersectionObserver 트리거 */}
      <div ref={sentinelRef} className="h-4" />

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-2xl text-white shadow-lg hover:bg-pink-400"
        aria-label="LP 추가"
      >
        +
      </button>

      {isModalOpen && <LpCreateModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default HomePage
