import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export function readConfig() {
  const configPath = path.join(os.homedir(), ".todo.json");

  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }

  // TODO: Customize path
  const todoPath = path.join(configPath, "todo.json");
  const donePath = path.join(configPath, "done.json");

  return {
    todoPath,
    donePath
  };
}
