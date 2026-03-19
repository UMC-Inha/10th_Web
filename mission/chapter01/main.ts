document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.querySelector<HTMLFormElement>(".todoForm");
  const todoInput = document.querySelector<HTMLInputElement>("#todoInput");
  const todoList = document.querySelector<HTMLUListElement>("#todoList");
  const doneList = document.querySelector<HTMLUListElement>("#doneList");
  const todoEmpty = document.querySelector<HTMLParagraphElement>("#todoEmpty");
  const doneEmpty = document.querySelector<HTMLParagraphElement>("#doneEmpty");

  if (!todoForm || !todoInput || !todoList || !doneList || !todoEmpty || !doneEmpty) {
    console.error("필요한 DOM 요소를 찾지 못했습니다.");
    return;
  }

  const updateEmptyMessage = (): void => {
    todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
    doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
  };

  const deleteTodo = (todoItem: HTMLLIElement): void => {
    todoItem.remove();
    updateEmptyMessage();
  };

  const completeTodo = (todoItem: HTMLLIElement, actions: HTMLDivElement): void => {
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
  };

  const createTodoItem = (todoText: string): HTMLLIElement => {
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
  };

  const addTodo = (): void => {
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
  };

  todoInput.addEventListener("input", () => {
    if (todoInput.classList.contains("error")) {
      todoInput.classList.remove("error");
      todoInput.placeholder = "스터디 계획을 작성해보세요!";
    }
  });

  todoForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    addTodo();
  });

  updateEmptyMessage();
});