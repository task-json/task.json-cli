import * as fs from "fs";
import { Task } from "../types";

export function readTasks(dataPath: string) {
  const data = fs.readFileSync(dataPath, { encoding: "utf8" });
  return JSON.parse(data) as Task[];
}

export function writeTasks(dataPath: string, tasks: Task[]) {
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

  fs.writeFileSync(
    dataPath,
    JSON.stringify(originalTasks.concat(tasks), null, "\t"),
    { encoding: "utf8" }
  );

  return originalTasks.length;
}
