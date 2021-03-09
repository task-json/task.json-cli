import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export type Config = {
  dataPath: string;
  server?: string;
  token?: string;
};

const rootPath = path.join(os.homedir(), ".task.json");
const configPath = process.env.TASK_JSON_CONFIG || path.join(rootPath, "config.json");

export const defaultConfig: Config = {
  dataPath: path.join(rootPath, "task.json")
};

export function readConfig() {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
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

  const dataDir = path.dirname(config.dataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  return config;
}

export function writeConfig(config: Config | null) {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
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
