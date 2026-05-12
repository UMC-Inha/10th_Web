import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import PageLayout from '../../layouts/PageLayout';
import { setAuthTokens } from '../../utils/authToken';

const ACCESS_TOKEN_KEYS = ['accessToken', 'access_token', 'token'];
const REFRESH_TOKEN_KEYS = ['refreshToken', 'refresh_token'];

function getValueByCandidates(params: URLSearchParams, candidates: string[]) {
  for (const key of candidates) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
}

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('구글 로그인 처리 중...');

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const mergedParams = new URLSearchParams([
      ...searchParams.entries(),
      ...hashParams.entries(),
    ]);

    const error = mergedParams.get('error');
    if (error) {
      setMessage(`구글 로그인 실패: ${error}`);
      return;
    }

    const accessToken = getValueByCandidates(mergedParams, ACCESS_TOKEN_KEYS);
    const refreshToken = getValueByCandidates(mergedParams, REFRESH_TOKEN_KEYS);

    if (!accessToken) {
      setMessage('토큰을 받지 못했습니다. 다시 로그인해 주세요.');
      return;
    }

    setAuthTokens(accessToken, refreshToken);
    navigate('/', { replace: true });
  }, [navigate, searchParams]);

  return <PageLayout title="Google 로그인 콜백" description={message} />;
}

export default GoogleCallbackPage;
