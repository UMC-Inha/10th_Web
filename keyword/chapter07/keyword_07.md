- 어떤 상황에서 **낙관적 업데이트(OptimisticUpdate)가 효율적일까요? 🍠**
  > **낙관적 업데이트(OptimisticUpdate)가 효율적인 상황은 언제일까요? 🍠**
    <aside>
    📌
    
    낙관적 업데이트는 **서버 요청이 성공할 가능성이 높고, 사용자가 즉각적인 반응을 기대하는 기능**에서 효율적이에요!
    
    예시) 좋아요, 북마크, 팔로우, 체크박스 완료 처리, 댓글 작성, ToDo 생성
    → 사용자가 버튼을 눌렀을 때 바로 화면이 바뀌어야 자연스러운 기능에 적합해요! 서버 응답을 기다린 뒤 UI를 바꾸면 사용자는 앱이 느리다고 느낄 수 있기 때문이에요.
    
    특히!
    네트워크가 조금 느리거나 서버 응답 시간이 긴 상황에서도 UI를 먼저 바꿔주면 사용자는 “내 행동이 바로 반영됐다”고 느끼게 돼요.
    = 즉, 낙관적 업데이트는 실제 처리 속도보다 **사용자가 체감하는 반응성**을 높이기 위한 패턴이에요!
    
    </aside>
    
    > **낙관적 업데이트(OptimisticUpdate)를 피해야 하는 상황 언제일까요? 🍠**
    > 
    
    <aside>
    📌
    
    낙관적 업데이트는 **실패 가능성이 높거나, 잘못된 UI 반영이 큰 문제를 만드는 기능**에서는 피하는 것이 좋아요.
    
    예시) 결제, 송금, 재고 차감, 예약 확정, 권한 변경, 민감한 개인정보 수정처럼 서버 검증이 중요한 기능은 먼저 UI를 바꾸면 위험해요! 
    →실패했을 때 다시 되돌리는 과정이 복잡하고, 사용자에게 혼란을 줄 수 있기 때문이에요.
    
    또한 여러 사용자가 동시에 같은 데이터를 수정하는 경우에 충돌 가능성이 커져요!
    예시) 같은 게시글의 좋아요 수, 댓글 수, 재고 수량처럼 다른 사용자의 행동이 함께 반영되는 데이터는 단순히 이전 상태로 롤백하면 최신 서버 상태와 어긋날 수 있어요.
    
    </aside>

- **낙관적 업데이트(OptimisticUpdate) 블로그 읽고 개념 정리하기 🍠**

  # **낙관적 업데이트(OptimisticUpdate) 블로그 읽고 개념 정리하기 🍠**
  - **낙관적 업데이트(OptimisticUpdate)**를 왜 도입해야 하는지, 이 패턴이 해결하려는 문제를 실제 서비스 맥락에서 설명해보세요.
      <aside>
      💡
      
      낙관적 업데이트는 서버 응답을 기다리는 동안 사용자가 느끼는 답답함을 줄이기 위해 도입해요!
      
      </aside>
      
      ```tsx
      // 일반적인 방식은 다음과 같아요!
      사용자 클릭 → 서버 요청 → 로딩 → 서버 응답 성공 → UI 변경
      
      // 하지만 낙관적 업데이트는 다음과 같아요!
      사용자 클릭 → UI 즉시 변경 → 서버 요청 → 성공 시 유지 / 실패 시 롤백
      ```
      
      즉, 서버 요청이 성공할 것이라고 가정하고 UI를 먼저 바꾸는 방식이에요. 
      
      이 패턴은 사용자의 행동에 즉각적인 피드백을 제공해서 서비스가 더 빠르고 자연스럽게 느껴지도록 만들어요.

  - TanStack Query 기반 구현 흐름을 `onMutate → (mutate) → onError → onSettled` 순서로 기술해주세요..
    - STEP 1. `onMutate`
        <aside>
        💡
        
        서버 요청을 보내기 전에 실행돼요!
        
        이 단계에서 기존 쿼리를 취소하고, 현재 캐시 데이터를 저장한 뒤, UI에 먼저 반영할 데이터를 `setQueryData`로 넣어요.
        
        </aside>
        
        ```tsx
        onMutate:async (newTodo) => {
        awaitqueryClient.cancelQueries({ queryKey: ['todos'] });
        
        constpreviousTodos=queryClient.getQueryData(['todos']);
        
        queryClient.setQueryData(['todos'], (old) => [
            ...old,
            { id:Date.now(), title:newTodo.title, completed:false },
          ]);
        
        return { previousTodos };
        }
        ```

    - STEP 2. `mutate`
        <aside>
        💡
        
        실제 서버 요청을 보내요.
        
        </aside>
        
        ```tsx
        mutationFn:createTodo
        ```

    - STEP 3. `onError`
        <aside>
        💡
        
        서버 요청이 실패하면 `onMutate`에서 저장해둔 이전 데이터로 롤백해요.
        
        </aside>
        
        ```tsx
        onError: (error,newTodo,context) => {
        queryClient.setQueryData(['todos'],context.previousTodos);
        }
        ```

    - STEP 4. `onSettled`
        <aside>
        💡
        
        성공하든 실패하든 마지막에 실행돼요!
        
        서버와 클라이언트 상태를 다시 맞추기 위해 쿼리를 무효화해요.
        
        </aside>
        
        ```tsx
        onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
        ```

  - ToDo “생성” 및 “좋아요 토글”에 **낙관적 업데이트(OptimisticUpdate)**를 적용했을 때의 **실패/충돌 롤백 전략**을 설계해주세요.
    - ToDo 생성 실패 / 충돌 롤백 전략
        <aside>
        💡
        
        ToDo 생성은 사용자가 입력 후 바로 목록에 추가되기를 기대하는 기능이므로 낙관적 업데이트에 적합해요!
        
        </aside>
        
        **전략**
        
        1. `onMutate`에서 기존 ToDo 목록을 저장해요.
        2. 그다음 임시 id를 가진 ToDo를 목록에 바로 추가해요!
        예시) `temp-123` 같은 임시 id를 사용해요.
        3. 서버 요청이 성공하면 서버가 내려준 실제 id로 임시 ToDo를 교체해요.
        실패하면 임시 ToDo를 제거하거나, 저장해둔 이전 목록으로 되돌려야 해요!
        
        > 충돌 상황에서는 단순히 전체 목록을 이전 상태로 되돌리기보다, 실패한 임시 ToDo만 제거하는 방식이 더 안전해요!
        ⇒ 왜냐하면 그 사이에 다른 ToDo가 추가되었을 수도 있기 때문이랍니다!
        > 

    - 좋아요 토글 실패/충돌 롤백 전략
        <aside>
        💡
        
        좋아요 토글은 사용자가 버튼을 누르는 즉시 하트 상태가 바뀌는 것이 자연스럽기 때문에 낙관적 업데이트에 적합해요!
        
        </aside>
        
        **전략**
        
        1. `onMutate`에서 현재 좋아요 여부와 좋아요 수를 저장해요.
        → 사용자가 좋아요를 누르면 UI에서는 즉시 `liked: true`, `likeCount + 1`로 바꿔요→ 반대로 취소하면 `liked: false`, `likeCount - 1`로 바꿔요.
        2. 서버 요청이 실패하면 이전 좋아요 상태와 좋아요 수로 롤백해요!
        3. 다만 좋아요 수는 여러 사용자가 동시에 변경할 수 있으므로 충돌 가능성이 있어요.
        → 따라서 실패 시에는 이전 상태로 되돌리고, `onSettled`에서 `invalidateQueries`를 실행해 서버의 최신 좋아요 수를 다시 가져오는 것이 안전해요!
