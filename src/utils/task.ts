import * as fs from "fs";
import { differenceInDays } from "date-fns";
import { Task } from "../types";

export function readTasks(dataPath: string) {
  const data = fs.readFileSync(dataPath, { encoding: "utf8" });
  return JSON.parse(data) as Task[];
}

export function writeTasks(dataPath: string, tasks: Task[]) {
  // Backup
  fs.renameSync(dataPath, dataPath + ".bak");

  fs.writeFileSync(
    dataPath,
    JSON.stringify(tasks, null, "\t"),
    { encoding: "utf8" }
  );
}

export function appendTasks(dataPath: string, tasks: Task[]) {
  let originalTasks: Task[];
  try {
    originalTasks = readTasks(dataPath);
  }
  catch (_) {
    originalTasks = [];
  }

  writeTasks(dataPath, originalTasks.concat(tasks));
  return originalTasks.length;
}

export function colorTask(task: Task) {
  if (task.due) {
    const days = differenceInDays(new Date(task.due), new Date());
    if (days < 3) {
      return "redBright";
    }
    if (days < 7) {
      return "yellowBright";
    }
  }

  if (task.priority) {
    return "cyanBright";
  }

  return null;
}

export function urgency(task: Task) {
  let urg = 0;
  if (task.priority) {
    urg += "Z".charCodeAt(0) - task.priority.charCodeAt(0) + 2;
  }
  if (task.due) {
    const days = differenceInDays(new Date(task.due), new Date());
    if (days < 7) {
      urg += 100;
    }
    else {
      urg += 1;
    }
  }
  return urg;
}
