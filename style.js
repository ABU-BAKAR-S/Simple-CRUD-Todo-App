const todo_form = document.querySelector("#todo_form");
const todoInput = document.querySelector("#input_todo");
const todoLists = document.querySelector(".lists");
const messageElement = document.querySelector(".message");

// show message
const showMessage = (text, status) => {
  messageElement.textContent = text;
  messageElement.classList.add(`bg_${status}`);

  setTimeout(() => {
    messageElement.textContent = "";
    messageElement.classList.remove(`bg_${status}`);
  }, 1000);
};

// create todo
const createTodo = (todoValue, todoId) => {
  const todoElement = document.createElement("li");
  todoElement.id = todoId;
  todoElement.classList.add("list_style");

  todoElement.innerHTML = `
  <span id="todoText">${todoValue}</span> <span class="buttons"> <span><button class="btn" id="editBtn"><i class="far fa-edit"></i></button></span> <span><button class="btn" id="deleteBtn"><i class="fas fa-trash"></i></button></span>  <span><button class="btn" id="shareBtn"><i class="fa fa-share"></i></button></span></span>
  <button class="btn menuBtn"><i class="fas fa-ellipsis-v"></i></button>
  `;

  todoLists.appendChild(todoElement);

  const deleteBtn = todoElement.querySelector("#deleteBtn");
  const editBtn = todoElement.querySelector("#editBtn");
  const shareBtn = todoElement.querySelector("#shareBtn");
  const menuBtn = todoElement.querySelector(".menuBtn");

  deleteBtn.addEventListener("click", deleteTodo);
  editBtn.addEventListener("click", editTodo);
  shareBtn.addEventListener("click", () => shareTodo(todoValue));
  menuBtn.addEventListener("click", () => {
    const buttons = todoElement.querySelector(".buttons");
    buttons.style.display =
      buttons.style.display === "none" ? "inline-block" : "none";
  });
};

// share todo
const shareTodo = (todoValue) => {
  if (navigator.share) {
    navigator
      .share({
        title: "My Todo",
        text: todoValue,
      })
      .then(() => {
        showMessage("Todo Shared", "success");
      })
      .catch((error) => {
        showMessage("Error Sharing Todo", "danger");
        console.error("Error sharing:", error);
      });
  } else {
    showMessage("Web Share API not supported in this browser", "danger");
  }
};

// edit todo
const editTodo = (event) => {
  const selectedTodo = event.target.closest("li");
  const todoText = selectedTodo.querySelector("#todoText");
  console.log(selectedTodo.textContent);

  const newTodoValue = prompt("Enter New Todo Value : ", todoText.textContent);
  console.log(newTodoValue);

  if (newTodoValue) {
    todoText.textContent = newTodoValue;
    showMessage("Todo Updated", "success");

    // update local storage
    const todoId = selectedTodo.id;
    let todos = getTodosFromLocalStorage();
    const todoIndex = todos.findIndex((todo) => todo.todoId === todoId);
    todos[todoIndex].todoValue = newTodoValue;
    localStorage.setItem("Todos", JSON.stringify(todos));
    getTodosFromLocalStorage();
  }
};

// delete todo
const deleteTodo = (event) => {
  const selectedTodo = event.target.closest("li");
  todoLists.removeChild(selectedTodo);
  showMessage("Todo Removed", "danger");
  const todoId = selectedTodo.id;
  let todos = getTodosFromLocalStorage();
  todos = todos.filter((todo) => todo.todoId !== todoId);
  localStorage.setItem("Todos", JSON.stringify(todos));
};

// get todos from local storage
const getTodosFromLocalStorage = () => {
  return localStorage.getItem("Todos")
    ? JSON.parse(localStorage.getItem("Todos"))
    : [];
};

// add todo
const addTodo = (event) => {
  event.preventDefault();

  const todoValue = todoInput.value;
  const todoId = Date.now().toString();

  createTodo(todoValue, todoId);
  showMessage("Todo Created", "success");

  const todos = getTodosFromLocalStorage();

  todos.push({ todoValue, todoId });
  localStorage.setItem("Todos", JSON.stringify(todos));

  console.log(todoValue, todoId);

  todoInput.value = "";
};

// load todos
const loadTodos = () => {
  const todos = getTodosFromLocalStorage();
  todos.map((todo) => createTodo(todo.todoValue, todo.todoId));
};

todo_form.addEventListener("submit", addTodo);
// event for load webpage
window.addEventListener("DOMContentLoaded", loadTodos);
