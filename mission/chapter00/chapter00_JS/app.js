document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    renderTodos();

    todoInput.addEventListener('keydown', (e) => {
        if (e.isComposing) return; 
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === "") {
            alert("할 일을 입력해주세요!");
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
        saveAndRender();
        todoInput.value = "";
    }

    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveAndRender();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        doneList.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = todo.text;
            if (todo.completed) {
                span.classList.add('completed-text');
            }

            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';

            const completeBtn = document.createElement('button');
            completeBtn.textContent = todo.completed ? '취소' : '완료';
            completeBtn.addEventListener('click', () => toggleComplete(todo.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            btnGroup.appendChild(completeBtn);
            btnGroup.appendChild(deleteBtn);
            li.appendChild(span);
            li.appendChild(btnGroup);

            if (todo.completed) {
                doneList.appendChild(li);
            } else {
                todoList.appendChild(li);
            }
        });
    }
});