# 낙관적 업데이트 (Optimistic Update)

> 참고 공식 문서
>
> - [Optimistic Updates | TanStack Query v5 Docs](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates)
> - [개발자 매튜 | 실제 서비스에서 낙관적 업데이트(Optimistic Update)를 활용하여, 유저의 답답함 줄이기](https://www.yolog.co.kr/post/optimistic-update)

---

## 낙관적 업데이트란?

> **"어차피 요청은 성공할 거야!"** 라고 가정하고, 서버 응답이 오기 전에 **클라이언트 UI를 먼저 바꿔버리는** UX 개선 기법임

사용자가 버튼을 클릭하는 **동시에** 화면이 변경되어 네트워크 지연이 0처럼 느껴지게 만드는 것이 핵심임

만약 요청이 실패하면, 미리 바꿔둔 UI를 **원래 상태로 되돌리는(롤백)** 처리를 함

---

## 장단점

| 구분     | 내용                                                                        |
| -------- | --------------------------------------------------------------------------- |
| **장점** | 사용자가 즉각적인 피드백을 받아 앱이 매우 빠르다고 느낌                     |
| **장점** | 네트워크 지연을 체감하지 못하게 해 UX가 크게 향상됨                         |
| **단점** | 실패 시 원래 상태로 정확히 되돌리는 롤백 로직 구현이 필요함                 |
| **단점** | 요청이 처리되는 동안 클라이언트 UI와 서버 실제 데이터가 일시적으로 불일치함 |

---

## TanStack Query에서 구현하기

`onMutate → (요청 진행) → onError 또는 onSuccess → onSettled` 순서로 동작함

| 옵션        | 낙관적 업데이트에서의 역할                                       |
| ----------- | ---------------------------------------------------------------- |
| `onMutate`  | 이전 데이터(`context`) 저장 + `setQueryData`로 캐시 즉시 변경    |
| `onError`   | `context`에서 이전 데이터를 꺼내 `setQueryData`로 UI 롤백        |
| `onSettled` | 성공·실패 무관하게 `invalidateQueries`로 서버 최종 상태와 동기화 |

### onMutate → onError → onSettled 흐름

```tsx
const qc = useQueryClient();

const { mutate } = useMutation({
  mutationFn: createTodo,

  // 1단계: 요청 직전 — 낙관적으로 캐시 변경
  onMutate: async (newTodo) => {
    // 진행 중인 리페치가 낙관적 업데이트를 덮어쓰지 않도록 취소
    await qc.cancelQueries({ queryKey: ['todos'] });

    // 롤백에 사용할 이전 데이터 저장
    const previousTodos = qc.getQueryData<Todo[]>(['todos']);

    // 캐시를 즉시 변경 → UI가 바로 반영됨
    qc.setQueryData<Todo[]>(['todos'], (old = []) => [...old, { id: Date.now(), ...newTodo }]);

    // context로 이전 데이터 전달
    return { previousTodos };
  },

  // 2단계: 요청 실패 시 — 이전 데이터로 롤백
  onError: (_err, _newTodo, context) => {
    if (context?.previousTodos) {
      qc.setQueryData(['todos'], context.previousTodos);
    }
  },

  // 3단계: 성공·실패 무관 — 서버 최종 상태와 동기화
  onSettled: () => {
    qc.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### 각 단계의 역할

| 단계 | 옵션        | 역할                                                                               |
| ---- | ----------- | ---------------------------------------------------------------------------------- |
| 1    | `onMutate`  | 이전 데이터 저장 (`getQueryData`) → 캐시 즉시 수정 (`setQueryData`) → context 반환 |
| 2    | `onError`   | context에서 이전 데이터 꺼내 캐시 복구 (`setQueryData`)                            |
| 3    | `onSettled` | 서버 최종 상태로 확실하게 동기화 (`invalidateQueries`)                             |

---

## 어떤 상황에서 낙관적 업데이트가 효율적일까?

### 효율적인 상황

| 상황                              | 이유                                                 |
| --------------------------------- | ---------------------------------------------------- |
| **좋아요 / 팔로우 / 북마크 토글** | 성공 가능성이 매우 높고, 실패해도 롤백이 단순함      |
| **할 일 완료 체크**               | 상태가 단순하고 사용자 경험 향상 효과가 큼           |
| **댓글 작성**                     | 작성자 본인은 즉시 확인해야 하는 콘텐츠              |
| **소셜 반응(이모지 등)**          | 빈번하게 발생하고 지연이 체감되면 앱이 둔하게 느껴짐 |
| **네트워크가 느린 환경**          | 지연 체감을 없애 UX를 크게 향상시킬 수 있음          |

### 피해야 하는 상황

| 상황                                      | 이유                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| **결제·송금·주문**                        | 실패 시 롤백이 사용자에게 혼란을 줄 수 있고, 정확성이 UX 속도보다 중요함    |
| **서버 측 유효성 검증이 복잡한 경우**     | 클라이언트에서 성공을 예측하기 어려워 롤백이 빈번해짐                       |
| **충돌 가능성이 높은 공유 리소스**        | 다수의 사용자가 동시에 같은 데이터를 수정하는 경우 불일치가 심해짐          |
| **되돌리기 어려운 삭제 작업**             | 삭제 후 롤백했을 때 사용자가 혼란스러워할 수 있음                           |
| **응답 데이터를 즉시 사용해야 하는 경우** | 서버가 부여하는 ID·타임스탬프 등이 즉시 필요한 경우 임시 값 처리가 복잡해짐 |

---

## ToDo 생성 및 좋아요 토글 롤백 전략 설계

### ToDo 생성

```tsx
onMutate: async (newTodo) => {
  await qc.cancelQueries({ queryKey: ['todos'] });
  const previous = qc.getQueryData<Todo[]>(['todos']);

  // 서버 ID가 아직 없으므로 임시 ID 사용
  qc.setQueryData<Todo[]>(['todos'], (old = []) => [
    ...old,
    { id: -Date.now(), ...newTodo, _optimistic: true },
  ]);

  return { previous };
},
onError: (_err, _vars, context) => {
  // 임시로 추가했던 항목을 포함한 이전 목록 전체 복원
  qc.setQueryData(['todos'], context?.previous);
},
onSettled: () => {
  // 서버가 부여한 실제 ID로 확정된 목록을 가져옴
  qc.invalidateQueries({ queryKey: ['todos'] });
},
```

- 임시 ID(`-Date.now()`)를 사용해 낙관적 항목을 추가함
- 실패 시 이전 목록 전체를 통째로 복원하여 임시 항목을 제거함
- `onSettled`에서 리페치해 서버가 부여한 실제 ID로 교체함

### 좋아요 토글

```tsx
onMutate: async ({ lpId, isLiked }) => {
  await qc.cancelQueries({ queryKey: ['lp', lpId] });
  const previous = qc.getQueryData<LpDetail>(['lp', lpId]);

  // liked 상태와 카운트를 즉시 반전
  qc.setQueryData<LpDetail>(['lp', lpId], (old) =>
    old
      ? {
          ...old,
          isLiked: !old.isLiked,
          likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        }
      : old,
  );

  return { previous };
},
onError: (_err, { lpId }, context) => {
  // 반전 전 상태로 되돌림
  qc.setQueryData(['lp', lpId], context?.previous);
},
onSettled: (_data, _err, { lpId }) => {
  qc.invalidateQueries({ queryKey: ['lp', lpId] });
},
```

- 토글은 성공 가능성이 매우 높아 낙관적 업데이트 효과가 큼
- 실패 시 저장해둔 `previous` 그대로 복원하면 되어 롤백 로직이 단순함

---

## 한 줄 정리

- **낙관적 업데이트** — 서버 응답 전에 UI를 먼저 변경해 체감 속도를 높이고, 실패 시 `onError`에서 롤백하는 UX 패턴임
- **onMutate → onError → onSettled** — 낙관적 업데이트의 핵심 3단계 라이프사이클임
- **도입 기준** — 성공 가능성이 높고 롤백이 단순한 작업(토글·체크 등)에는 효과적이고, 결제·복잡한 검증이 필요한 작업에는 지양함
