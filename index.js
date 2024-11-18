const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/*
  Extra:
  Here is a simple example of a middleware function called “myLogger”. 
  This function just prints “LOGGED” when a request to the app passes through it. 
  The middleware function is assigned to a variable named myLogger.
*/
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger);

// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
let todos = [
  { id: 1, task: 'Read', completed: false, priority: 'low' },  
  { id: 2, task: 'Learn Node.js', completed: false, priority: 'medium' },  
  { id: 3, task: 'Finish assignments', completed: false, priority: 'high' }  
];

/* 
Q.3"
GET /todos - Retrieve all to-do items or filter by completed status.
after completing this part, you need to comment out the GET end point 
already implemented here to test this new GET endpoint! 
*/
app.get('/todos', (req, res) => {
  const { completed } = req.query;
  if (completed === 'true' || completed === 'false') {
    // convert the query parameter to a boolean then Array.filter based on that
    const isCompleted = completed === 'true';
    const filteredData = todos.filter(item => item.completed === isCompleted);
    res.json(filteredData);
  } else {
    res.json(todos); // Returns all todos if no filter is applied
  }

});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
    priority: req.body.priority || "medium"
  };
  todos.push(newTodo);
  res.status(201).json(newTodo); // Responds with the created to-do item and status 201
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res, next) => {
  if (req.url.includes("complete-all"))
    next()
  else {
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).send("To-Do item not found");
    }
    todo.task = req.body.task || todo.task; // Updates the task and/or completed status if provided
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    res.json(todo);
  }
});

/*
Question 2: Implement a "Complete All" Endpoint
example usage: 
curl -X PUT http://localhost:3000/todos/complete-all
*/
app.put('/todos/complete-all', (req, res) => {
  if (!todos) {
    return res.status(404).send("To-Do item not found");
  }
  todos.forEach(item => {
    item.completed = true
  })
  //returns a 200 status code to the client indicating success of this operation
  res.status(200).send('To-Do item all completed successfully');
});


// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1); // Removes the to-do item from the array
  res.status(204).send('To-Do item deleted successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
