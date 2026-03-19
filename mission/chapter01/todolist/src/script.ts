const input = document.getElementById("input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 할 일 추가
function addTodo(text: string): void {
  const li = document.createElement("li");
  li.className = "todo__item";

  const span = document.createElement("span");
  span.textContent = text;

  const btn = document.createElement("button");
  btn.textContent = "완료";
  btn.className = "todo__complete-btn";

  btn.addEventListener("click", () => moveToDone(li));

  li.append(span, btn);
  todoList.appendChild(li);
}

// 완료 이동
function moveToDone(item: HTMLLIElement): void {
  const btn = item.querySelector("button") as HTMLButtonElement;

  btn.textContent = "삭제";
  btn.className = "todo__delete-btn";

  btn.onclick = () => item.remove();

  doneList.appendChild(item);
}

// 버튼 클릭
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addTodo(text);
  input.value = "";
});

// Enter 입력
input.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});
