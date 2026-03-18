const ts_plan_input = document.getElementById('plan_input') as HTMLInputElement ;
const ts_todo_List = document.getElementById('todo_list') as HTMLUListElement;
const ts_done_List = document.getElementById('done_list') as HTMLUListElement;
const ts_add_btn = document.getElementById('add_btn') as HTMLButtonElement;

ts_plan_input.addEventListener("keydown", (event:KeyboardEvent) => {
    if (event.key === 'Enter' && ts_plan_input.value.trim() !== "") {
        ts_addTodo(ts_plan_input.value);
        ts_plan_input.value = "";
    }
});
ts_add_btn.addEventListener("click", () => {
    if (ts_plan_input.value.trim() !== "") {
        ts_addTodo(ts_plan_input.value);
        ts_plan_input.value = "";
    }
});

function ts_addTodo(text:string) {
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
        {ts_done_List &&
            ts_done_List.appendChild(li)}; 
        completeBtn.remove(); 
    };
    li.appendChild(completeBtn);

    ts_todo_List.appendChild(li);
}


    