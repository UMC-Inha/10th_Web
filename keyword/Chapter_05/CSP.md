# 서버에서 HTML 문서를 응답할 때 CSP를 적용하려면 어떤 HTTP 응답 헤더를 설정해야 하나요? 블로그에 나온 Express.js 코드 예시를 기반으로 설명해보세요.

서버에서 HTML 보낼 때 아래 헤더 설정

👉 `Content-Security-Policy`

Express.js 예시

```jsx
app.use((req,res,next) => {
res.setHeader(
"Content-Security-Policy",
"default-src 'self'"
  );
next();
});
```

→ 의미:

브라우저한테 “이 페이지에서 어떤 리소스 써도 되는지” 규칙을 내려주는 것

# `default-src 'self'` 설정은 브라우저에게 어떤 보안 정책을 의미하나요? 또한 `'self'` 값은 어떤 출처를 포함하거나 제외하나요?
    
    기본 규칙으로, “모든 리소스는 같은 출처에서만 가져와라” 라는 뜻
    
    ### 포함되는 것
    
    - 같은 도메인
    - 같은 프로토콜
    - 같은 포트
    
    ### 제외되는 것
    
    - 다른 도메인 (ex. google.com)
    - 다른 프로토콜 (http vs https)
    - 서브도메인도 기본적으로 다름
    
    즉 완전히 동일한 origin만 허용됨
    
# 블로그에 나온 악성 스크립트(`<script>fetch(...)</script>`)를 주입했을 때 CSP가 어떻게 동작하는지 네트워크 탭과 콘솔 메시지 측면에서 설명해보세요.
    
    예시
    
    ```html
    <script>fetch("https://evil.com")</script>
    ```
    
    ### 네트워크 탭
    
    - 요청 자체가 안 나감
    - 아예 차단됨
    
    ### 콘솔
    
    - 아래와 같은 에러가 뜸
    
    ```
    Refused to connect because it violates CSP
    ```
    
    👉 정리
    
    코드 실행 자체를 막아버림 + 외부 요청도 안 나감
    
# 기본 CSP 설정에서 인라인 스타일이 차단된다고 했습니다. 블로그 예시 중 `width:600px`이 적용되지 않는 이유를 설명하세요.
    
    기본 CSP는 인라인 코드를 차단함
    
    이유:
    
    - 인라인 스타일/스크립트가 XSS 공격 경로라서 기본적으로 막아둔 것
# 구글 애널리틱스, 카카오맵, 외부 API 등이 CSP 때문에 차단될 수 있다고 했습니다. 이러한 현상을 "건물 보안을 강화한다"는 비유와 연결해 설명해보세요.
    
    CSP를 건물 보안으로 보면
    
    - `default-src 'self'`
    → “우리 건물 직원만 출입 가능”
    
    근데
    
    - 구글 애널리틱스
    - 카카오맵
    - 외부 API
    
    다 외부 사람으로 취급되기 때문에 전부 출입 금지됨
    
    해결:
    
    → “이 사람은 들어와도 됨” 이렇게 허용 추가해야 함
    
# Report-Only 모드에서는 실제 리소스 실행이 차단되지 않습니다. 그 대신 브라우저와 서버에서 각각 어떤 동작을 수행하나요?
    
    헤더:
    
    `Content-Security-Policy-Report-Only`
    
    ### 브라우저
    
    - 차단 안 함
    - 그냥 실행은 시켜줌
    
    대신
    
    - “이거 원래 차단해야 하는데?” 로그 남김
    
    ### 서버
    
    - 위반 내용 받아서 기록함
    
    막는 게 아니라 테스트 + 모니터링용
    
# CSP만으로는 CSRF를 막을 수 없다고 했습니다. 블로그에 정리된 다른 보안 조치들(SameSite 쿠키, X-Frame-Options 등) 중 2가지를 설명하세요.
    
    CSP는 “어디서 리소스 가져오냐”만 막는 것
    
    CSRF는 “사용자 인증된 요청을 다른 사이트에서 보내는 공격”
    
    → 성격이 달라서 CSP로 못 막음
    
    ---
    
    ### 1. SameSite 쿠키
    
    ```
    Set-Cookie: SameSite=Strict
    ```
    
    → 다른 사이트에서 요청 보내면 쿠키 안 붙음
    
    그래서 로그인 정보 못 씀 = CSRF 방지됨
    
    ---
    
    ### 2. X-Frame-Options
    
    ```
    X-Frame-Options: DENY
    ```
    
    → 다른 사이트에서 iframe으로 못 띄움
    
    클릭 유도 공격 (클릭재킹) 막음