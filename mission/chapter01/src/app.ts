const inputField = document.getElementById('todo-input') as HTMLInputElement;
const addButton = document.getElementById('add-button') as HTMLButtonElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 할일 추가
const addTodo = (): void => {
    const text: string = inputField.value.trim();
    if (text === "") return;

    const li = createTodoItem(text, false);
    todoList.appendChild(li);
    inputField.value = "";
};

// 할일 리스트 만들기
const createTodoItem = (text: string, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const span = document.createElement('span');
    span.className = 'todo-item__text';
    span.textContent = text;

    const button = document.createElement('button');
    button.className = isDone 
        ? 'todo-item__button todo-item__button--delete' 
        : 'todo-item__button todo-item__button--complete';
    button.textContent = isDone ? '삭제' : '완료';

    li.appendChild(span);
    li.appendChild(button);
    return li;
};

// 해낸 일
const moveToDone = (li: HTMLLIElement): void => {
    const button = li.querySelector('button') as HTMLButtonElement;
    if (button) {
        button.className = 'todo-item__button todo-item__button--delete';
        button.textContent = '삭제';

        button.onclick = () => {
            li.remove();
        };
    }
    doneList.appendChild(li);
};

addButton.addEventListener('click', addTodo);
inputField.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
});