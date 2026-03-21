const input = document.getElementById('plan_input');
const todoList = document.getElementById('todo_list');
const doneList = document.getElementById('done_list');

input.addEventListener("keydown", (event) => {
    if (event.key === 'Enter' && input.value.trim() !== "") {
        addTodo(input.value);
        input.value = "";
    }
});

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
    const li = document.createElement('li'); 
    li.innerText = text;
    // 완료버튼
    const completeBtn = document.createElement('button');
    completeBtn.innerText = "완료";
    completeBtn.classList.add("btn-complete");

    li.appendChild(completeBtn);
    todoList.appendChild(li);
}
function completeTodo(li, btn){
    btn.remove(); 
    // 삭제버튼
    const delBtn = document.createElement('button');
    delBtn.innerText = "삭제";
    delBtn.classList.add("btn-delete");
    li.appendChild(delBtn);
    doneList.appendChild(li); 
}
function deleteTodo(li){
    li.remove();
}