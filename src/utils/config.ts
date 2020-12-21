import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export function readConfig() {
  const configPath = path.join(os.homedir(), ".todo.json");

  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }

  // TODO: Customize path
  const dataPath = path.join(configPath, "todo.json");

  return {
    dataPath
  };
}
