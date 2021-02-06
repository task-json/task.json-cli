import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export function readConfig() {
  const rootPath = path.join(os.homedir(), ".task.json");

  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  // TODO: Customize path by ENV
  const taskPath = path.join(rootPath, "task.json");

  return {
    taskPath
  };
}

export function checkTaskExistence(onError: (msg: string) => void) {
  const { taskPath } = readConfig();

  if (!fs.existsSync(taskPath)) {
    onError("task.json does not exist.");
  }
}
