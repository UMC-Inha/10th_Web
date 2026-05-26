import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ROUTES } from '../../constants/paths';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../layouts/PageLayout';

const ACCESS_TOKEN_KEYS = ['accessToken', 'access_token', 'token'] as const;
const REFRESH_TOKEN_KEYS = ['refreshToken', 'refresh_token'] as const;
const NAME_KEYS = ['name', 'userName', 'username'] as const;

function getValueByCandidates(
  params: URLSearchParams,
  candidates: readonly string[],
) {
  for (const key of candidates) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
}

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const mergedParams = useMemo(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return new URLSearchParams([...searchParams.entries(), ...hashParams.entries()]);
  }, [searchParams]);

  const error = mergedParams.get('error');
  const accessToken = getValueByCandidates(mergedParams, ACCESS_TOKEN_KEYS);
  const refreshToken = getValueByCandidates(mergedParams, REFRESH_TOKEN_KEYS);
  const name = getValueByCandidates(mergedParams, NAME_KEYS);

  useEffect(() => {
    if (error || !accessToken) return;
    login(accessToken, refreshToken, name);
    window.history.replaceState(null, '', ROUTES.home);
    navigate(ROUTES.home, { replace: true });
  }, [error, accessToken, refreshToken, name, login, navigate]);

  const message = error
    ? `구글 로그인 실패: ${error}`
    : !accessToken
      ? '토큰을 받지 못했습니다. 다시 로그인해 주세요.'
      : '구글 로그인 처리 중...';

  const showRetry = Boolean(error || !accessToken);

  return (
    <PageLayout title="Google 로그인 콜백" description={message}>
      {showRetry && (
        <Link
          to={ROUTES.authSignin}
          className="mt-6 inline-block rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
        >
          로그인 페이지로 이동
        </Link>
      )}
    </PageLayout>
  );
}

export default GoogleCallbackPage;
