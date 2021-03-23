/* eslint-disable no-console */
import { TaskType } from "task.json";
import * as fs from "fs";

if (process.argv.length <= 2) {
  throw new Error("No task.json specified");
}

const filename = process.argv[2];
const taskJson = JSON.parse(fs.readFileSync(filename, { encoding: "utf8" }));

const types: TaskType[] = ["todo", "done", "removed"];
for (const type of types) {
  for (const task of taskJson[type]) {
    if (task.uuid) {
      task.id = task.uuid;
      delete task.uuid;
    }
  }
}

fs.writeFileSync(
  filename,
  JSON.stringify(taskJson, null, "\t"),
  { encoding: "utf8" }
);

console.log("Migrate successfully");
