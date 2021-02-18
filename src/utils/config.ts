import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export type Config = {
  dataPath: string;
  server?: string;
  token?: string;
};

const rootPath = path.join(os.homedir(), ".task.json");
const configPath = path.join(rootPath, "config.json");
export const defaultConfig: Config = {
  dataPath: path.join(rootPath, "task.json")
};

export function readConfig() {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  let config: Config;
  try {
    config = {
      ...defaultConfig,
      ...JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }))
    };
  }
  catch (error) {
    config = defaultConfig;
  }

  return config;
}

export function writeConfig(config: Config | null) {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  if (config === null) {
    if (fs.existsSync(configPath))
      fs.unlinkSync(configPath);
  }
  else {
    fs.writeFileSync(configPath, JSON.stringify(config));
  }
}

export function checkTaskExistence(onError: (msg: string) => void) {
  const { dataPath } = readConfig();

  if (!fs.existsSync(dataPath)) {
    onError("task.json does not exist.");
  }
}
