const todolist = document.getElementById('todo-list');
const donelist = document.getElementById('done-list');
const form = document.querySelector('form');
const input = document.getElementById('todo-input');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
  }
});

function addTodo(text) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const combutton = document.createElement('button');

  li.classList.add('todo-item');
  combutton.classList.add('complete-btn');
  combutton.type = 'button';

  span.innerText = text;
  combutton.innerText = '완료';

  li.appendChild(span);
  li.appendChild(combutton);
  todolist.appendChild(li);

  combutton.addEventListener('click', () => {
    moveToDone(li, span.innerText);
  });
}

function moveToDone(todoItem, text) {
  todoItem.remove();

  const li = document.createElement('li');
  const span = document.createElement('span');
  const deletebtn = document.createElement('button');

  li.classList.add('todo-item');
  deletebtn.classList.add('delete-btn');
  deletebtn.type = 'button';

  span.innerText = text;
  deletebtn.innerText = '삭제';

  li.appendChild(span);
  li.appendChild(deletebtn);
  donelist.appendChild(li);
  deletebtn.addEventListener('click', () => {
    li.remove();
  });
}
