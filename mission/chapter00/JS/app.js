console.log("JS 연결")
// 글자 입력창
const input = document.getElementById('todo-input');
// 해야 할 일
const todoList = document.getElementById('todo-list');
// 해낸 일
const doneList = document.getElementById('done-list');

input.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    // space만하고 enter 방지 .trim
    if (event.key === 'Enter' && input.value.trim() !== "") {
        console.log("enter 확인, 입력값:", input.value)
        addTodo(input.value);
        input.value = ""
    }
});

function addTodo(text) {
    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.innerText = text;

    const button = document.createElement('button');
    button.innerText = "완료";
    button.className = "complete-btn";

    button.onclick = function() {
        completeTodo(li);
    };

    li.appendChild(span);
    li.appendChild(button);
    todoList.appendChild(li);
}

function completeTodo(li) {
    const btn = li.querySelector('.complete-btn');
    if (btn) {
        btn.innerText = "삭제";
        btn.onclick = function() {
            li.remove();
        };
        doneList.appendChild(li); 
    }
}