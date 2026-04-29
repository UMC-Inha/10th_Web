### 실제 서비스 분석 🍠

<aside>
❓

Aido 앱을 직접 사용하며 **OAuth 2.0 소셜 로그인, 토큰 갱신, 접근 제어, CORS** 등이 실제로 어떻게 동작하는지 관찰하고, **웹 프론트엔드 개발자의 시각뿐만 아니라 다양한 직무의 시각**에서 구현 방법을 고민해보는 워크북입니다.

</aside>

- **미션 1 - 소셜 로그인 플로우 관찰하기**
    <aside>
    ❓
    
    로그아웃 상태에서 로그인 화면을 열고, **"카카오로 계속하기"** 버튼을 눌러보세요.
    
    ![스크린샷, 2026-03-29 02.17.47.png](attachment:581889c3-97ab-4a95-b552-f9be7faa4a70:스크린샷_2026-03-29_02.17.47.png)
    
    **Q1.** 버튼을 누르면 어떤 일이 일어나나요? 앱 안에서 화면이 바뀌나요, 아니면 외부 브라우저(또는 카카오톡)가 열리나요?
    
    **Q2.** 카카오 로그인이 완료된 후, 다시 앱으로 돌아오는 과정을 관찰해보세요. 브라우저 주소창에 URL이 잠깐 보였나요? 어떤 정보가 담겨 있었을 것 같나요?
    
    **Q3.** (iOS 사용자) Apple 로그인도 시도해보세요. 카카오와 어떻게 다른가요? 브라우저가 열리나요? (Android 사용자인 경우 Google / Naver 로그인도 시도해보세요) 
    
    **Q4.** 웹 사이트에서 "카카오로 로그인" 버튼을 구현한다면, 버튼 클릭 시 어떤 일이 일어나야 할까요? `window.location.href`로 이동? 팝업 창?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 관찰**
        
        Q**1 답변. 앱 내부에서 브라우저 창이 떴다가 바로 사라진다.**
        
        ![image.png](attachment:4e9a2091-cc23-47e0-a5fb-cf203b09437c:image.png)
        
        ****
        Q**2 답변**. 아이두 주소 페이지가 잠깐 떴다가 사라진다.
        
        **Q3 답변. 애플 로그인은 얼굴 인증을 하고 바로 로그인된다.**
        
        ![image.png](attachment:5cb80e53-a02e-47a7-91af-a1098c5f25c2:image.png)
        
        **Q4 답변. 웹에서는 주로 카카오톡 로그인 시에 window.location.href로 백엔드의 /auth/kakao/login 엔드포인트로 이동시키는 방식을 주로 쓴다. 팝업 창 방식도 가능하지만 모바일 환경에서 팝업 창 차단이 되어있을 경우가 있기 때문에 리다이렉트 방식이 더 일반적이다. 즉 백엔드에서 카카오 인증 페이지로 다시 리다이렉트.**
        
        </aside>

- **미션 2 - 소셜 로그인 후 계정 상태 관찰하기**
    <aside>
    ❓
    
    카카오(또는 다른 소셜)로 로그인한 후 아래를 관찰해보세요.
    
    **Q1.** 소셜 로그인 완료 후 바로 메인 화면(할 일 목록)이 보이나요? 추가 정보 입력 화면이 있나요?
    
    **Q2.** **마이** > **프로필 클릭** > **연결된 계정**에 들어가보세요. "연결된 계정" 항목이 있나요? 어떤 소셜 서비스가 연결되어 있다고 표시되나요?
    
    ![스크린샷, 2026-03-29 02.21.23.png](attachment:3de73ddd-d6f5-4065-9ce6-ad3aeee05d98:스크린샷_2026-03-29_02.21.23.png)
    
    ![스크린샷, 2026-03-29 02.24.06.png](attachment:d0111efc-4c42-49f4-83d2-f95d834483b5:스크린샷_2026-03-29_02.24.06.png)
    
    ![스크린샷, 2026-03-29 02.22.03.png](attachment:f1610237-0438-474a-8979-e282766cfbf0:스크린샷_2026-03-29_02.22.03.png)
    
    **Q3.** 이메일로 가입한 계정에 카카오를 추가로 연결할 수 있을까요? 반대로 카카오만으로 가입한 계정에 이메일/비밀번호를 추가할 수 있을까요?
    
    **Q4.** 웹 서비스(예: 노션, 깃허브 등)에서도 여러 로그인 방식을 연결할 수 있죠. 이걸 프론트엔드에서 구현한다면, "카카오 연결하기" 버튼을 눌렀을 때 어떤 흐름이 필요할까요?
    
    **Q5.** 직접 해봅시다! 본인이 사용하는 이메일(네이버 또는 구글)로 **이메일 회원가입**을 먼저 해보세요. 가입이 완료되면 할 일을 하나 만들고, 이름도 설정해보세요. 그 다음 **로그아웃**한 후, 이번에는 같은 이메일 주소에 해당하는 **소셜 로그인**(네이버 이메일이면 "네이버로 계속하기", 구글 이메일이면 "Google로 계속하기")으로 로그인해보세요.  
    
    - 아까 만들었던 할 일이 그대로 보이나요?
    - 이름도 그대로인가요?
    - 같은 계정으로 접속된 것 같나요, 아니면 새로운 계정이 만들어진 것 같나요?
    - 설정 > 계정 관리에서 연결된 계정을 확인해보세요. 이메일과 소셜 계정이 모두 연결되어 있나요?
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        답변
        
        **Q1 답변. 할 일 페이지(메인 화면)으로 이동되었다.**
        
        **Q2 답변. 카카오에서 연결됨 이라고 뜬다.**
        
        **Q3 답변. 이메일로 가입한 계정에는 소셜 로그인이 연동 가능한데, 반대로 카카오 로그인을 했을 때는 따로 추가적인 이메일 입력 부분이 뜨지 않는다.
        
        Q4 답변.** 
        
        - 현재 로그인된 사용자의 Access Token을 가지고 있는 상태에서 카카오 OAuth 흐름 시작
        - 카카오 인증 완료 후 백엔드 콜백 엔드포인트로 Authorization Code 전달
        - 백엔드는 기존 계정과 카카오 계정을 **연결(Link)** 처리 — 이 때 "신규 회원가입"이 아니라 "기존 계정에 소셜 연결 추가"임을 구분해야 해
        - 연결 완료 후 설정 페이지로 리다이렉트
        ****
        
        **Q5 답변. 같은 이메일로 이메일 회원가입 후, 동일 이메일의 소셜(구글/네이버)로 로그인하면 아이두처럼 이메일 기반으로 계정을 병합(merge)하는 서비스는 아까 만들었던 할 일과 이름이 그대로 보이고, 같은 계정으로 접속된다. 설정 > 계정 관리에서 이메일과 소셜 계정이 모두 연결된 것도 확인할 수 있다. 이건 서버가 이메일 기준으로 계정을 통합 관리하는 덕분이라고 할 수 있다.**
        
        </aside>

- **미션 3 - 토큰 자동 갱신 체험하기**
    <aside>
    ❓
    
    로그인한 상태에서 앱을 **15분 이상** 백그라운드에 두었다가, 다시 열어서 할 일 목록을 확인해보세요.
    
    **Q1.** "다시 로그인하세요" 같은 메시지가 나왔나요? 아니면 정상적으로 데이터가 보이나요?
    
    **Q2.** 아이두의 Access Token 수명은 **15분**입니다. 15분이 지났는데 정상 동작했다면, 뒤에서 어떤 일이 자동으로 일어난 걸까요?
    
    **Q3.** 웹에서 `axios`나 `fetch`를 사용한다고 가정해보세요. API 요청이 `401 Unauthorized`로 돌아왔을 때, 자동으로 토큰을 갱신하고 원래 요청을 재시도하려면 어디에 이 로직을 넣어야 할까요? 
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변. 정상적으로 데이터가 보인다.
        
        Q2 답변.** 앱이 API 요청을 보냈을 때 서버에서 `401 Unauthorized`를 받으면, 앱 내부의 **Axios 인터셉터(또는 동일한 역할의 로직)**가 자동으로 Refresh Token을 사용해서 새 Access Token을 발급받고, 실패했던 원래 요청을 재시도한 것이다. 이때 사용자는 이 과정을 전혀 인지하지 못한다.
        
        **Q3 답변.** `axios`의 **응답 인터셉터(response interceptor)**에 넣어야 한다. 요청이 `401`로 실패했을 때 인터셉터가 가로채서 Refresh Token으로 새 Access Token을 발급받고, 원래 요청을 재시도하는 흐름이다. 대략 이런 구조가 된다.
        
        `_retry` 플래그가 없으면 무한 루프가 발생할 수 있어서 반드시 넣어줘야 한다.
        
        ```tsx
        axios.interceptors.response.use(
          (response) => response,
          async (error) => {
            if (error.response?.status === 401 && !error.config._retry) {
              error.config._retry = true;
              await refreshAccessToken();
              return axios(error.config);
            }
            return Promise.reject(error);
          }
        );
        ```
        
        </aside>

- **생각해보기 1 - OAuth 2.0 Authorization Code Flow**
    <aside>
    ❓
    
    카카오 로그인 시, 앱은 카카오에서 직접 Access Token을 받지 않습니다.
    대신 **Authorization Code**라는 일회용 코드를 받아서 서버에 전달하고, **서버가 이 코드를 카카오 토큰으로 교환**합니다.
    
    왜 이런 번거로운 과정을 거칠까요? 아래 두 방식을 비교해보세요.
    
    | 방식 | 흐름 | `client_secret` 노출? | 토큰 탈취 위험 |
    | --- | --- | --- | --- |
    | Implicit Grant (옛날 방식) | 브라우저가 직접 Access Token을 URL에 받음 | ??? | ??? |
    | Authorization Code Grant (현재 방식) | 서버가 code를 받아서 서버끼리 토큰 교환 | ??? | ??? |
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변: 
        
        ???에 답을 작성해주세요** 
        
        | 방식 | 흐름 | `client_secret` 노출? | 토큰 탈취 위험 |
        | --- | --- | --- | --- |
        | Implicit Grant (옛날 방식) | 브라우저가 직접 Access Token을 URL에 받음 | 노출됨 (클라이언트 코드에 포함) | **높음** — URL에 토큰이 노출되어 히스토리/로그에 남음 |
        | Authorization Code Grant (현재 방식) | 서버가 code를 받아서 서버끼리 토큰 교환 | 노출 안 됨 (서버 측에서만 사용) | **낮음** — 토큰이 브라우저에 직접 전달되지 않음
         |
        
        **이유:** Authorization Code는 일회용 코드라서 탈취해도 단독으로는 의미가 없다. 실제 토큰 교환은 서버끼리 `client_secret`을 포함해서 이루어지므로 브라우저에는 비밀 정보가 노출되지 않는다. Implicit Grant는 Access Token이 URL fragment(`#access_token=...`)에 직접 담겨서 브라우저 히스토리나 Referer 헤더 등에 노출될 위험이 있어서 현재는 사용을 권장하지 않는다.
        
        </aside>

- **생각해보기 2 - OAuth의 redirect_uri는 왜 중요한가요?**
    <aside>
    ❓
    
    카카오 로그인을 할 때, 카카오는 로그인이 끝나면 `redirect_uri`로 사용자를 돌려보냅니다.
    이 `redirect_uri`는 카카오 개발자 콘솔에 미리 등록해두어야 합니다.
    
    **Q1.** 만약 `redirect_uri`를 검증하지 않고 아무 URL이나 허용한다면, 어떤 공격이 가능할까요?
    
    **Q2.** 웹에서 카카오 로그인을 구현한다면, `redirect_uri`에 해당하는 페이지(예: `/auth/kakao/callback`)에서는 무엇을 해야 할까요?
    
    **Q3.** 아이두 앱에서는 `redirect_uri`가 `myapp://auth/kakao`처럼 **딥링크(Deep Link)** 형태입니다. 웹에서는 왜 `https://mysite.com/auth/callback` 형태의 일반 URL을 사용할까요? 딥링크는 무엇일까요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:
        
        Q1. 답변:** `redirect_uri` 검증이 없으면 **Authorization Code 탈취 공격**이 가능하다. 공격자가 `redirect_uri`를 자신이 제어하는 악성 서버 URL로 바꿔서 인증 요청을 만들면, 사용자가 로그인 후 Authorization Code가 공격자 서버로 전달된다. 공격자는 이 코드로 Access Token을 발급받을 수 있다.
        
        **Q2. 답변:** `/auth/kakao/callback` 페이지에서는 URL 쿼리 파라미터에서 `code` 값을 추출하고, 이를 백엔드 API로 전달해야 한다. 백엔드가 이 코드를 카카오 서버에 보내 Access Token으로 교환하고, 자체 JWT를 발급해서 프론트엔드에 내려준다. 프론트엔드는 이 토큰을 저장하고 메인 페이지로 이동하면 된다.
        
        **Q3. 답변:** 딥링크(Deep Link)는 특정 앱을 직접 열고 앱 내의 특정 화면으로 이동시켜주는 URL 스킴이다. `myapp://auth/kakao`처럼 `myapp://`으로 시작하면 브라우저가 아니라 해당 앱이 열린다. 웹은 브라우저에서 동작하기 때문에 딥링크 스킴을 쓸 수 없고, 브라우저가 접근 가능한 일반 `https://` URL을 사용해야 한다.
        
        </aside>

- **생각해보기 3 - CORS: 프론트엔드 개발자의 숙적**
    <aside>
    ❓
    
    웹 개발을 하다 보면 콘솔에 이런 에러를 자주 만나게 됩니다:
    
    ```
    Access to fetch at '<https://api.example.com/todos>'
    from origin '<http://localhost:3000>' has been blocked by CORS policy
    ```
    
    아이두 API 서버에는 이런 CORS 설정이 있습니다:
    
    ```tsx
    app.enableCors({
      origin: ["<http://localhost:3000>", "<http://localhost:8081>", "<https://www.aido.kr>",],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
    ```
    
    **Q1.** CORS는 **브라우저**가 차단하는 건가요, **서버**가 차단하는 건가요?
    
    **Q2.** 모바일 앱(React Native)에서 같은 API를 호출할 때도 CORS 에러가 발생할까요? 왜/왜 안 되나요?
    
    **Q3.** `credentials: true`가 없으면 어떤 문제가 생길까요? (힌트: 쿠키나 Authorization 헤더)
    
    **Q4.** 개발 중에 CORS 에러가 나면 어떻게 해결하나요? 프론트엔드 개발자가 할 수 있는 방법 2가지를 생각해보세요.
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:
        
        Q1. 답변: 브라우저**가 차단한다. 서버는 요청을 정상적으로 받아서 응답을 보내지만, 브라우저가 응답 헤더를 확인하고 허용되지 않은 출처면 JavaScript가 응답 데이터에 접근하지 못하도록 차단하는 것이다.
        
        **Q2. 답변: CORS 에러가 발생하지 않는다. CORS는 브라우저의 보안 정책이라서 브라우저 환경이 아닌 모바일 앱(React Native)이나 서버에서 API를 호출할 때는 적용되지 않는다.
        
        Q3. 답변:** 쿠키나 `Authorization` 헤더처럼 인증 정보(credentials)를 포함한 요청이 차단된다. 프론트엔드에서 `credentials: 'include'` 또는 `withCredentials: true`를 설정해도, 서버에 `Access-Control-Allow-Credentials: true`가 없으면 브라우저가 응답을 무시한다.
        
        **Q4. 답변:** 
        
        - **Vite/CRA의 Proxy 설정 활용** — `vite.config.ts`의 `server.proxy`에 API 경로를 등록해서 개발 서버가 요청을 대신 전달하게 한다. 서버 간 통신이라 CORS가 적용되지 않는다.
        - **백엔드 개발자에게 CORS 헤더 추가 요청** — `Access-Control-Allow-Origin`에 개발 서버 주소(`http://localhost:5173`)를 추가해달라고 요청한다. 근본적인 해결책이다.
        </aside>

- **생각해보기 4 - Access Token을 어디에 저장해야 할까요? (복습)**
    <aside>
    ❓
    
    아이두 앱은 토큰을 **SecureStore**(iOS Keychain / Android Keystore)에 저장합니다.
    OS 수준에서 암호화되는 안전한 저장소죠.
    
    그런데 **웹 프론트엔드**에는 SecureStore가 없습니다.
    웹에서 토큰을 저장할 수 있는 후보 3가지를 비교해보세요.
    
    | 저장소 | XSS에 안전? | CSRF에 안전? | 새로고침 후 유지? | 적합도 |
    | --- | --- | --- | --- | --- |
    | `localStorage` | ??? | ??? | ??? | ??? |
    | `httpOnly Cookie` | ??? | ??? | ??? | ??? |
    | JavaScript 변수 (메모리) | ??? | ??? | ??? | ??? |
    
    힌트:
    
    - **XSS**: 악성 스크립트가 페이지에 삽입되면 JavaScript로 접근 가능한 저장소는 위험합니다.
    - **CSRF**: 쿠키는 브라우저가 자동으로 전송하므로, 다른 사이트에서 위조 요청을 보낼 수 있습니다.
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        | 저장소 | XSS에 안전? | CSRF에 안전? | 새로고침 후 유지? | 적합도 |
        | --- | --- | --- | --- | --- |
        | `localStorage` | 위험 | 안전 | 유지됨 | Access Token 단독 저장은 비추천 |
        | `httpOnly Cookie` | 얀전 | 위험 (SameSite로 완화 가능) | 유지됨 | **Refresh Token 저장에 권장** |
        | JavaScript 변수 (메모리) | 안전 | 안전 | 새로고침 시 사라짐 | Access Token 단기 저장에 적합 |
        
        **이유:** 가장 권장되는 패턴은 **Access Token은 메모리(변수)에, Refresh Token은 httpOnly Cookie에** 저장하는 조합이다. Access Token은 수명이 짧아서 새로고침 시 사라져도 Refresh Token으로 재발급받으면 된다. httpOnly Cookie는 JavaScript에서 접근 자체가 불가능해서 XSS 공격으로부터 안전하고, CSRF는 `SameSite=Strict` 또는 `SameSite=Lax`로 대부분 방어할 수 있다.
        
        </aside>

- **생각해보기 5 - 동시 요청의 Race Condition (복습)**
    <aside>
    ❓
    
    메인 화면을 열면 "할 일 목록", "프로필", "알림 개수"를 **동시에** 3개 API로 요청합니다.
    Access Token이 만료된 상태라면, 3개 요청이 **동시에 401**을 받겠죠.
    
    **Q1.** 3개 요청이 **각각** 토큰 갱신을 시도하면 어떤 문제가 생길까요?
    
    (힌트: 아이두 서버는 Refresh Token을 한 번 사용하면 **즉시 폐기**하고 새 Refresh Token을 발급합니다. 이것을 **Token Rotation**이라고 합니다.)
    
    **Q2.** 이 문제를 해결하려면 프론트엔드에서 어떤 패턴을 사용해야 할까요?
    
    아래는 아이두 앱에서 실제로 사용하는 패턴의 핵심입니다:
    
    ```jsx
    let isRefreshing = false;       // 현재 갱신 중인가?
    let refreshPromise = null;      // 갱신 Promise 공유
    
    async function handleUnauthorized(failedRequest) {
      if (isRefreshing) {
        await refreshPromise;       // 다른 요청은 여기서 기다림
        return retry(failedRequest); // 갱신 끝나면 재시도
      }
    
      isRefreshing = true;
      refreshPromise = refreshTokens(); // 딱 1번만 갱신 요청
    
      await refreshPromise;
      isRefreshing = false;
      return retry(failedRequest);
    }
    ```
    
    이 패턴이 왜 필요한지 설명해보세요.
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.** Token Rotation을 사용하는 경우, 첫 번째 요청이 Refresh Token A로 갱신을 성공해서 새 Refresh Token B를 받는다. 그런데 동시에 두 번째, 세 번째 요청도 똑같이 A로 갱신을 시도하면 A는 이미 폐기됐기 때문에 에러가 발생한다. 결국 사용자가 강제 로그아웃되는 상황이 생긴다.
        
        **Q2 답변.** `isRefreshing` 플래그와 공유 Promise를 이용한 **싱글턴 갱신 패턴**이 필요하다. 첫 번째 401을 받은 요청만 실제로 토큰 갱신을 하고, 나머지 요청들은 갱신이 완료될 때까지 기다렸다가 새 토큰으로 재시도하는 방식이다. 제시된 코드가 정확히 그 패턴을 구현한 것으로, `isRefreshing`이 `true`면 이미 갱신 중이니 `refreshPromise`를 `await`하고 기다리는 방식이다.
        
        </aside>

- **생각해보기 6 - Protected Route (보호된 라우트)**
    <aside>
    ❓
    
    아이두 앱은 로그인 여부에 따라 보여주는 화면이 완전히 다릅니다.
    
    ```
    인증 상태: 'loading'          → 스플래시 화면 (로딩 중)
    인증 상태: 'authenticated'    → 메인 앱 (할 일 목록, 설정 등)
    인증 상태: 'unauthenticated'  → 로그인/회원가입 화면
    ```
    
    **Q1.** React 웹 앱에서 비슷한 패턴을 구현한다면 어떻게 할까요? `react-router-dom`을 사용한다고 가정하고, 아래 의사코드의 빈칸을 채워보세요. (아래 미션에서 더 좋은 패턴을 배울 예정)
    
    ```jsx
    function ProtectedRoute({ children }) {
      const { status } = useAuth();
    
      if (status === 'loading') {
        return <???>;
      }
    
      if (status === '???') {
        return <Navigate to="/???" replace />;
      }
    
      return children;
    }
    
    // 사용 예시
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <???>
          <DashboardPage />
        </???>
      } />
    </Routes>
    ```
    
    **Q2.** 초기 상태가 `'loading'`이 아니라 `'unauthenticated'`로 시작하면 어떤 문제가 생길까요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        Q1 답변.
        
        ```tsx
        function ProtectedRoute({ children }) {
          const { status } = useAuth();
        
          if (status === 'loading') {
            return <LoadingSpinner />;
          }
        
          if (status === 'unauthenticated') {
            return <Navigate to="/login" replace />;
          }
        
          return children;
        }
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
        ```
        
        Q2 답변. 초기 상태가 `'unauthenticated'`로 시작하면, 앱이 로컬 스토리지나 쿠키에서 토큰을 아직 확인하기 전에 무조건 로그인 페이지로 이동해버린다. 실제로는 로그인된 사용자인데도 매번 로그인 페이지로 이동하는 UX 버그가 생긴다. 그래서 초기값은 반드시 `'loading'`으로 시작해서 인증 상태 확인이 끝난 후에 판단해야 한다.
        
        </aside>

- **생각해보기 7 - RBAC(역할 기반 접근 제어)**
    <aside>
    ❓
    
    아이두에는 일반 사용자(`USER`)와 관리자(`ADMIN`) 두 가지 역할이 있습니다.
    관리자만 접근할 수 있는 기능(예: 전체 사용자 관리, 통계 대시보드)이 있죠.
    
    **Q1.** 프론트엔드에서 역할(role)에 따라 메뉴나 버튼을 숨기는 것만으로 보안이 충분할까요? 왜/왜 안 될까요?
    
    **Q2.** 웹에서 관리자 전용 페이지(`/admin/users`)를 구현한다면, **Protected Route**를 어떻게 확장해야 할까요? 아래 의사코드를 완성해보세요.
    
    ```jsx
    function AdminRoute({ children }) {
      const { status, role } = useAuth();
    
      if (status === 'loading') return <LoadingSpinner />;
      if (status === 'unauthenticated') return <Navigate to="/???" />;
      if (role !== '???') return <Navigate to="/???" />;  // 권한 없음
    
      return children;
    }
    ```
    
    **TIP: 실무에서는 DAL(Data Access Layer)에서 권한 체크를 하는 패턴이 많이 쓰입니다. DAL에 대해서도 알아보세요! (Next.js에서는 proxy(구 middleware)나 Server Action 내에서 인증/인가를 처리하는 패턴도 많이 활용됩니다.)
    
    Q3.** 일반 사용자가 직접 `GET /v1/admin/users` API를 호출하면 어떤 HTTP 상태 코드가 돌아올까요? 401인가요? 403인가요? 차이는 뭔가요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.** 충분하지 않다. 프론트엔드에서 UI를 숨기는 건 단순히 화면 표시를 제어하는 것이지, 실제 데이터 접근을 막는 것이 아니다. 개발자 도구나 Postman으로 직접 API를 호출하면 UI 숨김은 아무 의미가 없다. 권한 검증은 반드시 **백엔드 서버**에서 이루어져야 한다. 프론트엔드의 역할 제어는 "편의성"이지 "보안"이 아니다.
        ****
        **Q2 답변.**
        
        ```tsx
        function AdminRoute({ children }) {
          const { status, role } = useAuth();
        
          if (status === 'loading') return <LoadingSpinner />;
          if (status === 'unauthenticated') return <Navigate to="/login" />;
          if (role !== 'ADMIN') return <Navigate to="/" />;
        
          return children;
        }
        ```
        
        **Q3** 답변. **403 Forbidden**이 돌아와야 한다. 401과 403의 차이는 다음과 같다.
        
        - **401 Unauthorized** → "누구인지 모름" — 인증이 안 된 상태 (토큰 없음 또는 만료)
        - **403 Forbidden** → "누구인지 알지만 권한 없음" — 인증은 됐지만 해당 리소스에 접근할 권한이 없는 상태
        
        일반 사용자가 로그인은 했지만 admin 권한이 없는 경우이므로 **403**이 맞다.
        
        </aside>

- **생각해보기 8 - Token Rotation: Refresh Token을 왜 한 번 쓰면 폐기하나요?**
    <aside>
    ❓
    
    아이두 서버는 토큰 갱신 시 **Token Rotation**을 사용합니다:
    
    - Refresh Token A로 갱신 요청 → 새 Access Token + **새 Refresh Token B** 발급, **A는 즉시 폐기**
    
    만약 Refresh Token을 **재사용 가능**하게 두면 (폐기 안 하면) 어떤 위험이 있을까요?
    
    아래 시나리오를 따라가 보세요:
    
    ```
    시간 0: 정상 사용자가 Refresh Token A로 갱신
            → 새 Token B 발급, A는 폐기됨
    
    시간 1: 해커가 탈취한 Token A로 갱신 시도
            → 서버: "이미 사용된 토큰이다!" → ???
    ```
    
    **Q1.** 시간 1에서 서버는 어떻게 대응해야 할까요?
    
    **Q2.** Token Rotation이 없다면 (A를 폐기하지 않으면), 해커는 Token A를 얼마나 오래 사용할 수 있나요?
    
    **Q3.** 프론트엔드에서는 Token Rotation 때문에 주의해야 할 점이 있나요? (힌트: 생각해보기 6의 Race Condition)
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.** 서버는 "이미 사용된(폐기된) Refresh Token으로 갱신을 시도했다"는 것 자체를 **보안 침해 신호**로 판단해야 한다. 단순히 에러를 반환하는 게 아니라, 해당 사용자의 **모든 Refresh Token을 즉시 무효화(로그아웃 처리)**해야 한다. 정상 사용자도 함께 로그아웃되지만, 이것이 해커의 세션까지 완전히 차단하는 가장 안전한 대응이다.
        ****
        **Q2 답변. Refresh Token A의 만료 기간 내내 해커가 무제한으로 사용할 수 있다. 보통 Refresh Token은 수일~수주 단위로 유효하므로, 그 기간 동안 계속해서 새 Access Token을 발급받을 수 있는 것이다.**
        
        **Q3** 답변. 생각해보기 5의 Race Condition 때문에 주의해야 한다. 여러 요청이 동시에 401을 받으면 각각 Refresh Token A로 갱신을 시도하는데, Token Rotation이 있으면 첫 번째만 성공하고 나머지는 이미 폐기된 A를 쓰기 때문에 실패해서 강제 로그아웃될 수 있다. `isRefreshing` 패턴으로 갱신을 딱 한 번만 하도록 제어하는 것이 필수다.
        
        </aside>

- **생각해보기 9 - 웹 vs 앱, 보안 관점에서 뭐가 다를까요?**
    <aside>
    ❓
    
    아이두 앱(모바일)과 웹 프론트엔드의 보안 환경은 꽤 다릅니다.
    아래 표를 채워보세요.
    
    | 항목 | 모바일 앱 (아이두) | 웹 (React 등) |
    | --- | --- | --- |
    | 토큰 저장소 | SecureStore (OS 암호화) | ??? |
    | XSS 공격 위험 | 거의 없음 (웹뷰 아님) | ??? |
    | CSRF 공격 위험 | 해당 없음 | ??? |
    | CORS 적용 | 해당 없음 (브라우저 아님) | ??? |
    | 코드 노출 | APK/IPA 디컴파일 가능 | ??? |
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        | 항목 | 모바일 앱 (아이두) | 웹 (React 등) |
        | --- | --- | --- |
        | 토큰 저장소 | SecureStore (OS 암호화) | localStorage / httpOnly Cookie / 메모리 변수 (트레이드오프 있음) |
        | XSS 공격 위험 | 거의 없음 (웹뷰 아님) | **높음** — 악성 스크립트가 JS로 접근 가능한 저장소 탈취 가능 |
        | CSRF 공격 위험 | 해당 없음 | **있음** — 쿠키 사용 시 SameSite 설정으로 방어 필요 |
        | CORS 적용 | 해당 없음 (브라우저 아님) | **적용됨** — 브라우저가 다른 출처 요청을 제한 |
        | 코드 노출 | APK/IPA 디컴파일 가능 | **번들 파일(JS)이 브라우저에서 직접 열람 가능** — 환경변수도 빌드 시 노출 위험 |
        
        **이유:** 
        
        웹과 모바일 앱은 실행 환경 자체가 다르기 때문에 보안 위협의 종류와 대응 방식도 달라진다.
        토큰 저장소는 모바일과 달리 웹에서는 OS 수준의 암호화 저장소가 없어서 localStorage, httpOnly Cookie, 메모리 변수 각각의 트레이드오프를 고려해 조합해서 사용해야 한다.
        XSS는 브라우저가 HTML/JS를 직접 파싱·실행하는 구조라서 악성 스크립트가 삽입되면 JS로 접근 가능한 저장소가 탈취될 수 있다. 모바일 앱은 외부 스크립트가 실행될 여지가 없다.
        CSRF는 브라우저가 쿠키를 자동으로 요청에 첨부하는 특성 때문에 발생한다. 모바일 앱은 이런 자동 첨부 동작 자체가 없어서 해당 없다.
        CORS는 브라우저의 SOP 정책에서 비롯된 것이라 모바일 앱처럼 브라우저가 아닌 환경에서는 적용되지 않는다.
        코드 노출은 웹의 경우 빌드된 JS 번들이 브라우저에서 그대로 열람 가능하고, 환경변수도 빌드 시 번들에 포함되어 노출될 수 있으므로 민감한 정보를 환경변수에 담으면 안 된다.
        
        </aside>

- **종합 과제 - OAuth 2.0 Authorization Code Flow 전체 흐름 그리기**
    <aside>
    ❓
    
    **소셜 로그인(OAuth 2.0 Authorization Code Flow)**의 전체 흐름을 시퀀스 다이어그램으로 그려보세요.
    (앱 → 소셜 서버 → 백엔드 서버 흐름을 포함해야 합니다)
    
    답변 제출 양식) 종이, 노션, [draw.io](http://draw.io/), mermaid 등 아무 도구나 사용해도 좋습니다
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **실제 시퀀스 다이어그램을 첨부해주세요 (아래는 Mermaid 예시입니다)**
        
        ![스크린샷 2026-03-29 오전 2.51.48.png](attachment:c1bac03e-a6b4-42c0-bc4e-b1b0178484ce:스크린샷_2026-03-29_오전_2.51.48.png)
        
        **나의 답변:** 
        
        ```mermaid
        sequenceDiagram
            actor User as 사용자
            participant App as React 앱 (클라이언트)
            participant Backend as 백엔드 서버
            participant OAuth as 소셜 OAuth 서버 (Google/Kakao)
            participant Resource as 리소스 서버 (사용자 정보 API)
        
            User->>App: 소셜 로그인 버튼 클릭
            App->>App: code_verifier 생성 (PKCE용)
            App->>App: code_challenge = SHA256(code_verifier)
            App->>OAuth: 리다이렉트 (client_id, redirect_uri, scope, code_challenge)
            OAuth->>User: 로그인 및 권한 동의 화면
            User->>OAuth: 계정 로그인 + 권한 동의
            OAuth->>App: redirect_uri로 리다이렉트 (Authorization Code 전달)
            App->>Backend: Authorization Code + code_verifier 전달
            Backend->>OAuth: 토큰 요청 (code, code_verifier, client_secret)
            OAuth->>OAuth: code_verifier 검증
            OAuth-->>Backend: Access Token + Refresh Token 발급
            Backend->>Resource: Access Token으로 사용자 정보 요청
            Resource-->>Backend: 사용자 정보 응답
            Backend->>Backend: 자체 JWT 생성
            Backend-->>App: 자체 토큰 + 사용자 정보 응답
            App->>App: 토큰 저장 (메모리 / httpOnly Cookie)
            App->>User: 로그인 완료, 메인 화면으로 이동
        ```
        
        </aside>
