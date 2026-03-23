//1.HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;
//2. 할 일 Type 정의
type Todo = {
  id: number;
  text: string;
};
let todos: Todo[] = [];
let doneTasks: Todo[] = [];
let nextId = 0;

const getTodoText = (): string => {
  return todoInput.value.trim();
};

const renderTask = (): void => {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.forEach((todo): void => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });

  todos.forEach((todo): void => {
    const li = createTodoElement(todo, true);
    todoList.appendChild(li);
  });
};

const addTodo = (text: string): void => {
  todos.push({ id: nextId++, text });
  todoInput.value = '';
  renderTask();
};

const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t): boolean => t.id !== todo.id);
  doneTasks.push(todo);
  renderTask();
};

const deleteTodo = (todo: Todo): void => {
  doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
  renderTask();
};

const createTodoElement = (todo: Todo, isdone: boolean): HTMLLIElement => {
  const li = document.createElement('li');
  li.classList.add('render-container__item');
  li.textContent = todo.text;

  const button = document.createElement('button');
  button.classList.add('render-container__item-button');

  if (isdone) {
    button.textContent = '삭제';
    button.style.backgroundColor = '#dc3545';
  } else {
    button.textContent = '완료';
    button.style.backgroundColor = '#28a745';
  }

  button.addEventListener('click', (): void => {
    if (isdone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

todoForm.addEventListener('submit', (event: Event): void => {
  event.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});
