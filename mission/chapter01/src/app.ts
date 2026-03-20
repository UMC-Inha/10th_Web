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
    span.innerText = text;

    const button = document.createElement('button');
    button.className = isDone 
        ? 'todo-item__button todo-item__button--delete' 
        : 'todo-item__button todo-item__button--complete';
    button.innerText = isDone ? '삭제' : '완료';

    // 버튼 클릭 이벤트
    button.onclick = () => {
        if (!isDone) {
            moveToDone(li, text);
        } else {
            li.remove();
        }
    };

    li.appendChild(span);
    li.appendChild(button);
    return li;
};

// 해낸 일
const moveToDone = (li: HTMLLIElement, text: string): void => {
    li.remove(); // 원래 목록에서 제거
    const doneItem = createTodoItem(text, true);
    doneList.appendChild(doneItem);
};

addButton.addEventListener('click', addTodo);
inputField.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
});