import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 10;

async function fetchPosts({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('네트워크 에러');
  return (await res.json()) as Post[];
}

export default function InfinitePostsAutoJsonPlaceholder() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts-auto', PAGE_SIZE],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="infinite-container">
      {data?.pages.map((page, idx) => (
        <ul key={idx} className="post-list">
          {page.map((post) => (
            <li key={post.id} className="post-item">
              <strong>#{post.id}</strong>
              <span>{post.title}</span>
            </li>
          ))}
        </ul>
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />

      <div className="status-msg">
        {isFetchingNextPage
          ? '불러오는 중이에요...'
          : hasNextPage
          ? '아래로 스크롤하면 더 가져와요'
          : '더 이상 데이터가 없어요'}
      </div>
    </div>
  );
}
