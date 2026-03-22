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
    var updateEmptyMessage = function () {
        todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
        doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
    };
    var deleteTodo = function (todoItem) {
        todoItem.remove();
        updateEmptyMessage();
    };
    var completeTodo = function (todoItem) {
        var actions = todoItem.querySelector(".todo-item__actions");
        if (!actions) {
            return;
        }
        todoItem.classList.add("todo-item--done");
        actions.innerHTML = "";
        var deleteButton = document.createElement("button");
        deleteButton.className = "todo-btn todo-btn--delete";
        deleteButton.type = "button";
        deleteButton.textContent = "삭제";
        actions.appendChild(deleteButton);
        doneList.appendChild(todoItem);
        updateEmptyMessage();
    };
    var createTodoItem = function (todoText) {
        var li = document.createElement("li");
        li.className = "todo-item";
        var span = document.createElement("span");
        span.className = "todo-item__text";
        span.textContent = todoText;
        var actions = document.createElement("div");
        actions.className = "todo-item__actions";
        var completeButton = document.createElement("button");
        completeButton.className = "todo-btn todo-btn--complete";
        completeButton.type = "button";
        completeButton.textContent = "완료";
        actions.appendChild(completeButton);
        li.appendChild(span);
        li.appendChild(actions);
        return li;
    };
    var addTodo = function () {
        var todoText = todoInput.value.trim();
        if (todoText === "") {
            todoInput.classList.add("error");
            todoInput.placeholder = "내용을 입력해주세요";
            return;
        }
        var todoItem = createTodoItem(todoText);
        todoList.appendChild(todoItem);
        todoInput.value = "";
        todoInput.classList.remove("error");
        todoInput.placeholder = "스터디 계획을 작성해보세요!";
        updateEmptyMessage();
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
        if (actionButton.classList.contains("todo-btn--complete")) {
            completeTodo(todoItem);
            return;
        }
        if (actionButton.classList.contains("todo-btn--delete")) {
            deleteTodo(todoItem);
        }
    });
    updateEmptyMessage();
});
