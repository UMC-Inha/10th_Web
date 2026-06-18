# Vercel을 활용한 배포와 CI/CD

> 참고: [Vercel Documentation](https://vercel.com/docs) · [GitHub Actions documentation](https://docs.github.com/en/actions)

---

## 배포(Deployment)는 무엇인가요?

**배포(Deployment)** 는 개발자가 만든 코드를 **실제 사용자**들이 사용할 수 있도록 인터넷에 공개하는 과정이다. localhost에서만 돌아가던 웹사이트를, 누구나 URL로 접속할 수 있는 서버 환경으로 옮기는 작업이다.

### 특징

| 단계 | 설명 |
|---|---|
| **빌드(Build)** | React·TypeScript 등을 브라우저가 실행 가능한 HTML/CSS/JS로 변환 |
| **호스팅(Hosting)** | 빌드 결과물을 24시간 켜져 있는 서버에 올려 요청에 응답 |
| **접근성** | 고유 도메인(예: `my-app.vercel.app`)으로 어디서든 접속 가능 |

### 과거 방식의 단점

- 서버 직접 구매·리눅스 설치·네트워크 설정 필요
- 코드 수정마다 수동으로 파일 업로드 → 실수·누락 빈번
- HTTPS, CDN, 캐시 등을 직접 구성해야 함

---

## Vercel은 무엇인가요?

**Vercel**은 프론트엔드 개발자가 **복잡한 서버 설정 없이** 웹사이트를 빠르게 배포할 수 있게 해주는 플랫폼이다. Next.js를 만든 팀에서 개발했기 때문에 React·Vite·Next.js 프로젝트와 궁합이 좋다.

### 특징

- **GitHub 연동**: Push만 하면 Vercel이 자동으로 빌드·배포
- **자동 HTTPS**: SSL 인증서 자동 발급·갱신
- **Preview Deployment**: PR/브랜치마다 미리보기 URL 생성 → 리뷰·QA에 유용
- **글로벌 CDN**: Edge Network로 전 세계 사용자에게 빠른 응답
- **Zero Config**: Vite/React 등 프레임워크 자동 감지 (대부분 설정 없이 동작)

### Vite + React 프로젝트 배포 흐름

```
1. GitHub에 코드 Push
2. Vercel이 저장소 연결 감지
3. npm install → npm run build 실행
4. dist/ 폴더를 CDN에 배포
5. https://프로젝트명.vercel.app 에서 접속 가능
```

### Vercel 대시보드에서 하는 일

1. [vercel.com](https://vercel.com) 가입 (GitHub 계정 연동)
2. **Add New Project** → GitHub 레포 선택
3. Framework Preset: **Vite** (자동 감지)
4. Build Command: `npm run build` / Output Directory: `dist`
5. Deploy 클릭

환경 변수(`VITE_API_URL` 등)는 **Project Settings → Environment Variables** 에서 설정한다.

---

## CI / CD는 무엇인가요?

**CI/CD**는 개발부터 배포까지의 과정을 **자동화**하여, 더 자주·더 안전하게 코드를 배포할 수 있게 하는 방법론이다.

### CI (Continuous Integration — 지속적 통합)

- 여러 개발자의 코드를 **자주, 정기적으로 main/develop에 Merge**
- Merge/Push 시 **자동으로 테스트·린트·빌드** 실행
- “문지기” 역할 — 버그·빌드 실패를 배포 전에 차단

```
개발자 Push → GitHub Actions 실행 → lint / test / build → 성공 시 Merge 허용
```

### CD (Continuous Deployment / Delivery — 지속적 배포·전달)

- CI를 통과한 코드를 **자동으로 배포 환경에 반영**
- Delivery: 배포 **가능 상태**까지 자동화 (수동 배포 버튼은 사람이 누름)
- Deployment: **프로덕션까지 자동** 반영

```
CI 통과 → Vercel Preview(브랜치) 또는 Production(main) 배포
```

### Vercel만 쓸 때 vs GitHub Actions + Vercel

| | Vercel 기본 연동 | GitHub Actions 추가 |
|---|---|---|
| 빌드·배포 | Push 시 자동 | workflow에서 제어 가능 |
| 테스트 | 별도 설정 없음 | CI 단계에서 test/lint 실행 |
| Preview | PR마다 자동 생성 | 동일 |
| 커스터마이징 | 제한적 | `.github/workflows/*.yml`로 자유롭게 구성 |

소규모 프론트엔드 프로젝트는 **Vercel Git 연동만으로도 충분**하고, 팀 프로젝트·테스트 필수 환경에서는 **GitHub Actions CI + Vercel CD** 조합이 일반적이다.

---

## 배포 vs Vercel vs CI/CD 한눈에 비교

| 항목 | 배포 (Deployment) | Vercel | CI / CD |
|---|---|---|---|
| **핵심 개념** | 서비스 공개 | 배포 플랫폼 | 자동화 프로세스 |
| **역할** | 로컬 → 세상 밖으로 | 배포를 쉽게 해주는 도구 | 개발~배포 파이프라인 |
| **비유** | 가게 오픈 | 인테리어·설비 갖춘 매장 임대 | 청소·요리·서빙 자동화 |
| **난이도** | (과거) 매우 높음 | 매우 낮음 | 설정에 따라 다름 |
| **주요 작업** | 파일 업로드, 서버 실행 | GitHub 레포 연결 | 테스트, workflow(.yml) 설정 |

---

## Vercel과 CI/CD가 권장되는 이유

현대 프론트엔드 개발의 핵심은 **생산성**과 **안정성**이다.

> “개발자는 기능 구현에 집중하고, 빌드·테스트·배포는 도구가 처리한다.”

- **Vercel**: 인프라 구축 시간 절약, HTTPS·CDN·Preview 자동 제공
- **CI/CD**: 사람이 놓치기 쉬운 lint/test/build를 Push마다 자동 검증
- **Preview URL**: PR 리뷰어가 실제 동작을 바로 확인 → 버그 조기 발견

### 언제 쓰면 좋은가

- 포트폴리오·미션 결과물을 **URL로 제출**해야 할 때
- 코드 수정마다 **수동 빌드·업로드**가 번거로울 때
- 팀 프로젝트에서 **Merge 전 테스트**를 강제하고 싶을 때
- 실무와 비슷한 **개발 → 검증 → 배포** 흐름을 경험하고 싶을 때

### 과할 수 있는 경우

- 로컬 전용 도구·CLI (배포 불필요)
- 순수 알고리즘·문법 학습 단계 (인프라 불필요)

---

## GitHub Actions CI 예시 (Vite + React)

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

- `npm ci`: lockfile 기준으로 정확한 의존성 설치 (CI에서 `npm install`보다 권장)
- `npm run lint`, `npm run build`: 린트·TypeScript·Vite 빌드 성공 여부 확인
- main 브랜치 Push 후 Vercel이 자동으로 Production 배포 (Git 연동 시)

---

## 환경 변수 주의사항 (Vite)

```env
# .env.local (로컬 전용, gitignore 대상)
VITE_API_BASE_URL=https://api.example.com
```

- Vite는 **`VITE_` 접두사**가 붙은 변수만 클라이언트에 노출
- Vercel 대시보드에서도 동일한 key로 Environment Variables 등록
- API Secret·Private Key는 **절대 `VITE_`로 노출하지 않음** (클라이언트 번들에 포함됨)

---

## 배포 후 확인 체크리스트

- [ ] Production URL 접속 시 화면 정상 렌더
- [ ] API 호출(CORS, base URL) 정상 동작
- [ ] 환경 변수 누락 없음 (Vercel Settings 확인)
- [ ] SPA 라우팅: 새로고침 시 404 없음 (Vercel은 Vite/React SPA 기본 rewrites 자동 처리)
- [ ] Preview URL(PRs)에서도 동일하게 동작

---

## 추가로 학습한 내용

### Preview Deployment의 실무 활용

PR을 올리면 Vercel이 **브랜치별 Preview URL**을 자동 생성한다. 코드 리뷰어가 “로컬에서 안 돌려봐도” 실제 배포 환경과 동일한 URL에서 UI·API 연동을 확인할 수 있어, **“내 컴퓨터에선 됐는데…”** 류의 환경 차이 문제를 줄여준다.

### Production vs Preview vs Development

| 환경 | 트리거 | 용도 |
|---|---|---|
| Production | `main` Push (또는 Merge) | 실제 서비스 |
| Preview | PR·feature 브랜치 Push | 리뷰·QA·데모 |
| Development | `vercel dev` 로컬 | 로컬에서 Vercel 환경 시뮬레이션 |

Vercel 대시보드에서 환경별로 **다른 API URL**을 넣을 수 있다 (예: Preview → staging API, Production → production API).

### SPA 404 이슈

React Router 등 클라이언트 라우팅 SPA는 `/lp/123` 같은 경로로 **직접 접속·새로고침** 시 서버가 해당 파일을 찾지 못해 404가 날 수 있다. Vercel은 `vercel.json` 또는 프레임워크 preset으로 **모든 경로를 `index.html`로 rewrite** 해 SPA fallback을 처리한다.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Vite + React preset 사용 시 대부분 자동 적용되지만, 커스텀 설정 시 확인이 필요하다.

### CI/CD와 프론트엔드 테스트

실무에서는 CI 단계에서 아래를 자주 함께 돌린다.

- `npm run lint` — ESLint
- `npm run build` — TypeScript + Vite 빌드 성공
- (선택) `npm test` — Vitest/Jest 단위 테스트

**빌드가 CI에서 통과해야 Vercel 배포도 안전**하다는 점이 CI/CD의 핵심이다. 로컬에서만 되고 CI에서 터지는 타입 에러·import 오류를 배포 전에 잡을 수 있다.

### Vercel vs Netlify vs GitHub Pages (간단 비교)

| | Vercel | Netlify | GitHub Pages |
|---|---|---|---|
| React/Vite | 매우 좋음 | 좋음 | 가능 (설정 필요) |
| Preview URL | PR마다 자동 | PR마다 자동 | 없음 |
| HTTPS | 자동 | 자동 | 자동 |
| 무료 tier | Hobby (개인·소규모) | Free tier | Public repo 무료 |
| 적합 | React SPA·Next.js | SPA·Jamstack | 정적 사이트·문서 |

포트폴리오·미션 SPA 배포에는 **Vercel 또는 Netlify**가 GitHub Pages보다 설정 부담이 적고 Preview까지 지원해 실무에 가깝다.

---

## 🍠 실습 기록하기

- **깃허브 주소**: _(본인 레포 URL 작성)_
- **배포 URL**: _(예: https://my-app.vercel.app)_
- **실습 내용**: GitHub Push → Vercel 자동 배포, (선택) GitHub Actions CI workflow 추가
- **확인 사항**: 환경 변수, SPA 라우팅, Preview URL 동작
- **실행 영상 / 스크린샷**: _(Vercel 대시보드·배포된 사이트 캡처)_
