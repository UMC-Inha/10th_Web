import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ROUTES } from '../../constants/paths';
import PageLayout from '../../layouts/PageLayout';
import { setAuthTokens } from '../../utils/authToken';

const ACCESS_TOKEN_KEYS = ['accessToken', 'access_token', 'token'] as const;
const REFRESH_TOKEN_KEYS = ['refreshToken', 'refresh_token'] as const;

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
  const [searchParams] = useSearchParams();

  const mergedParams = useMemo(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return new URLSearchParams([...searchParams.entries(), ...hashParams.entries()]);
  }, [searchParams]);

  const error = mergedParams.get('error');
  const accessToken = getValueByCandidates(mergedParams, ACCESS_TOKEN_KEYS);
  const refreshToken = getValueByCandidates(mergedParams, REFRESH_TOKEN_KEYS);

  useEffect(() => {
    if (error || !accessToken) return;
    setAuthTokens(accessToken, refreshToken);
    navigate(ROUTES.home, { replace: true });
  }, [error, accessToken, refreshToken, navigate]);

  const message = error
    ? `구글 로그인 실패: ${error}`
    : !accessToken
      ? '토큰을 받지 못했습니다. 다시 로그인해 주세요.'
      : '구글 로그인 처리 중...';

  return <PageLayout title="Google 로그인 콜백" description={message} />;
}

export default GoogleCallbackPage;
