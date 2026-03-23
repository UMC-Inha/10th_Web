interface Todos {
    id: number;
    text: string; 
    isDone: boolean;
}

const planInput = document.getElementById('input_container__plan_input') as HTMLInputElement;
const todoList = document.getElementById('todo_list') as HTMLUListElement;
const doneList = document.getElementById('done_list') as HTMLUListElement;
const addBtn = document.getElementById('input_container__add_btn') as HTMLButtonElement;

let todos: Todos[] = [];

loadTodos();

if (planInput) {
    planInput.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.isComposing) return;
        if (event.key === 'Enter' && planInput.value.trim() !== "") {
            addTodo(planInput.value);
            planInput.value = "";
        }
    });
}

addBtn.addEventListener("click", () => {
    if (planInput && planInput.value.trim() !== "") {
        addTodo(planInput.value);
        planInput.value = "";
    }
});

todoList.addEventListener("click", (event: Event) => {
    const btn = event.target as HTMLButtonElement;
    const li = btn.closest("li");
    if (btn.classList.contains("btn-complete") && li) {
        completeTodo(li, btn);
    }
});

doneList.addEventListener("click", (event) => {
    const btn = event.target as HTMLButtonElement;
    const li = btn.closest("li");
    if (btn.classList.contains("btn-delete") && li) {
        deleteTodo(li);
    }
});

function createButton(text: string, className: string, li: HTMLLIElement): void {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.classList.add(className);
    li.appendChild(btn);
}

function addTodo(text: string): void {
    const newTodo: Todos = { id: Date.now(), text, isDone: false };
    todos.push(newTodo);
    renderTodo(newTodo); 
    saveTodos();        
}

function renderTodo(todo: Todos): void {
    const li = document.createElement('li'); 
    li.dataset.id = todo.id.toString();
    li.innerText = todo.text;

    if (!todo.isDone) {
        createButton("완료", "btn-complete", li);
        todoList.appendChild(li);
    } else {
        createButton("삭제", "btn-delete", li);
        doneList.appendChild(li);
    }
}

function completeTodo(li: HTMLLIElement, btn: HTMLButtonElement): void {
    const targetId = Number(li.dataset.id);
    const todo = todos.find(t => t.id === targetId);
    
    if (todo) {
        todo.isDone = true;
        btn.remove(); 
        createButton("삭제", "btn-delete", li);
        doneList.appendChild(li); 
        saveTodos(); 
    }
}

function deleteTodo(li: HTMLLIElement): void {
    const targetId = Number(li.dataset.id);
    todos = todos.filter(t => t.id !== targetId);
    li.remove();
    saveTodos(); 
}

function saveTodos(): void {
    localStorage.setItem('my_todos', JSON.stringify(todos));
}


function loadTodos(): void {
    const saved = localStorage.getItem('my_todos');
    if (saved) {
        todos = JSON.parse(saved);
        todos.forEach(todo => renderTodo(todo));
    }
}