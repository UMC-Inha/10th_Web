# JWT와 세션(Session)

## 왜 나누어 보나

- 로그인 이후 <strong>사용자 상태를 어떻게 유지할지</strong>를 설계할 때 자주 비교하는 두 방식임
- <strong>JWT(JSON Web Token)</strong>은 클라이언트가 <strong>서명된 토큰</strong>을 들고 다니고, 서버는 검증기(비밀키·공개키)와 클레임만으로 판단하는 <strong>무상태에 가까운</strong> 패턴으로 쓰이는 경우가 많음
- <strong>세션</strong>은 서버(또는 중앙 저장소)가 <strong>세션 상태</strong>를 보관하고, 클라이언트는 <strong>세션 식별자</strong>(쿠키 등)만 전달하는 <strong>상태를 서버가 보관</strong>하는 패턴에 가까움

---

## JWT(JSON Web Token)

### 규격상 구조(RFC 7519)

- JWT는 <strong>헤더·페이로드·서명</strong>을 점(.)으로 이은 문자열로 표현함
- 페이로드는 Base64URL 인코딩된 JSON <strong>클레임</strong>(예: <code>sub</code>, <code>exp</code>)을 담음
- 수신자는 서명 알고리즘과 키로 <strong>무결성·발급자 신뢰</strong>를 검증함

공식 정의: <a href="https://datatracker.ietf.org/doc/html/rfc7519">RFC 7519 — JSON Web Token (JWT)</a>

### HTTP에서의 전달

- <code>Authorization: Bearer &lt;token&gt;</code> 형태는 <a href="https://datatracker.ietf.org/doc/html/rfc6750">RFC 6750</a>에서 OAuth 2.0 Bearer 토큰 용법으로 정리됨

### 장점(설계 관점)

1. <strong>스케일 아웃</strong> — 모든 인스턴스가 동일 검증 키만 있으면 저장소 조회 없이 검증할 수 있음(구현에 따라 저장소 조회를 병행하기도 함)
2. <strong>마이크로서비스</strong> — 동일 토큰을 여러 서비스가 검증하기 쉬운 편임
3. <strong>클라이언트 종류</strong> — 헤더만 맞추면 웹·모바일 등에서 동일 패턴을 쓰기 쉬움

### 단점과 주의사항

1. <strong>유출</strong> — 탈취 시 <code>exp</code> 전까지는 형식상 유효할 수 있음 → HTTPS, 짧은 수명, 저장소 선택이 중요함
2. <strong>폐기(리보케이션)</strong> — 규격만으로는 “즉시 무효”가 자동으로 해결되지 않음 → 짧은 Access Token, Refresh 토큰 회전, 서버 측 블록리스트·세션 메타데이터 병행 등이 실무에서 논의됨
3. <strong>페이로드 노출</strong> — JWT는 Base64URL 인코딩일 뿐 암호화가 아님. 민감 정보는 넣지 않는 것이 원칙임(RFC 7519 §8 등 보안 고려사항 참고)

### 클라이언트 흐름(개략)

1. 로그인 → 서버가 Access Token·(선택) Refresh Token 발급
2. API 요청 → <code>Authorization: Bearer …</code>
3. Access 만료 시 → 401 등 응답 후 Refresh로 재발급(앱 구조에 따라 인터셉터 등으로 묶음)
4. 로그아웃 → 클라이언트에서 토큰 삭제·서버에서 Refresh 무효화 등 정책에 따름

### Token Refresh 상세 흐름

Access Token의 수명을 짧게 유지하면서 사용자 경험을 해치지 않기 위해 Refresh Token으로 새 Access Token을 조용히 재발급받는 흐름임.

```
[사용자 로그인]
        │
        ▼
[서버에서 AccessToken과 RefreshToken 발급]
        │
        ▼
[토큰 저장 (로컬 스토리지, 메모리, HttpOnly 쿠키 등 정책에 따름)]
        │
        ├──────────── API 요청 → [서버: AccessToken 검증]
        │                   │
        │                   └─> [유효한 AccessToken → 데이터 응답]
        │
        ▼
[AccessToken 만료 (401 응답 등)]
        │
        ▼
[RefreshToken으로 새로운 AccessToken 재발급 요청]
        │
        ▼
[서버: RefreshToken 검증]
        │
        ├─ RefreshToken 정상 → 새 AccessToken (및 Rotation 정책 시 새 RefreshToken) 발급
        │
        └─ RefreshToken 만료·블랙리스트 등재 → 재발급 거부 → 로그인 페이지로 이동
        │
        ▼
[새로운 AccessToken으로 원래 요청 재시도]
```

> 토큰 저장 위치에 따라 보안 특성이 달라짐. `localStorage`는 XSS에 취약하고, `HttpOnly 쿠키`는 스크립트 접근이 불가하여 보안 측면에서 권장됨 ([RFC 9700 Section 4.13](https://datatracker.ietf.org/doc/html/rfc9700#section-4.13))

---

## 세션(Session)

### 쿠키와의 관계(RFC 6265)

- 서버는 <code>Set-Cookie</code>로 <strong>세션 식별자</strong>를 쿠키에 실어 보낼 수 있음
- 클라이언트는 이후 요청에서 조건에 맞으면 <code>Cookie</code> 헤더로 동일 식별자를 보냄
- 서버는 저장소(메모리·Redis·DB 등)에서 해당 ID의 세션 데이터를 조회함

공식: <a href="https://datatracker.ietf.org/doc/html/rfc6265">RFC 6265 — HTTP State Management Mechanism</a>  
브라우저 관점 설명: <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies">MDN — HTTP 쿠키</a>

### 장점

1. <strong>서버 측 무효화</strong> — 세션 레코드를 지우면 즉시 “로그아웃”에 가까운 효과를 낼 수 있음
2. <strong>자동 전송</strong> — 같은 사이트 요건을 만족하면 브라우저가 쿠키를 붙임
3. <strong>전통적 스택</strong> — 서버 프레임워크와 문서가 풍부함

### 단점과 주의사항

1. <strong>다중 서버</strong> — 세션이 한 인스턴스 메모리에만 있으면 다른 인스턴스가 인식하지 못함 → 중앙 저장소·고정 라우팅 등 추가 설계가 필요할 수 있음
2. <strong>CSRF</strong> — 쿠키 자동 전송은 크로스 사이트 요청 위조 대응(<code>SameSite</code>, 토큰, 메서드 제한 등)이 필요함. <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value">MDN — SameSite</a> 참고

### 쿠키 보안 속성(요약)

- <strong>HttpOnly</strong> — 스크립트에서 접근 불가 → XSS 시 쿠키 탈취 완화
- <strong>Secure</strong> — HTTPS에서만 전송
- <strong>SameSite</strong> — 크로스 사이트 요청에서 전송 여부 제어

### 크로스 오리진 요청과 쿠키

- <code>fetch</code>는 <a href="https://developer.mozilla.org/ko/docs/Web/API/Request/credentials"><code>credentials</code></a> 옵션으로 쿠키 포함 여부를 제어함
- CORS와 함께 서버의 <code>Access-Control-Allow-Credentials</code> 등이 맞아야 함 — <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS">MDN — CORS</a>

---

## 세션 저장 전략(분산 환경, 개념 정리)

서버를 여러 대 둘 때 세션을 유지하는 대표적인 접근은 다음과 같음(용어는 업계 관례임).

1. <strong>Sticky session</strong> — 동일 사용자를 동일 인스턴스로 보내 로컬 세션을 유지
2. <strong>세션 복제</strong> — 인스턴스 간 세션 데이터를 동기화
3. <strong>중앙 세션 저장소</strong> — Redis 등 공용 저장소에 세션을 두고 모든 인스턴스가 조회

---

## 하이브리드(JWT + 저장소 메타데이터)

JWT만으로 검증하는 방식과, 세션처럼 서버가 상태를 두는 방식을 **합친** 설계임 — 규격상 JWT는 <a href="https://datatracker.ietf.org/doc/html/rfc7519">RFC 7519</a>의 **jti**(JWT ID) 등으로 개별 토큰을 구분할 수 있음

### 동작 원리(요약)

1. 로그인 시 서버가 JWT를 내주면서, Redis·DB 등에 <strong>세션 레코드</strong>를 둠 — 저장소에는 **jti**·**sub**·커스텀 **sid**(세션 ID)·권한 스냅샷·발급 시각 등 <strong>서버가 신뢰하는 메타데이터</strong>를 JWT 클레임과 맞춰 저장함
2. 이후 요청은 기존과 같이 <code>Authorization: Bearer</code> 로 JWT를 보냄
3. 서버는 <strong>서명과 만료</strong>를 검증한 뒤, 토큰에서 꺼낸 식별자로 저장소를 조회함 — <strong>레코드가 없거나</strong> **폐기·차단 플래그**가 있으면 401 등으로 거부함
4. 로그아웃·권한 변경·강제 종료 시에는 <strong>클라이언트 토큰 삭제만으로는 부족할 수 있으므로</strong>, 저장소에서 해당 세션·**jti**를 지우거나 무효로 표시함 — 그러면 서명이 유효해도 다음 API 호출부터 막을 수 있음

### 트레이드오프

- 요청마다 저장소 조회(또는 캐시)가 생겨 <strong>순수 무상태 JWT</strong>보다 비용이 늘 수 있음
- 대신 <strong>즉시 무효화</strong>와 <strong>서버 주도 정책</strong>(역할 변경 반영 등)을 같이 가져가기 쉬움

---

## 참고 자료

- <a href="https://datatracker.ietf.org/doc/html/rfc7519">RFC 7519 — JSON Web Token (JWT)</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6750">RFC 6750 — OAuth 2.0 Bearer Token Usage</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6265">RFC 6265 — HTTP State Management Mechanism</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies">MDN — HTTP 쿠키</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS">MDN — CORS</a>
