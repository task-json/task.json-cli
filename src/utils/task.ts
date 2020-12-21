import * as fs from "fs";
import { Task } from "../types";

export function readTodo(dataPath: string) {
  const data = fs.readFileSync(dataPath, { encoding: "utf8" });
  return JSON.parse(data) as Task[];
}

export function writeTodo(dataPath: string, tasks: Task[]) {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(tasks, null, "\t"),
    { encoding: "utf8" }
  );
}
