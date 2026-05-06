import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getMyInfo, getUserInfo } from '../../apis/usersApi';
import PageLayout from '../../layouts/PageLayout';
import type { UserInfo } from '../../types/user';

function UsersPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = userId ? await getUserInfo(userId) : await getMyInfo();
        if (!isMounted) return;
        setUser(data);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : '유저 정보를 불러오지 못했습니다.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

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
