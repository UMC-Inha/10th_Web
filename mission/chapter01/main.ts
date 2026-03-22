document.addEventListener("DOMContentLoaded", () => {
  type TodoItemData = {
    id: number;
    text: string;
    completed: boolean;
  };

  const todoForm = document.querySelector<HTMLFormElement>(".todoForm");
  const listsContainer = document.querySelector<HTMLDivElement>(".todo-app__lists");
  const todoInput = document.querySelector<HTMLInputElement>("#todoInput");
  const todoList = document.querySelector<HTMLUListElement>("#todoList");
  const doneList = document.querySelector<HTMLUListElement>("#doneList");
  const todoEmpty = document.querySelector<HTMLParagraphElement>("#todoEmpty");
  const doneEmpty = document.querySelector<HTMLParagraphElement>("#doneEmpty");

  if (!todoForm || !listsContainer || !todoInput || !todoList || !doneList || !todoEmpty || !doneEmpty) {
    console.error("필요한 DOM 요소를 찾지 못했습니다.");
    return;
  }

  let todoLists: TodoItemData[] = [];
  let nextTodoId = 1;

  const createTodoItem = (todo: TodoItemData): HTMLLIElement => {
    const li = document.createElement("li");
    li.className = todo.completed ? "todo-item todo-item--done" : "todo-item";
    li.dataset.id = String(todo.id);

    const span = document.createElement("span");
    span.className = "todo-item__text";
    span.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "todo-item__actions";

    if (todo.completed) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "todo-btn todo-btn--delete";
      deleteButton.type = "button";
      deleteButton.textContent = "삭제";
      actions.appendChild(deleteButton);
    } else {
      const completeButton = document.createElement("button");
      completeButton.className = "todo-btn todo-btn--complete";
      completeButton.type = "button";
      completeButton.textContent = "완료";
      actions.appendChild(completeButton);
    }

    li.appendChild(span);
    li.appendChild(actions);

    return li;
  };

  const render = (): void => {
    todoList.innerHTML = "";
    doneList.innerHTML = "";

    todoLists.forEach((todo) => {
      const todoItem = createTodoItem(todo);
      if (todo.completed) {
        doneList.appendChild(todoItem);
      } else {
        todoList.appendChild(todoItem);
      }
    });

    todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
    doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
  };

  const addTodo = (): void => {
    const todoText = todoInput.value.trim();

    if (todoText === "") {
      todoInput.classList.add("error");
      todoInput.placeholder = "내용을 입력해주세요";
      return;
    }

    todoLists = [
      ...todoLists,
      {
        id: nextTodoId,
        text: todoText,
        completed: false,
      },
    ];
    nextTodoId += 1;

    todoInput.value = "";
    todoInput.classList.remove("error");
    todoInput.placeholder = "스터디 계획을 작성해보세요!";

    render();
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

  listsContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const actionButton = target.closest<HTMLButtonElement>(".todo-btn");
    if (!actionButton) {
      return;
    }

    const todoItem = actionButton.closest<HTMLLIElement>(".todo-item");
    if (!todoItem) {
      return;
    }

    const todoId = Number(todoItem.dataset.id);
    if (!Number.isFinite(todoId)) {
      return;
    }

    if (actionButton.classList.contains("todo-btn--complete")) {
      todoLists = todoLists.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: true,
          };
        }
        return todo;
      });
      render();
      return;
    }

    if (actionButton.classList.contains("todo-btn--delete")) {
      todoLists = todoLists.filter((todo) => todo.id !== todoId);
      render();
    }
  });

  render();
});