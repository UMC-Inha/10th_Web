document.addEventListener("DOMContentLoaded", function () {
    var todoForm = document.querySelector(".todoForm");
    var listsContainer = document.querySelector(".todo-app__lists");
    var todoInput = document.querySelector("#todoInput");
    var todoList = document.querySelector("#todoList");
    var doneList = document.querySelector("#doneList");
    var todoEmpty = document.querySelector("#todoEmpty");
    var doneEmpty = document.querySelector("#doneEmpty");
    if (!todoForm || !listsContainer || !todoInput || !todoList || !doneList || !todoEmpty || !doneEmpty) {
        console.error("필요한 DOM 요소를 찾지 못했습니다.");
        return;
    }
    var todoLists = [];
    var nextTodoId = 1;
    var createTodoItem = function (todo) {
        var li = document.createElement("li");
        li.className = todo.completed ? "todo-item todo-item--done" : "todo-item";
        li.dataset.id = String(todo.id);
        var span = document.createElement("span");
        span.className = "todo-item__text";
        span.textContent = todo.text;
        var actions = document.createElement("div");
        actions.className = "todo-item__actions";
        if (todo.completed) {
            var deleteButton = document.createElement("button");
            deleteButton.className = "todo-btn todo-btn--delete";
            deleteButton.type = "button";
            deleteButton.textContent = "삭제";
            actions.appendChild(deleteButton);
        }
        else {
            var completeButton = document.createElement("button");
            completeButton.className = "todo-btn todo-btn--complete";
            completeButton.type = "button";
            completeButton.textContent = "완료";
            actions.appendChild(completeButton);
        }
        li.appendChild(span);
        li.appendChild(actions);
        return li;
    };
    var render = function () {
        todoList.innerHTML = "";
        doneList.innerHTML = "";
        todoLists.forEach(function (todo) {
            var todoItem = createTodoItem(todo);
            if (todo.completed) {
                doneList.appendChild(todoItem);
            }
            else {
                todoList.appendChild(todoItem);
            }
        });
        todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
        doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
    };
    var addTodo = function () {
        var todoText = todoInput.value.trim();
        if (todoText === "") {
            todoInput.classList.add("error");
            todoInput.placeholder = "내용을 입력해주세요";
            return;
        }
        todoLists = todoLists.concat([
            {
                id: nextTodoId,
                text: todoText,
                completed: false,
            },
        ]);
        nextTodoId += 1;
        todoInput.value = "";
        todoInput.classList.remove("error");
        todoInput.placeholder = "스터디 계획을 작성해보세요!";
        render();
    };
    todoInput.addEventListener("input", function () {
        if (todoInput.classList.contains("error")) {
            todoInput.classList.remove("error");
            todoInput.placeholder = "스터디 계획을 작성해보세요!";
        }
    });
    todoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addTodo();
    });
    listsContainer.addEventListener("click", function (event) {
        var target = event.target;
        var actionButton = target.closest(".todo-btn");
        if (!actionButton) {
            return;
        }
        var todoItem = actionButton.closest(".todo-item");
        if (!todoItem) {
            return;
        }
        var todoId = Number(todoItem.dataset.id);
        if (!Number.isFinite(todoId)) {
            return;
        }
        if (actionButton.classList.contains("todo-btn--complete")) {
            todoLists = todoLists.map(function (todo) {
                if (todo.id === todoId) {
                    return {
                        id: todo.id,
                        text: todo.text,
                        completed: true,
                    };
                }
                return todo;
            });
            render();
            return;
        }
        if (actionButton.classList.contains("todo-btn--delete")) {
            todoLists = todoLists.filter(function (todo) { return todo.id !== todoId; });
            render();
        }
    });
    render();
});
