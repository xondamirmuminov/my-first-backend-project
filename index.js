const express = require("express");
const Joi = require("joi");
let app = express();
app.use(express.json());

let tasks = [
  { task: "sleeping", type: "nimadir", id: 1, date: "12/12/2021" },
  { task: "runnig", type: "nimadir", id: 2, date: "12/12/2021" },
  { task: "eating", type: "nimadir", id: 3, date: "12/12/2021" },
];

app.get("/api/tasks", (req, res) => {
  return res.status(200).send(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  let task = tasks.find((item) => item.id == req.params.id);
  if (!task) {
    return res.status(400).send("This task was not found");
  } else {
    return res.status(200).send(task);
  }
});

app.post("/api/tasks", (req, res) => {
  let { error } = validateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    let task = {
      task: req.body.task,
      type: req.body.type,
      id: tasks.length + 1,
      date: req.body.date,
    };
    tasks.push(task);
    return res.status(201).send(task);
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  let task = tasks.find((item) => item.id == req.params.id);
  if (!task) {
    return res.status(400).send("This task was not found");
  } else {
    let taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
    return res.status(200).send(task);
  }
});

app.put("/api/tasks/:id", (req, res) => {
  let todo = tasks.find((item) => item.id == req.params.id);
  if (!todo) {
    return res.status(400).send("This task was not found");
  }
  let { error } = validateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    let { task, type, date } = req.body;
    todo = { task, type, date, id: todo.id };
    res.send(todo);
  }
});

function validateTask(task) {
  let taskSchema = Joi.object({
    task: Joi.string().required(),
    type: Joi.string().required(),
    date: Joi.string().required(),
  });
  return taskSchema.validate(task);
}

let port = process.env.PORT || 8000;
app.listen(port, () => {
  return console.log(`${port} working`);
});
