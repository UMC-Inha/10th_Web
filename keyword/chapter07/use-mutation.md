# useMutation

> 참고 공식 문서
> - [Mutations | TanStack Query v5 Docs](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)
> - [useQueryClient | TanStack Query v5 Docs](https://tanstack.com/query/v5/docs/framework/react/reference/useQueryClient)

---

## useMutation은 무엇인가요?

서버에 데이터를 **변경(POST · PUT · PATCH · DELETE)** 하는 작업을 수행하고, 그 결과(로딩·성공·에러 상태)를 체계적으로 관리해주는 훅임

`useQuery`가 데이터를 **읽는** 역할이라면, `useMutation`은 데이터를 **쓰는** 역할을 담당함

### 서버 상태 관리가 없던 시절의 문제

```
1. 할 일 추가 요청 (POST) 성공 ✅
2. 서버: 10개 → 11개 (서버 상태 업데이트됨)
3. 화면: 여전히 10개만 표시 ❌ (클라이언트 상태는 그대로)
4. 사용자는 새 항목을 볼 수 없음 → fetchTodos를 수동으로 재호출해야 함
```

`useMutation`의 `onSuccess` + `invalidateQueries` 조합으로 이 과정을 자동화할 수 있음

---

## 기본 사용법

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const qc = useQueryClient();

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: (newTodo: { title: string; completed: boolean }) =>
    fetch('/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    }).then((res) => res.json()),

  onSuccess: () => {
    // ['todos'] 캐시를 stale 처리 → 자동 리페치
    qc.invalidateQueries({ queryKey: ['todos'] });
  },
});

// 실행
mutate({ title: '운동하기', completed: false });
```

---

## 주요 반환값

| 반환값 | 설명 |
|--------|------|
| `mutate(variables)` | 변경 작업을 실행하는 함수 (fire-and-forget) |
| `mutateAsync(variables)` | `mutate`와 동일하지만 Promise를 반환 (await 가능) |
| `isPending` | 요청이 진행 중일 때 `true` |
| `isSuccess` | 요청이 성공했을 때 `true` |
| `isError` | 요청이 실패했을 때 `true` |
| `data` | 성공 시 서버 응답 데이터 |
| `error` | 실패 시 에러 객체 |
| `reset` | 상태를 초기값(idle)으로 되돌리는 함수 |

---

## 핵심 옵션

### 1. 필수 옵션

| 옵션 | 설명 |
|------|------|
| `mutationFn` | 실제 서버에 변경 요청을 보내는 **비동기 함수** (POST·PUT·DELETE 등). 가장 핵심 옵션임 |

### 2. 라이프사이클 옵션

`mutate()` 실행 시 각 시점에 자동으로 호출되는 콜백 함수들임

| 옵션 | 실행 시점 | 핵심 용도 |
|------|-----------|-----------|
| `onMutate` | 요청이 서버로 보내지기 **직전** | 낙관적 업데이트 적용, 롤백용 이전 데이터 저장 |
| `onSuccess` | 요청 **성공** 시 | `invalidateQueries`로 관련 캐시 동기화 |
| `onError` | 요청 **실패** 시 | 에러 알림, `onMutate`에서 저장한 데이터로 롤백 |
| `onSettled` | 성공·실패 **무관하게 완료** 시 | 최종 정리 작업, 로딩 상태 해제 |

```tsx
useMutation({
  mutationFn: createTodo,
  onMutate: async (newTodo) => {
    await qc.cancelQueries({ queryKey: ['todos'] });
    const previous = qc.getQueryData(['todos']);
    qc.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previous };
  },
  onError: (_err, _newTodo, context) => {
    qc.setQueryData(['todos'], context?.previous);
  },
  onSettled: () => {
    qc.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### 3. 설정 옵션

| 옵션 | 설명 |
|------|------|
| `mutationKey` | 뮤테이션의 고유 키. Devtools에서 구별하거나 전역 콜백에서 분기 처리할 때 사용 |
| `retry` | 실패 시 자동 재시도 횟수 (기본값 `0` — useQuery와 달리 기본 재시도 없음) |
| `retryDelay` | 재시도 사이 대기 시간 |
| `throwOnError` | `true`로 설정 시 에러를 ErrorBoundary로 전파 |
| `meta` | 디버깅·로깅용 추가 메타 정보 |

<aside>

`useQuery`의 기본 `retry`는 3이지만, `useMutation`의 기본 `retry`는 **0**임

데이터 변경은 멱등성이 보장되지 않는 경우가 많아 자동 재시도를 기본 비활성화한 것임

</aside>

---

## invalidateQueries의 동작 원리

```
1. 사용자가 '추가' 버튼 클릭 → mutate() 실행
2. mutationFn이 POST 요청을 서버로 전송 (isPending = true)
3. 서버 응답 성공 → onSuccess 콜백 실행
4. invalidateQueries({ queryKey: ['todos'] }) 호출
   → TanStack Query가 ['todos'] 캐시를 stale 처리
5. 해당 쿼리를 구독 중인 컴포넌트가 있으면 자동 리페치
6. 화면에 최신 데이터 자동 반영 ✅
```

개발자가 수동으로 `fetchTodos`를 재호출하거나 상태를 직접 조작할 필요가 없음

---

## 한 줄 정리

- **useMutation** — 서버 데이터 변경(POST·PUT·DELETE) 작업과 그 라이프사이클을 표준화해주는 훅임
- **onSuccess + invalidateQueries** — Mutation 성공 후 관련 캐시를 stale 처리해 자동 리페치를 트리거함
- **라이프사이클 순서** — `onMutate → (요청 진행) → onSuccess 또는 onError → onSettled`
