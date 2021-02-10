import * as fs from "fs";
import { DateTime, Interval } from "luxon";
import { Task, TaskJson, initTaskJson } from "task.json";
import { readConfig } from "./config";

export function readTaskJson() {
  const { taskPath } = readConfig();
  let taskJson: TaskJson;
  try {
    const data = fs.readFileSync(taskPath, { encoding: "utf8" });
    taskJson = JSON.parse(data);
  }
  catch (error) {
    taskJson = initTaskJson();
  }
  return taskJson;
}

export function writeTaskJson(taskJson: TaskJson) {
  const { taskPath } = readConfig();

  // Backup
  if (fs.existsSync(taskPath))
    fs.renameSync(taskPath, taskPath + ".bak");

  fs.writeFileSync(
    taskPath,
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
        w = task.due?.length ?? 3;
        break;
    }
    return Math.max(w, width);
  }, 0);
}

export function colorTask(task: Task) {
  if (task.due) {
    const days = Interval.fromDateTimes(
      DateTime.local(),
      DateTime.fromISO(task.due)
    ).length("days");

    if (days < 3) {
      return "red";
    }
    if (days < 7) {
      return "yellow";
    }
  }

  if (task.priority) {
    return "cyan";
  }

  return null;
}

export function urgency(task: Task) {
  let urg = 0;
  if (task.priority) {
    urg += "Z".charCodeAt(0) - task.priority.charCodeAt(0) + 2;
  }
  if (task.due) {
    const days = Interval.fromDateTimes(
      DateTime.local(),
      DateTime.fromISO(task.due)
    ).length("days");
    if (days < 7) {
      urg += 100;
    }
    else {
      urg += 1;
    }
  }
  return urg;
}

export function parseIds(ids: string[], maxId: number, onError: (msg: string) => void) {
  return ids.map(a => {
    const id = parseInt(a);
    if (isNaN(id) || id <= 0)
      onError("Invalid IDs");
    if (id > maxId)
      onError(`Task ${id} does not exist.`);
    return id - 1;
  });
}

// Filter by projects or contexts
export function filterByField(field: "projects" | "contexts", values: string[] | undefined, and: boolean, without: boolean) {
  if (!values && !without)
    return () => true;

  const op = (left: boolean, right: boolean) => (
    and ? (left && right) : (left || right)
  );

  return (task: Task) => {
    let result = and;
    if (without)
      result = op(result, !task[field]);

    values?.forEach(value => {
      result = op(result, Boolean(task[field]?.includes(value)));
    });

    return result;
  };
}

