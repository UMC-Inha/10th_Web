document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.querySelector(".todoForm");
  const todoInput = document.querySelector("#todoInput");
  const todoList = document.querySelector("#todoList");
  const doneList = document.querySelector("#doneList");
  const todoEmpty = document.querySelector("#todoEmpty");
  const doneEmpty = document.querySelector("#doneEmpty");

  function updateEmptyMessage() {
    todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
    doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
  }

  function deleteTodo(todoItem) {
    todoItem.remove();
    updateEmptyMessage();
  }

  function completeTodo(todoItem, actions) {
    todoItem.classList.add("todo-item--done");

    actions.innerHTML = "";

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-btn todo-btn--delete";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    deleteButton.addEventListener("click", () => {
      deleteTodo(todoItem);
    });

    actions.appendChild(deleteButton);
    doneList.appendChild(todoItem);
    updateEmptyMessage();
  }

  function createTodoItem(todoText) {
    const li = document.createElement("li");
    li.className = "todo-item";

    const span = document.createElement("span");
    span.className = "todo-item__text";
    span.textContent = todoText;

    const actions = document.createElement("div");
    actions.className = "todo-item__actions";

    const completeButton = document.createElement("button");
    completeButton.className = "todo-btn todo-btn--complete";
    completeButton.type = "button";
    completeButton.textContent = "완료";

    completeButton.addEventListener("click", () => {
      completeTodo(li, actions);
    });

    actions.appendChild(completeButton);
    li.appendChild(span);
    li.appendChild(actions);

    return li;
  }

  function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === "") {
      todoInput.classList.add("error");
      todoInput.placeholder = "내용을 입력해주세요";
      return;
    }

    const todoItem = createTodoItem(todoText);
    todoList.appendChild(todoItem);

    todoInput.value = "";
    todoInput.classList.remove("error");
    todoInput.placeholder = "스터디 계획을 작성해보세요!";

    updateEmptyMessage();
  }

  todoInput.addEventListener("input", () => {
    if (todoInput.classList.contains("error")) {
      todoInput.classList.remove("error");
      todoInput.placeholder = "스터디 계획을 작성해보세요!";
    }
  });

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
  });

  updateEmptyMessage();
});
