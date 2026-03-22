type Todo = {
  id: number; // 각 할 일을 구분하기 위한 고유값
  text: string; // 사용자가 입력한 할 일 내용
  isDone: boolean; // 완료 여부
};

// HTML에서 필요한 요소들을 가져온다.
// getElementById는 요소를 못 찾을 수도 있으므로 null 가능성을 함께 적기
const inputEl = document.getElementById("input") as HTMLInputElement | null;
const addBtnEl = document.getElementById("add-btn") as HTMLButtonElement | null;
const todoListEl = document.getElementById(
  "todo-list",
) as HTMLUListElement | null;
const doneListEl = document.getElementById(
  "done-list",
) as HTMLUListElement | null;

// 만약 필요한 요소 중 하나라도 없다면,
// 이후 코드에서 에러가 날 수 있으므로 바로 실행을 중단
if (!inputEl || !addBtnEl || !todoListEl || !doneListEl) {
  throw new Error("필요한 요소를 찾을 수 없습니다.");
}

// 위에서 null 체크를 끝냈기 때문에,
// 아래부터는 null이 아닌 안전한 요소로 사용하기 위해 다시 담아준다.
const input = inputEl;
const addBtn = addBtnEl;
const todoList = todoListEl;
const doneList = doneListEl;

// localStorage에 데이터를 저장할 때 사용할 key 이름
const STORAGE_KEY = "todos";

// 실제 todo 데이터들을 저장할 배열
// 화면(DOM)을 직접 기준으로 삼는 것이 아니라,
// 이 배열을 기준으로 화면을 다시 그리는 방식으로 관리한다.
let todos: Todo[] = [];

// 현재 todos 배열을 문자열(JSON)로 바꿔서 localStorage에 저장하는 함수
// localStorage는 문자열만 저장할 수 있기 때문에 JSON.stringify를 사용한다.
function saveTodos(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// localStorage에 저장된 todos 데이터를 다시 불러오는 함수
function loadTodos(): void {
  // STORAGE_KEY에 해당하는 값을 가져온다.
  const stored = localStorage.getItem(STORAGE_KEY);

  // 저장된 값이 없다면 빈 배열로 시작
  if (!stored) {
    todos = [];
    return;
  }

  try {
    // 문자열 형태로 저장된 데이터를 다시 객체/배열 형태로 바꾼다.
    // JSON.parse 결과는 어떤 값이 나올지 확실하지 않으므로 unknown으로 받는다.
    const parsed: unknown = JSON.parse(stored);

    // parsed가 배열인지 먼저 확인한다.
    if (Array.isArray(parsed)) {
      // 배열 안의 요소가 정말 Todo 형태인지 검사하면서 걸러낸다.
      // 잘못된 데이터가 섞여 있어도 안전하게 처리하기 위해서이다.
      todos = parsed.filter((item): item is Todo => {
        return (
          typeof item === "object" && // 객체인지 확인
          item !== null && // null이 아닌지 확인
          "id" in item && // id 속성이 있는지
          "text" in item && // text 속성이 있는지
          "isDone" in item && // isDone 속성이 있는지
          typeof item.id === "number" && // id가 number인지
          typeof item.text === "string" && // text가 string인지
          typeof item.isDone === "boolean" // isDone이 boolean인지
        );
      });
    } else {
      // 배열이 아니라면 정상 데이터가 아니므로 빈 배열로 처리
      todos = [];
    }
  } catch (error) {
    // JSON.parse 중 에러가 나면 잘못된 데이터라고 보고 빈 배열로 초기화
    console.error(
      "저장된 todo 데이터를 불러오는 중 오류가 발생했습니다.",
      error,
    );
    todos = [];
  }
}

// 현재 todos 배열 상태를 기준으로 화면을 다시 그리는 함수
function renderTodos(): void {
  // 다시 그리기 전에 기존 목록을 모두 비운다.
  // 그래야 중복으로 쌓이지 않고 최신 상태만 화면에 표시된다.
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // todos 배열의 각 항목을 하나씩 꺼내서 화면 요소(li)로 만든다.
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo__item";

    const span = document.createElement("span");
    span.textContent = todo.text;

    const btn = document.createElement("button");

    // 완료된 항목이라면 doneList에 넣고 버튼은 "삭제"로 만든다.
    if (todo.isDone) {
      btn.textContent = "삭제";
      btn.className = "todo__delete-btn";

      // 삭제 버튼을 누르면 해당 id를 가진 todo를 삭제
      btn.addEventListener("click", () => deleteTodo(todo.id));

      li.append(span, btn);
      doneList.appendChild(li);
    } else {
      // 아직 완료되지 않은 항목이라면 todoList에 넣고 버튼은 "완료"로 만든다.
      btn.textContent = "완료";
      btn.className = "todo__complete-btn";

      // 완료 버튼을 누르면 해당 id를 가진 todo를 완료 처리
      btn.addEventListener("click", () => completeTodo(todo.id));

      li.append(span, btn);
      todoList.appendChild(li);
    }
  });
}

// 새로운 할 일을 추가
function addTodo(text: string): void {
  // 새 Todo 객체 생성
  const newTodo: Todo = {
    id: Date.now(), // 고유 id
    text,
    isDone: false,
  };

  // todos 배열에 새 항목 추가
  todos.push(newTodo);

  // 배열이 바뀌었으므로 localStorage에 다시 저장
  saveTodos();

  // 바뀐 배열 기준으로 화면을 다시 그림
  renderTodos();
}

// 특정 id를 가진 todo를 완료 상태로 바꾸기
function completeTodo(id: number): void {
  // id가 일치하는 todo만 isDone을 true로 바꾸고,
  // 나머지는 그대로 유지
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, isDone: true } : todo,
  );

  // 변경된 내용을 저장하고 다시 렌더링
  saveTodos();
  renderTodos();
}

// 특정 id를 가진 todo를 배열에서 제거
function deleteTodo(id: number): void {
  todos = todos.filter((todo) => todo.id !== id);

  // 변경된 내용을 저장하고 다시 렌더링
  saveTodos();
  renderTodos();
}

function handleAddTodo(): void {
  const text = input.value.trim();

  if (!text) return;

  // todo 추가
  addTodo(text);

  // 추가 후 input 창 초기화
  input.value = "";
}

function init(): void {
  // localStorage에 저장된 기존 데이터를 불러오고
  loadTodos();

  // 불러온 데이터를 기준으로 화면을 그림
  renderTodos();
}

// 추가 버튼 클릭
addBtn.addEventListener("click", handleAddTodo);

// input에서 Enter 키를 눌렀을 때
input.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    // 기본 동작이 있다면 막아준다.
    e.preventDefault();

    handleAddTodo();
  }
});

// 페이지 시작 시 기존 데이터 복원 + 첫 화면 렌더링
init();
