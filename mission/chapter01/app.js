"use strict";
const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const addTodo = () => {
    const text = inputField.value.trim();
    if (text === "")
        return;
    const li = createTodoItem(text, false);
    todoList.appendChild(li);
    inputField.value = "";
};
const createTodoItem = (text, isDone) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const span = document.createElement('span');
    span.className = 'todo-item__text';
    span.innerText = text;
    const button = document.createElement('button');
    button.className = isDone
        ? 'todo-item__button todo-item__button--delete'
        : 'todo-item__button todo-item__button--complete';
    button.innerText = isDone ? '삭제' : '완료';
    button.onclick = () => {
        if (!isDone) {
            moveToDone(li, text);
        }
        else {
            li.remove();
        }
    };
    li.appendChild(span);
    li.appendChild(button);
    return li;
};
const moveToDone = (li, text) => {
    li.remove();
    const doneItem = createTodoItem(text, true);
    doneList.appendChild(doneItem);
};
addButton.addEventListener('click', addTodo);
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        addTodo();
});
