# 클라이언트 저장소 전략

## 개요

- 로그인 후 발급된 <strong>토큰·세션 식별자</strong> 등을 <strong>어디에 둘지</strong>는 보안·UX·도메인·CORS 정책과 함께 결정해야 함
- 브라우저에서는 <strong>쿠키</strong>, <strong>localStorage</strong>, <strong>sessionStorage</strong>를 자주 비교함

---

## HTTP와 “상태”

- HTTP 자체는 요청마다 독립적인 메시지로 동작하는 <strong>무상태(stateless)</strong> 프로토콜로 설명됨
- “로그인 유지”는 서버가 세션을 두거나, 클라이언트가 토큰·쿠키를 들고 매 요청에 증표를 붙이는 식으로 <strong>응용 계층에서 상태를 모델링</strong>함
- 개념 정리: <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Overview#http은_상태는_없지만_세션은_있습니다">MDN — HTTP 개요(무상태와 세션)</a>

---

## 쿠키(Cookie)

### 특징

- 브라우저가 <strong>조건에 맞는 요청에 자동으로 전송</strong>할 수 있음
- <code>Domain</code>, <code>Path</code>, <code>Expires</code> / <code>Max-Age</code> 등으로 범위·수명을 제한함
- <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> 등 보안 관련 속성을 줄 수 있음

규격: <a href="https://datatracker.ietf.org/doc/html/rfc6265">RFC 6265</a>  
설명: <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies">MDN — HTTP 쿠키</a>

### 장점

- 자동 전송으로 클라이언트 코드가 단순해질 수 있음
- <code>HttpOnly</code>로 스크립트 접근을 막으면 XSS로 쿠키 문자열을 읽기 어렵게 할 수 있음

### 단점

- 자동 전송은 <strong>CSRF</strong> 대비(<code>SameSite</code>, CSRF 토큰, 의도한 메서드·Origin 검증 등)가 필요할 수 있음 — <a href="https://developer.mozilla.org/ko/docs/Glossary/CSRF">MDN — CSRF</a>

---

## localStorage

### 특징

- <a href="https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage">MDN — Window.localStorage</a>에 따르면, 출처(origin) 단위로 데이터가 유지되는 저장소임
- <strong>요청 헤더에 자동으로 붙지 않음</strong> — 필요 시 스크립트가 읽어 <code>Authorization</code> 등에 넣어야 함

### 장점

- API가 단순하고(<code>setItem</code> / <code>getItem</code>) 용량이 쿠키보다 넉넉한 편임

### 단점

- 동일 출처 스크립트가 읽을 수 있어 <strong>XSS</strong> 시 토큰 유출 위험이 큼 — <a href="https://developer.mozilla.org/ko/docs/Web/Security/Attacks/XSS">MDN — XSS</a>

---

## sessionStorage

### 특징

- <a href="https://developer.mozilla.org/ko/docs/Web/API/Window/sessionStorage">MDN — Window.sessionStorage</a>에 따르면, 페이지 세션이 유지되는 동안만(탭 단위) 보관되는 저장소임
- API는 localStorage와 유사함

### 장점

- 탭을 닫으면 사라지므로 <strong>짧게만 유지</strong>할 값에 맞출 수 있음

### 단점

- “다음 방문 시에도 로그인 유지”에는 부적합한 경우가 많음
- 역시 스크립트 접근 가능 → XSS 위험은 남음

---

## 저장소 비교 표

| 저장소 | 자동 전송 | 수명 | HttpOnly 등 | 스크립트 접근 | CSRF 관점 |
| --- | --- | --- | --- | --- | --- |
| 쿠키 | 조건부 자동 | 속성으로 제어 | 가능 | HttpOnly 시 제한 | 자동 전송 시 주의 |
| localStorage | 없음 | 브라우저·출처 단위 지속 | 없음 | 가능 | 헤더 수동 첨부 시 패턴에 따름 |
| sessionStorage | 없음 | 탭/세션 단위 | 없음 | 가능 | 동일 |

※ 실무에서는 <strong>Refresh는 HttpOnly 쿠키</strong>, <strong>Access는 메모리</strong> 등 조합을 쓰는 경우가 많음(팀 보안 가이드 따름)

---

## 정리 과제(공식 문서 기준 답안 가이드)

### HTTP 무상태와 로그인 유지

1. <strong>HTTP가 무상태로 기술되는 이유</strong>  
   요청 간 연결 상태를 프로토콜이 강제하지 않아 서버 구현·캐싱·프록시가 단순해짐 — 위 MDN HTTP 개요 참고

2. <strong>무상태와 “사용자 상태”</strong>  
   연속된 사용자 맥락은 쿠키·세션 ID·Bearer 토큰 등으로 애플리케이션이 별도 설계함

3. <strong>쿠키 Domain</strong>  
   어떤 호스트에 쿠키를 보낼지 범위를 정함 — <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie#domaindomain-value">MDN — Set-Cookie / Domain</a>

4. <strong>쿠키 Path</strong>  
   URL 경로 prefix가 일치할 때만 전송되도록 제한 — <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie#pathpath-value">MDN — Set-Cookie / Path</a>

5. <strong>세션 쿠키 vs 지속 쿠키</strong>  
   <code>Max-Age</code>나 <code>Expires</code>가 없으면 세션 쿠키로 동작하는 것이 일반적임 — <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie">MDN — 쿠키 수명</a>

6. <strong>HttpOnly / Secure / SameSite</strong>  
   MDN <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies#restrict_access_to_cookies">쿠키 제한</a> 및 <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie">Set-Cookie</a> 참고

7. <strong>쿠키만으로의 한계</strong>  
   크기 제한·스코프 규칙·비브라우저 클라이언트 등으로 토큰 헤더 전송·서버 세션과 병행하는 설계가 흔함

### XSS

1. <strong>XSS</strong>  
   신뢰되는 사이트 맥락에서 공격자 스크립트가 실행되게 만드는 취약점·공격 — MDN XSS 문서 참고

2. <strong>방어(요지)</strong>  
   출력 인코딩, <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Content-Security-Policy">CSP</a>, HttpOnly 쿠키 등 다층 방어

### 세션 하이재킹

1. <strong>의미</strong>  
   세션 토큰·쿠키·Bearer 토큰 등 <strong>인증 증표를 탈취</strong>해 사용자를 사칭하는 공격으로 이해하면 됨(용어는 보안 문서에서 세션 하이재킹으로 묶어 설명하는 경우가 많음)

2. <strong>완화 방향</strong>  
   XSS·네트워크 스니핑·피싱 등 탈취 경로별 대응(HTTPS, 쿠키 속성, 토큰 수명, 재인증 등)

### CSRF

1. <strong>CSRF</strong>  
   사용자가 의도하지 않은 상태 변경 요청을 다른 출처가 유발하는 공격 — MDN CSRF 용어 참고

2. <strong>방어</strong>  
   <code>SameSite</code>, CSRF 토큰, <code>Origin</code>·<code>Referer</code> 검증, 중요 작업 재인증 등

3. <strong>CSRF 토큰</strong>  
   요청마다 예측하기 어려운 값을 요구해 위조 요청을 어렵게 함

4. <strong>CAPTCHA</strong>  
   자동화된 남용을 줄이기 위한 보조 수단(표준은 아니나 업계에서 흔히 병행)

### 쿠키 vs Authorization 헤더

1. <strong>쿠키</strong>  
   브라우저가 스코프 규칙에 따라 자동 첨부 — RFC 6265, MDN 쿠키

2. <strong>헤더(Bearer 등)</strong>  
   애플리케이션이 명시적으로 붙임 — RFC 6750, MDN Authorization

3. <strong>크로스 오리진</strong>  
   <code>fetch</code>의 <a href="https://developer.mozilla.org/ko/docs/Web/API/Request/credentials"><code>credentials</code></a>와 CORS 응답 헤더가 맞아야 쿠키가 포함됨

---

## 참고 자료

- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Overview">MDN — HTTP 개요</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies">MDN — HTTP 쿠키</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage">MDN — localStorage</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/API/Window/sessionStorage">MDN — sessionStorage</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS">MDN — CORS</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/Security/Attacks/XSS">MDN — XSS</a>
- <a href="https://developer.mozilla.org/ko/docs/Glossary/CSRF">MDN — CSRF</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6265">RFC 6265 — HTTP State Management Mechanism</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6750">RFC 6750 — Bearer Token Usage</a>
- <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html">OWASP — CSRF Prevention Cheat Sheet</a>
- <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html">OWASP — XSS Prevention Cheat Sheet</a>
