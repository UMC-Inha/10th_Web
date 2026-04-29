# HTTP 인증에서의 토큰

## 토큰이란

- <strong>토큰</strong>은 <strong>인증·인가를 검증하기 위해 발급·전달되는 자격 증명</strong>을 넓게 가리키는 말임
- HTTP에서는 주로 <code>Authorization</code> 헤더나 쿠키로 전달됨
- 형식으로는 Basic, Bearer, (OAuth 흐름에서의) 액세스 토큰 등이 있음

---

## Basic 인증

### 방식

- 사용자 ID와 비밀번호를 콜론으로 잇고 <a href="https://datatracker.ietf.org/doc/html/rfc7617">RFC 7617</a>·<a href="https://datatracker.ietf.org/doc/html/rfc2617">RFC 2617</a> 계열에 따라 Base64로 인코딩해 전달함

```http
Authorization: Basic dXNlcjpwYXNzd29yZA==
```

### 특징

- Base64는 <strong>암호화가 아님</strong>. TLS 없이 사용하면 자격 증명이 노출됨
- MDN: <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Authorization#basic_authentication">MDN — Authorization / Basic</a>

---

## Bearer 토큰

### 방식

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- <a href="https://datatracker.ietf.org/doc/html/rfc6750">RFC 6750</a>에서 OAuth 2.0 Bearer 토큰을 <code>Authorization</code> 헤더로 보내는 규칙을 정의함
- JWT를 Bearer 토큰으로 쓰는 경우가 흔함(<a href="https://datatracker.ietf.org/doc/html/rfc7519">RFC 7519</a>)

---

## Access Token과 Refresh Token

RFC에 “Refresh Token”이라는 단일 표준이 있는 것은 아니고, OAuth 2.0 계열에서 관행적으로 쓰임(<a href="https://datatracker.ietf.org/doc/html/rfc6749">RFC 6749</a>의 Refresh 토큰, 이후 보안 BCP 등).

### Access Token

- <strong>역할:</strong> 리소스 요청 시 <strong>현재 접근이 허용되는지</strong> 판단하는 데 쓰임
- <strong>수명:</strong> 짧게 두어 유출 시 피해를 제한하는 설계가 권장되는 편임
- <strong>전달:</strong> RFC 6750에 맞게 Bearer로 보내는 경우가 많음

### Refresh Token

- <strong>역할:</strong> Access Token이 만료되었을 때 <strong>새 Access Token을 발급</strong>받기 위한 장기 자격 증명으로 쓰임
- <strong>저장:</strong> 구현에 따라 HttpOnly 쿠키 등 스크립트 접근이 어려운 저장소를 쓰는 권고가 보안 가이드에 자주 등장함(프로젝트·플랫폼 정책 따름)

### 동작 흐름(개략)

1. 인가 서버가 Access·Refresh 발급
2. 리소스 요청에 Access Token(Bearer)
3. Access 만료 시 401 등 → Refresh로 갱신
4. Refresh 만료·폐기 시 재인증 유도

---

## 참고 자료

- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Authentication">MDN — HTTP 인증</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Authorization">MDN — Authorization 헤더</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc7617">RFC 7617 — HTTP Basic Authentication</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6750">RFC 6750 — OAuth 2.0 Bearer Token Usage</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc6749">RFC 6749 — OAuth 2.0</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc7519">RFC 7519 — JWT</a>
