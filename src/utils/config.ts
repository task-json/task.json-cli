/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { initTaskJson, TaskJson } from "task.json";
import { Server, Workspace } from "./types";

export const pathConfig = {
  root: process.env.TASK_JSON_PATH || path.join(os.homedir(), ".config/task.json"),
  // relative to root
  server: "server.json",
  task: "task.json",
  workspace: "workspace.json"
};

export function emptyRootGuard() {
  if (!fs.existsSync(pathConfig.root)) {
    fs.mkdirSync(pathConfig.root, { recursive: true });
  }
}

// conditional returen type
type Type = "server" | "task" | "workspace";
type DataType<T extends Type> =
  T extends "task" ? TaskJson :
  T extends "server" ? Server[] :
  T extends "workspace" ? Workspace[] :
  never;

export function readData<T extends Type>(type: T): DataType<T> {
  const dataPath = path.join(pathConfig.root, pathConfig[type]);
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  }
  catch (err) {
    if (type === "task") {
      return initTaskJson() as DataType<T>;
    }
    else {
      return [] as any;
    }
  }
}

export function writeData<T extends Type>(type: T, data: DataType<T> | null) {
  emptyRootGuard();
  const dataPath = path.join(pathConfig.root, pathConfig[type]);

  // Backup task.json
  if (type === "task" && fs.existsSync(dataPath))
    fs.renameSync(dataPath, dataPath + ".bak");

  if (data === null) {
    if (fs.existsSync(dataPath))
      fs.unlinkSync(dataPath);
  }
  else {
    fs.writeFileSync(
      dataPath,
      JSON.stringify(data, null, "\t"),
      { encoding: "utf8" }
    );
  }
}
