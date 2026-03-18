const input = document.querySelector('.planner__input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const STORAGE_KEY = 'umc_todo_items';

function saveToStorage() {
  const data = [];
  document.querySelectorAll('.todo-item').forEach((item) => {
    const text = item.querySelector('.todo-item__text').textContent;
    const isDone = item.parentElement === doneList;
    data.push({ text, isDone });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createTodoElement(text, isDone = false) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const span = document.createElement('span');
  span.className = 'todo-item__text';
  span.textContent = text;

  const actions = document.createElement('div');
  actions.className = 'todo-item__actions';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn btn--complete';
  completeBtn.textContent = isDone ? '되돌리기' : '완료';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn--delete';
  deleteBtn.textContent = '삭제';

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  return li;
}

function addTodo(text, isDone = false) {
  const item = createTodoElement(text, isDone);
  (isDone ? doneList : todoList).appendChild(item);
}

function handleAddTodo(event) {
  if (event.isComposing || event.key !== 'Enter') return;

  const value = input.value.trim();
  if (!value) return;

  addTodo(value);
  input.value = '';
  saveToStorage();
}

input.addEventListener('keydown', handleAddTodo);

function handleListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const item = target.closest('.todo-item');
  if (!item) return;

  if (target.classList.contains('btn--delete')) {
    item.remove();
    saveToStorage();
    return;
  }

  if (target.classList.contains('btn--complete')) {
    const fromList = item.parentElement;
    const toList = fromList === todoList ? doneList : todoList;
    toList.appendChild(item);

    target.textContent = fromList === todoList ? '되돌리기' : '완료';
    saveToStorage();
  }
}

todoList.addEventListener('click', handleListClick);
doneList.addEventListener('click', handleListClick);

function restoreFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const items = JSON.parse(raw);
    items.forEach(({ text, isDone }) => {
      addTodo(text, isDone);
    });
  } catch {}
}

restoreFromStorage();
