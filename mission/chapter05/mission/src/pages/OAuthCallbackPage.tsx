import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Google OAuth 2.0 리다이렉트 콜백 처리 페이지
// 백엔드가 구글 인증 후 /v1/auth/google/callback?accessToken=...&refreshToken=...으로 리다이렉트
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);
      // replace: true → 콜백 URL이 히스토리에 남지 않아
      // 뒤로가기 시 토큰이 포함된 URL로 돌아가는 것을 방지
      navigate("/my", { replace: true });
    } else {
      // 토큰이 없으면 인증 실패로 간주하고 로그인 페이지로 복귀
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">로그인 처리 중...</p>
      </div>
    </div>
  );
}
