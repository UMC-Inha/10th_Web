type TodoItem = {
  id: number;
  text: string;
  isDone: boolean;
};

const inputEl = document.getElementById('todo-input') as HTMLInputElement | null;
const todoListEl = document.getElementById('todo-list') as HTMLUListElement | null;
const doneListEl = document.getElementById('done-list') as HTMLUListElement | null;

if (!inputEl || !todoListEl || !doneListEl) {
  throw new Error('필수 DOM 요소를 찾을 수 없습니다.');
}

let nextId = 1;
const STORAGE_KEY = 'ts_todo_items';

function saveToStorage(items: TodoItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromStorage(): TodoItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (
          typeof item === 'object' &&
          item !== null &&
          'id' in item &&
          'text' in item &&
          'isDone' in item
        ) {
          const { id, text, isDone } = item as {
            id: unknown;
            text: unknown;
            isDone: unknown;
          };

          if (typeof id === 'number' && typeof text === 'string' && typeof isDone === 'boolean') {
            return { id, text, isDone };
          }
        }
        return null;
      })
      .filter((v): v is TodoItem => v !== null);
  } catch {
    return [];
  }
}

function getAllItems(): TodoItem[] {
  const items: TodoItem[] = [];
  const collect = (listEl: HTMLUListElement, isDone: boolean) => {
    listEl.querySelectorAll<HTMLLIElement>('.todo-item').forEach((li) => {
      const idAttr = li.dataset.id;
      const textEl = li.querySelector<HTMLElement>('.todo-item__text');
      if (!idAttr || !textEl) return;
      const idNum = Number(idAttr);
      if (Number.isNaN(idNum)) return;
      items.push({ id: idNum, text: textEl.textContent ?? '', isDone });
    });
  };

  collect(todoListEl as HTMLUListElement, false);
  collect(doneListEl as HTMLUListElement, true);

  return items;
}

function createTodoElement(item: TodoItem): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = String(item.id);

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-item__text';
  textSpan.textContent = item.text;

  const actions = document.createElement('div');
  actions.className = 'todo-item__actions';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn btn--complete';
  completeBtn.textContent = item.isDone ? '되돌리기' : '완료';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn--delete';
  deleteBtn.textContent = '삭제';

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(textSpan);
  li.appendChild(actions);

  return li;
}

function renderItem(item: TodoItem): void {
  const li = createTodoElement(item);
  const targetList = (item.isDone ? doneListEl : todoListEl) as HTMLUListElement;
  targetList.appendChild(li);
}

function addTodo(text: string): void {
  const item: TodoItem = {
    id: nextId++,
    text,
    isDone: false,
  };
  renderItem(item);
  const all = getAllItems();
  all.push(item);
  saveToStorage(all);
}

function toggleTodo(id: number): void {
  const selector = `[data-id="${id}"]`;
  const li =
    todoListEl!.querySelector<HTMLLIElement>(selector) ??
    doneListEl!.querySelector<HTMLLIElement>(selector);
  if (!li) return;

  const fromList = li.parentElement;
  if (!(fromList instanceof HTMLUListElement)) return;

  const goingToDone = fromList === todoListEl;
  const targetList = (goingToDone ? doneListEl : todoListEl) as HTMLUListElement;

  targetList.appendChild(li);

  const btn = li.querySelector<HTMLButtonElement>('.btn--complete');
  if (btn) {
    btn.textContent = goingToDone ? '되돌리기' : '완료';
  }

  const all = getAllItems().map((item) =>
    item.id === id ? { ...item, isDone: goingToDone } : item
  );
  saveToStorage(all);
}

function deleteTodo(id: number): void {
  const selector = `[data-id="${id}"]`;
  const li =
    todoListEl!.querySelector<HTMLLIElement>(selector) ??
    doneListEl!.querySelector<HTMLLIElement>(selector);
  if (!li) return;

  li.remove();
  const all = getAllItems().filter((item) => item.id !== id);
  saveToStorage(all);
}

function handleInputKey(event: KeyboardEvent): void {
  if (event.key !== 'Enter') return;

  const value = inputEl!.value.trim();
  if (!value) return;

  addTodo(value);
  inputEl!.value = '';
}

function handleListClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const li = target.closest<HTMLLIElement>('.todo-item');
  if (!li) return;

  const idAttr = li.dataset.id;
  const idNum = idAttr ? Number(idAttr) : NaN;
  if (Number.isNaN(idNum)) return;

  if (target.classList.contains('btn--delete')) {
    deleteTodo(idNum);
    return;
  }

  if (target.classList.contains('btn--complete')) {
    toggleTodo(idNum);
  }
}

function restoreFromStorage(): void {
  const items = loadFromStorage();
  if (items.length === 0) return;

  nextId = Math.max(...items.map((i) => i.id)) + 1;

  items.forEach((item) => {
    renderItem(item);
  });
}

inputEl!.addEventListener('keyup', handleInputKey);
todoListEl!.addEventListener('click', handleListClick);
doneListEl!.addEventListener('click', handleListClick);

restoreFromStorage();
