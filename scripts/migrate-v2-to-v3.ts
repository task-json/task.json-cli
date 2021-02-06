/* eslint-disable no-console */
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Task, TaskJson } from "task.json";
import { v4 as uuidv4 } from "uuid";

const todoTasks = JSON.parse(
  fs.readFileSync(
    path.join(os.homedir(), ".todo.json/todo.json"),
    { encoding: "utf-8" }
  )
);

const date = new Date().toISOString();

todoTasks.forEach((task: Task) => {
  if (task.due)
    task.due = new Date(task.due).toISOString();
  if (task.start)
    task.start = new Date(task.start).toISOString();
  task.modified = date;
  task.uuid = uuidv4();
});

const doneTasks = JSON.parse(
  fs.readFileSync(
    path.join(os.homedir(), ".todo.json/done.json"),
    { encoding: "utf-8" }
  )
);

doneTasks.forEach((task: Task) => {
  if (task.due)
    task.due = new Date(task.due).toISOString();
  if (task.start)
    task.start = new Date(task.start).toISOString();
  if (task.end)
    task.end = new Date(task.end).toISOString();
  task.modified = date;
  task.uuid = uuidv4();
});

const taskJson: TaskJson = {
  todo: todoTasks,
  done: doneTasks,
  removed: []
};

fs.writeFileSync("task.json", JSON.stringify(taskJson, null, "\t"));
