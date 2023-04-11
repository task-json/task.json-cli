/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import path from "path";
import os from "os";
import fs from "node:fs";
import { TaskJson } from "task.json";
import { Server, Workspace } from "./types.js";

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
  

function deserializeData(data: string) {
  return data
		.trim()  // Trim white spaces to avoid empty lines
		.split("\n")
		.map(line => JSON.parse(line));
};

function serializeData<T extends Type>(data: DataType<T>) {
	return data
		.map(item => JSON.stringify(item))
		.join("\n");
};

export async function readData<T extends Type>(type: T): Promise<DataType<T>> {
  const dataPath = path.join(pathConfig.root, pathConfig[type]);
  try {
    return deserializeData(fs.readFileSync(dataPath, "utf-8")) as any;
  }
  catch (err) {
    return [] as any;
  }
}

/// null means deleting the file
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
      // Add an extra newline to make it easier to append
      serializeData(data) + "\n",
      { encoding: "utf8" }
    );
  }
}

/// Assume that there is a new line at the end of file
export function appendData<T extends Type>(type: T, data: DataType<T>) {
  emptyRootGuard();
  const dataPath = path.join(pathConfig.root, pathConfig[type]);

  // Backup task.json
  if (type === "task" && fs.existsSync(dataPath))
    fs.copyFileSync(dataPath, dataPath + ".bak");

  fs.appendFileSync(
    dataPath,
    // Add an extra newline to make it easier to append
    serializeData(data) + "\n",
    { encoding: "utf8" }
  );
}
