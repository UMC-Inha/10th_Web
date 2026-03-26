interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const todoInput = document.getElementById('todo-input-field') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;

let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');

const init = (): void => {
    render();
    
    todoInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.isComposing) return;
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    addBtn.addEventListener('click', () => {
        addTodo();
    });
};

const addTodo = (): void => {
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false
    };

    todos.push(newTodo);
    update();
    todoInput.value = '';
};

const toggleTodo = (id: number): void => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    update();
};

const deleteTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    update();
};

const update = (): void => {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
};

const render = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.className = `task-item__text ${todo.completed ? 'task-item__text--completed' : ''}`;
        span.textContent = todo.text;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'task-item__btn-group';

        const actionBtn = document.createElement('button');
        actionBtn.className = 'task-item__button task-item__button--complete';
        actionBtn.textContent = todo.completed ? '취소' : '완료';
        actionBtn.onclick = () => toggleTodo(todo.id);

        const delBtn = document.createElement('button');
        delBtn.className = 'task-item__button task-item__button--delete';
        delBtn.textContent = '삭제';
        delBtn.onclick = () => deleteTodo(todo.id);

        btnGroup.append(actionBtn, delBtn);
        li.append(span, btnGroup);

        if (todo.completed) {
            doneList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
};

init();