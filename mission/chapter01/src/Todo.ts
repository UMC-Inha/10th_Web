const planInput = document.getElementById('input_container__plan_input') as HTMLInputElement ;
const todoList = document.getElementById('todo_list') as HTMLUListElement;
const doneList = document.getElementById('done_list') as HTMLUListElement;
const addBtn = document.getElementById('input_container__add_btn') as HTMLButtonElement;

planInput.addEventListener("keydown", (event:KeyboardEvent) => {
    if (event.key === 'Enter' && planInput.value.trim() !== "") {
        addTodo(planInput.value);
        planInput.value = "";
    }
});

addBtn.addEventListener("click", () => {
    if (planInput.value.trim() !== "") {
        addTodo(planInput.value);
        planInput.value = "";
    }
});

todoList.addEventListener("click", (event:Event)=>{
    const btn = event.target as HTMLButtonElement;
    const li = btn.closest("li");
    if(btn.classList.contains("btn-complete") && li){
        completeTodo(li, btn);
    };
});

doneList.addEventListener("click",(event) => {
    const btn = event.target as HTMLButtonElement
    const li = btn.closest("li")
    if(btn.classList.contains("btn-delete") && li){
        deleteTodo(li);
    };
});

function addTodo(text:string) :void{
    const li = document.createElement('li'); 
    li.innerText = text;
    // 완료버튼
    const completeBtn = document.createElement('button');
    completeBtn.innerText = "완료";
    completeBtn.classList.add("btn-complete");
    li.appendChild(completeBtn);
    todoList.appendChild(li);
};

function completeTodo(li:HTMLLIElement, btn:HTMLButtonElement){
    btn.remove(); 
    // 삭제버튼
    const delBtn = document.createElement('button');
    delBtn.innerText = "삭제";
    delBtn.classList.add("btn-delete");
    li.appendChild(delBtn);
    doneList.appendChild(li); 
};

function deleteTodo(li:HTMLLIElement){
    li.remove();
};

    