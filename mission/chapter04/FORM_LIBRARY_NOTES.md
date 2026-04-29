# react-hook-form 학습 내용 정리

- `useForm()`은 입력 상태와 검증 상태를 내부적으로 관리해서 리렌더를 줄이고 성능에 유리하다.
- `register('field')`를 인풋에 연결하면 `name`, `onChange`, `onBlur`, `ref`가 자동으로 바인딩된다.
- `formState.errors`로 필드별 에러 메시지를 접근할 수 있고, `mode: 'onTouched'`와 `reValidateMode: 'onChange'` 조합으로 UX를 세밀하게 제어할 수 있다.
- `handleSubmit(onValid)`는 검증 통과 시에만 콜백을 실행하며, 비동기/동기 로직을 안전하게 감싼다.
- `trigger('field')` 또는 `trigger(['a', 'b'])`를 활용하면 다단계 폼에서 특정 필드만 검증해 다음 단계 이동 조건을 만들 수 있다.
- 참고 문서: [React Hook Form 공식 문서](https://react-hook-form.com/)

# Zod 학습 내용 정리

- Zod는 스키마를 코드로 정의하고, 검증과 타입 추론(`z.infer`)을 동시에 제공한다.
- `z.object({...})`, `z.string().email()`, `z.string().min()` 같은 조합으로 선언적으로 검증 규칙을 작성할 수 있다.
- `refine()`를 사용하면 `password`와 `passwordConfirm` 같은 교차 필드 검증을 구현할 수 있다.
- `safeParse()`는 성공/실패를 예외 없이 반환해서 버튼 활성화 조건 계산에 적합하다.
- `@hookform/resolvers/zod`의 `zodResolver()`를 사용하면 react-hook-form과 Zod를 자연스럽게 연결할 수 있다.
- 참고 문서: [Zod 공식 문서](https://zod.dev/v4)
