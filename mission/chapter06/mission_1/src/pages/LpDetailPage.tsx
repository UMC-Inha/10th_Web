import { useNavigate, useParams } from 'react-router-dom';
import useLpDetail from '../hooks/useLpDetail';
import { useAuth } from '../context/AuthContext';
import { likeLp, deleteLp } from '../api/lp';

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const lp = data?.data;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다!');
      navigate('/login');
      return;
    }
    try {
      await likeLp(lp.id);
      refetch();
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteLp(lp.id);
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← 목록으로
      </button>

      {/* 썸네일 */}
      <img
        src={lp.thumbnail || 'https://via.placeholder.com/600'}
        alt={lp.title}
        className="w-full aspect-square object-cover rounded-lg mb-6"
      />

      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>

      {/* 업로드일 & 좋아요 */}
      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
        <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
        <span>❤️ {lp.likes?.length ?? 0}</span>
      </div>

      {/* 태그 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {lp.tags?.map((tag) => (
          <span
            key={tag.id}
            className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      {/* 본문 */}
      <p className="text-gray-700 leading-relaxed mb-8">{lp.content}</p>

      {/* 버튼들 */}
      <div className="flex gap-3">
        <button
          onClick={handleLike}
          className="px-6 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors"
        >
          ❤️ 좋아요
        </button>
        {user && (
          <>
            <button
              onClick={() => navigate(`/lps/${lp.id}/edit`)}
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 border border-red-300 text-red-400 rounded-md hover:bg-red-50 transition-colors"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LpDetailPage;
