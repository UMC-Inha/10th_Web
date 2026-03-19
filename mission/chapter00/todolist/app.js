const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

function addTodo(text) {
  const li = document.createElement("li");
  li.className = "section__item";

  li.innerHTML = `<span class="section__text">${text}</span>
    <div class="section__buttons">
      <button class="section__btn--complete">완료</button>
    </div>`;

  li.querySelector(".section__btn--complete").addEventListener("click", () =>
    moveToDone(li),
  );

  todoList.append(li);
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
  // 버튼 변경
  item.querySelector(".section__buttons").innerHTML =
    `   <button class="section__btn--delete">삭제</button>
  `;

  // 삭제 이벤트
  item
    .querySelector(".section__btn--delete")
    .addEventListener("click", () => item.remove());

  doneList.append(item);
}
