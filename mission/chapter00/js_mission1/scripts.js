const input = document.getElementById('plan_input');
const todoList = document.getElementById('todo_list');
const doneList = document.getElementById('done_list');

input.addEventListener("keydown", (event) => {
    if (event.key === 'Enter' && input.value.trim() !== "") {
        addTodo(input.value);
        input.value = "";
    }
});

function addTodo(text) {
    const li = document.createElement('li'); 
    li.innerText = text;
    // 삭제버튼
    const delBtn = document.createElement('button')
    delBtn.innerText = "삭제";
    delBtn.onclick = () => {
        li.remove()
    }
    // 완료버튼
    const completeBtn = document.createElement('button');
    completeBtn.innerText = "완료";
    completeBtn.onclick = () => {
        li.appendChild(delBtn)
        doneList.appendChild(li); 
        completeBtn.remove(); 
    };
    li.appendChild(completeBtn);
    todoList.appendChild(li);
}


    