class Todo {
  constructor(day, activity, start, stop) {
    this.day = day
    this.activity = activity
    this.start = start
    this.stop = stop
  }
}

class UI {
  // Create an addTodoToTodoBody method
  addTodoFormToTodoBody(todo) {
    //  Grab the todo-body element
    const todoBody = document.querySelector("#todo-body")

    // Create tr in todo-body
    const tableRow = document.createElement("tr")
    // Append innerHtml to tableRow
    tableRow.innerHTML = `
                  <td>${todo.day}</td>
                  <td>${todo.activity}</td>
                  <td>${todo.start}</td>
                  <td>${todo.stop}</td>
                  <td><a href="#"class=delete>x</a></td> 
                  `
    // Append tableRow to todoBody
    todoBody.appendChild(tableRow)
  }

  // Create an displayAlert method
  displayAlert(message, className) {
    // Create new div
    const alertDiv = document.createElement("div")
    // Add className to the div
    alertDiv.className = `alert ${className}`
    // Append message as Textnode on new div
    alertDiv.appendChild(document.createTextNode(message))
    // Grab container & form from the document
    const container = document.querySelector(".container")
    const todoForm = document.querySelector("#todo-form")
    // Insert the alert between container and form
    container.insertBefore(alertDiv, todoForm)


    // Set a timeout for the alert
    setTimeout(() => {
      document.querySelector(".alert").remove()
    }, 2000)
  }

  // delete todo with Event Delegation
  deleteTodo(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove()
    }
  }
  // clear form
  clearFormFields() {
    document.querySelector("#day").value = ""
    document.querySelector("#activity").value = ""
    document.querySelector("#start-time").value = ""
    document.querySelector("#stop-time").value = ""
  }

  todoComplete() {
    document.querySelector("#todo-body").style.backgroud = "green"
  }
}

class Store {
  static getTodo() {
    let todos
    if(localStorage.getItem("todos") === null){
      todos = []
    }else{
      todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos
  }

  static displayTodo() {
    const todos = Store.getTodo()

    todos.forEach(todo => {
      const ui = new UI()

      ui.addTodoFormToTodoBody(todo)
    });
  }

  static addTodo(todo) {
    const todos = Store.getTodo()

    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos))
  }

  static removeTodo(stop) {
    const todos = Store.getTodo()

    todos.forEach((todo, index) => {
      if(todo.stop === stop){
        todos.splice(index, 1)
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos))
  }

}
// DOM Event Listener
document.addEventListener("DOMContentLoaded", Store.displayTodo())
document.querySelector("#todo-form").addEventListener("submit", function (e) {

  // Grab UI Elements
  const UIDay = document.querySelector("#day").value,
    UIActivity = document.querySelector("#activity").value,
    UIStartTime = document.querySelector("#start-time").value,
    UIStopTime = document.querySelector("#stop-time").value

  // Add todo instance
  const todo = new Todo(UIDay, UIActivity, UIStartTime, UIStopTime)

  // Add UI instance
  const ui = new UI()

  // Validation
  if (UIDay === "" || UIActivity === "" || UIStartTime === "" || UIStopTime === "") {
    // Warning Message
    ui.displayAlert("Kindly fill in all the fields", "error")
  } else {
    // Add todo to body
    ui.addTodoFormToTodoBody(todo)

    // Add to LS
    Store.addTodo(todo)
    // Success Message
    ui.displayAlert("To-Do Added", "success")
    //Clear form
    ui.clearFormFields()
  }

  e.preventDefault()
})

// Grab the todo body
document.querySelector("#todo-body").addEventListener("click", function (e) {
  // instantiate new UI
  const ui = new UI()

  ui.deleteTodo(e.target)

  Store.removeTodo(e.target.parentElement.previousElementSibling.innerHTML)

  e.preventDefault()
})

