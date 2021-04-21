import * as fs from "fs";
import { Task, TaskJson, initTaskJson, taskUrgency } from "task.json";
import { dataPath } from "./config";

export function readTaskJson() {
  let taskJson: TaskJson;
  try {
    const data = fs.readFileSync(dataPath, { encoding: "utf8" });
    taskJson = JSON.parse(data);
  }
  catch (error) {
    taskJson = initTaskJson();
  }
  return taskJson;
}

export function writeTaskJson(taskJson: TaskJson) {
  // Backup
  if (fs.existsSync(dataPath))
    fs.renameSync(dataPath, dataPath + ".bak");

  fs.writeFileSync(
    dataPath,
    JSON.stringify(taskJson, null, "\t"),
    { encoding: "utf8" }
  );
}

export function maxWidth(tasks: {
  index: number;
  task: Task;
}[], field: "contexts" | "projects" | "text" | "due") {
  return tasks.reduce((width: number, { task }) => {
    let w = 0;
    switch (field) {
      case "contexts":
      case "projects":
        w = task[field]?.join(", ").length ?? 8;
        break;
      case "text":
        w = Math.max(task.text.length, 4);
        break;
      case "due":
        w = task.due ? 10 : 3;
        break;
    }
    return Math.max(w, width);
  }, 0);
}

export function colorTask(task: Task) {
  const urgency = taskUrgency(task);
  if (urgency >= 1000)
    return "red";
  if (urgency >= 100)
    return "yellow";
  if (urgency >= 1)
    return "cyan";
  return null;
}

export function parseNumbers(numbers: string[], maxNumber: number, onError: (msg: string) => void) {
  return numbers.map(a => {
    const num = parseInt(a);
    if (isNaN(num) || num <= 0)
      onError(`Invalid Number: ${num}`);
    if (num > maxNumber)
      onError(`Task ${num} does not exist.`);
    return num - 1;
  });
}

export function filterByPriority(priorities: string[] | undefined) {
  if (!priorities)
    return () => true;

  return (task: Task) => {
    for (const p of priorities) {
      if (p.length === 0 && task.priority === undefined)
        return true;
      if (p.length > 0 && task.priority === p)
        return true;
    }
    return false;
  };
}

// Filter by projects or contexts
export function filterByField(field: "projects" | "contexts", values: string[] | undefined, and: boolean) {
  if (!values)
    return () => true;

  const op = (left: boolean, right: boolean) => (
    and ? (left && right) : (left || right)
  );

  return (task: Task) => {
    let result = and;
    values.forEach(value => {
      if (value.length === 0)
        result = op(result, task[field] === undefined);
      else
        result = op(result, Boolean(task[field]?.includes(value)));
    });

    return result;
  };
}

