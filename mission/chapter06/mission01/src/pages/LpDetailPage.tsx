// src/pages/LpDetailPage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLpDetail, postLike,  deleteLp } from '../apis/lp';
import { useAuth } from '../context/AuthContext';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
  });

  const lp = data?.data;

  const likeMutation = useMutation({
    mutationFn: () => postLike(Number(lpId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lp', lpId] }),
  });


  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(Number(lpId)),
    onSuccess: () => navigate('/'),
  });

  const handleLike = () => {
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login', { state: { from: `/lps/${lpId}` } });
      return;
    }
    likeMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    return '방금 전';
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-800 rounded mb-4 w-1/2" />
      <div className="aspect-square bg-zinc-800 rounded-xl mb-4" />
      <div className="h-4 bg-zinc-800 rounded mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-2/3" />
    </div>
  );

  if (isError || !lp) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-zinc-400">데이터를 불러오는 데 실패했습니다.</p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-500 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* 작성자 정보 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {lp.author.avatar ? (
            <img src={lp.author.avatar} alt={lp.author.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
              {lp.author.name[0]}
            </div>
          )}
          <span className="text-white font-semibold">{lp.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-sm">{timeAgo(lp.createdAt)}</span>
          {/* 수정/삭제 버튼 */}
          <button className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={handleDelete} className="text-zinc-400 hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-white mb-6">{lp.title}</h1>

      {/* 썸네일 - LP 디스크 스타일 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-72 h-72">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover rounded-full shadow-2xl"
          />
          {/* 중앙 원 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#1a1a1a] rounded-full border-2 border-zinc-700" />
          </div>
        </div>
      </div>

      {/* 본문 */}
      <p className="text-zinc-300 text-sm leading-relaxed mb-6 text-center">{lp.content}</p>

      {/* 태그 */}
      {lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {lp.tags.map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
              # {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 좋아요 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span className="text-white text-lg font-bold">{lp.likes.length}</span>
        </button>
      </div>
    </div>
  );
};

export default LpDetailPage;