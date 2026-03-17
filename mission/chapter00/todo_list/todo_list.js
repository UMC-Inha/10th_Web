const form = document.querySelector('form');
const input = document.querySelector('input');
const todo = document.querySelector('#todoList');
const done = document.querySelector('#doneList');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (input.value.trim() !== '') {
    addTodo(text);
    input.value = '';
  }
});

function addTodo(text) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const completebtn = document.createElement('button');
  const deletebtn = document.createElement('button');

  span.innerText = text;
  completebtn.innerText = '완료';
  deletebtn.innerText = '삭제';

  li.appendChild(span);
  li.appendChild(completebtn);
  todo.appendChild(li);
  completebtn.addEventListener('click', () => {
    moveToDone(li, span.innerText);
  });
}

function moveToDone(todoItem, text) {
  todoItem.remove();

  const li = document.createElement('li');
  const span = document.createElement('span');
  const deletebtn = document.createElement('button');

  span.innerText = text;
  deletebtn.innerText = '삭제';

  li.appendChild(span);
  li.appendChild(deletebtn);
  done.appendChild(li);

  deletebtn.addEventListener('click', () => {
    li.remove();
  });
}
