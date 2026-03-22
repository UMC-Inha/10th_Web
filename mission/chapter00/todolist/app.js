const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

// getElementById가 null일 경우를 대비
// null일 경우 addEventListener, append 사용 시 에러 발생할 수 있다.
if (!input || !todoList || !doneList) {
  throw new Error("필요한 요소를 찾을 수 없습니다.");
}

// input이 진짜 input 요소인지 확인
// getElementById는 단순 HTMLElement를 반환하므로 value 사용 전 체크가 더 안전하다.
if (!(input instanceof HTMLInputElement)) {
  throw new Error("todo-input은 input 요소여야 합니다.");
}

function addTodo(text) {
  const li = document.createElement("li");
  li.className = "section__item";

  // innerHTML 대신 createElement + textContent 사용
  // 사용자가 입력한 text를 그대로 innerHTML에 넣으면 의도치 않은 HTML이 삽입될 수 있어 보안상 더 위험하다.
  const span = document.createElement("span");
  span.className = "section__text";
  span.textContent = text;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "section__buttons";

  const completeBtn = document.createElement("button");
  completeBtn.className = "section__btn--complete";
  completeBtn.textContent = "완료";

  // 완료 버튼 클릭 시 완료 목록으로 이동
  completeBtn.addEventListener("click", () => moveToDone(li));

  buttonWrapper.appendChild(completeBtn);
  li.appendChild(span);
  li.appendChild(buttonWrapper);

  todoList.appendChild(li);
}

// Enter 입력
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const text = input.value.trim();
    if (text === "") return;

    addTodo(text);
    input.value = "";
  }
});

function moveToDone(item) {
  const buttonWrapper = item.querySelector(".section__buttons");

  // 버튼 영역이 없을 경우를 대비
  if (!buttonWrapper) return;

  // 기존 버튼 내용 비우고 새 삭제 버튼 생성
  buttonWrapper.innerHTML = "";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "section__btn--delete";
  deleteBtn.textContent = "삭제";

  // 삭제 버튼 클릭 시 해당 항목 제거
  deleteBtn.addEventListener("click", () => item.remove());

  buttonWrapper.appendChild(deleteBtn);
  doneList.appendChild(item);
}
