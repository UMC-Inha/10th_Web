/**
 * todo.ts
 *
 * 애플리케이션 전반에서 사용하는 Todo 관련 타입 정의.
 * 타입을 별도 파일로 분리해 여러 컴포넌트에서 일관되게 import할 수 있다.
 */

/**
 * 할 일(Todo) 항목 하나를 나타내는 타입.
 *
 * @property id          - 각 항목의 고유 식별자 (crypto.randomUUID() 생성)
 * @property text        - 사용자가 입력한 할 일 내용
 * @property isCompleted - 완료 여부 (false: 할 일 섹션, true: 완료 섹션으로 이동)
 */
export type Todo = {
  id: string;
  text: string;
  isCompleted: boolean;
};
