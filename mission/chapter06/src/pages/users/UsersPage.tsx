import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getMyInfo, getUserInfo } from '../../apis/usersApi';
import PageLayout from '../../layouts/PageLayout';

function UsersPage() {
  const { userId } = useParams();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId ?? 'me'],
    queryFn: () => (userId ? getUserInfo(userId) : getMyInfo()),
  });

  const errorMessage = error instanceof Error ? error.message : error ? '유저 정보를 불러오지 못했습니다.' : '';

  return (
    <PageLayout
      title="유저 관리 페이지"
      description="GET /users/me, GET /users/:userId, PATCH/DELETE /users 관련 화면"
    >
      {isLoading ? <p>유저 정보를 불러오는 중...</p> : null}
      {errorMessage ? <p style={{ color: '#d14343' }}>{errorMessage}</p> : null}
      {user ? (
        <pre style={{ marginTop: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : null}
    </PageLayout>
  );
}

export default UsersPage;
