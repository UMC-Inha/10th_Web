// =============================================================================
// Types & constants
// =============================================================================

type TodoItem = {
  id: number;
  text: string;
  isDone: boolean;
};

const STORAGE_KEY = 'ts_todo_items';

const ID = {
  input: 'todo-input',
  todoList: 'todo-list',
  doneList: 'done-list',
} as const;

const SEL = {
  item: '.todo-item',
  text: '.todo-item__text',
  btnComplete: '.btn--complete',
  btnDelete: '.btn--delete',
} as const;

const CLS = {
  item: 'todo-item',
  text: 'todo-item__text',
  actions: 'todo-item__actions',
  btnComplete: 'btn btn--complete',
  btnDelete: 'btn btn--delete',
} as const;

// =============================================================================
// DOM (narrowed after guard — 이후 단언 불필요)
// =============================================================================

const inputElRaw = document.getElementById(ID.input);
const todoListElRaw = document.getElementById(ID.todoList);
const doneListElRaw = document.getElementById(ID.doneList);

if (!inputElRaw || !todoListElRaw || !doneListElRaw) {
  throw new Error('필수 DOM 요소를 찾을 수 없습니다.');
}

const inputEl = inputElRaw as HTMLInputElement;
const todoListEl = todoListElRaw as HTMLUListElement;
const doneListEl = doneListElRaw as HTMLUListElement;

// =============================================================================
// State (단일 진실 공급원)
// =============================================================================

let items: TodoItem[] = [];
let nextId = 1;

// =============================================================================
// Storage
// =============================================================================

function isTodoItem(value: unknown): value is TodoItem {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || !('text' in value) || !('isDone' in value)) return false;
  const o = value as { id: unknown; text: unknown; isDone: unknown };
  return typeof o.id === 'number' && typeof o.text === 'string' && typeof o.isDone === 'boolean';
}

function loadFromStorage(): TodoItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodoItem);
  } catch {
    return [];
  }
}

function saveToStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function syncNextIdFromItems(): void {
  const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
  nextId = maxId + 1;
}

// =============================================================================
// Rendering
// =============================================================================

function completeButtonLabel(isDone: boolean): string {
  return isDone ? '되돌리기' : '완료';
}

function createTodoElement(item: TodoItem): HTMLLIElement {
  const li = document.createElement('li');
  li.className = CLS.item;
  li.dataset.id = String(item.id);

  const textSpan = document.createElement('span');
  textSpan.className = CLS.text;
  textSpan.textContent = item.text;

  const actions = document.createElement('div');
  actions.className = CLS.actions;

  const completeBtn = document.createElement('button');
  completeBtn.className = CLS.btnComplete;
  completeBtn.textContent = completeButtonLabel(item.isDone);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = CLS.btnDelete;
  deleteBtn.textContent = '삭제';

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(textSpan);
  li.appendChild(actions);

  return li;
}

function renderAll(): void {
  todoListEl.replaceChildren();
  doneListEl.replaceChildren();

  for (const item of items) {
    const li = createTodoElement(item);
    const target = item.isDone ? doneListEl : todoListEl;
    target.appendChild(li);
  }
}

// =============================================================================
// Actions
// =============================================================================

function addTodo(text: string): void {
  const item: TodoItem = {
    id: nextId++,
    text,
    isDone: false,
  };
  items.push(item);
  saveToStorage();
  renderAll();
}

function toggleTodo(id: number): void {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.isDone = !item.isDone;
  saveToStorage();
  renderAll();
}

function deleteTodo(id: number): void {
  items = items.filter((i) => i.id !== id);
  saveToStorage();
  renderAll();
}

// =============================================================================
// Event handlers
// =============================================================================

function handleInputKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter') return;
  if (event.isComposing) return;

  const value = inputEl.value.trim();
  if (!value) return;

  addTodo(value);
  inputEl.value = '';
}

function handleListClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const li = target.closest<HTMLLIElement>(SEL.item);
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

// =============================================================================
// Bootstrap
// =============================================================================

function init(): void {
  items = loadFromStorage();
  syncNextIdFromItems();
  renderAll();

  inputEl.addEventListener('keydown', handleInputKeydown);
  todoListEl.addEventListener('click', handleListClick);
  doneListEl.addEventListener('click', handleListClick);
}

init();
