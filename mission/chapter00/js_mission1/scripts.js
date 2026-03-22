const input = document.getElementById('plan_input');
const todoList = document.getElementById('todo_list');
const doneList = document.getElementById('done_list');

let todos = []
if (input){
    input.addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.key === 'Enter' && input.value.trim() !== "") {
            addTodo(input.value);
            input.value = "";
        }
    });
}

todoList.addEventListener("click", (event)=>{
    const btn = event.target ;
    const li = btn.closest("li");
    if(btn.classList.contains("btn-complete")){
        completeTodo(li, btn);
    };
})
doneList.addEventListener("click",(event) => {
    const btn = event.target
    const li = btn.closest("li")
    if(btn.classList.contains("btn-delete")){
        deleteTodo(li);
    };
})

function addTodo(text) {
    const newTodo = { id: Date.now(), text, isDone: false };
    todos.push(newTodo);
    renderTodo(newTodo);
    saveTodos();
}
function completeTodo(li, btn){
    const targetId = Number(li.dataset.id);
    const todo = todos.find(t => t.id === targetId);
    if (todo) todo.isDone = true;
    btn.remove(); 
    // 삭제버튼
    const delBtn = document.createElement('button');
    delBtn.innerText = "삭제";
    delBtn.classList.add("btn-delete");
    li.appendChild(delBtn);
    doneList.appendChild(li); 
    saveTodos();
}
function deleteTodo(li){
    const targetId = Number(li.dataset.id);
    todos = todos.filter(t => t.id !== targetId);
    li.remove();
    saveTodos();
}

function saveTodos() {
    localStorage.setItem('my_todos', JSON.stringify(todos));
}

function loadTodos() {
    const saved = localStorage.getItem('my_todos');
    if (saved) {
        todos = JSON.parse(saved); 
        todos.forEach(todo => {
            renderTodo(todo); 
        });
    }
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.innerText = todo.text;

    const btn = document.createElement('button');
    
    if (!todo.isDone) {
        btn.innerText = "완료";
        btn.classList.add("btn-complete");
        li.appendChild(btn);
        todoList.appendChild(li);
    } else {
        btn.innerText = "삭제";
        btn.classList.add("btn-delete");
        li.appendChild(btn);
        doneList.appendChild(li);
    }
}

loadTodos()