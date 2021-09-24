import { reset } from "chalk";
import * as fs from "fs";
import { Task, TaskJson, DiffStat, initTaskJson, taskUrgency, TaskType, idToIndex } from "task.json";
import { dataPath } from "./config";

export function readTaskJson() {
  let taskJson: TaskJson;
  try {
    const data = fs.readFileSync(dataPath, { encoding: "utf8" });
    taskJson = JSON.parse(data);
  }
  catch (error) {
    taskJson = initTaskJson();
  }
  return taskJson;
}

export function writeTaskJson(taskJson: TaskJson) {
  // Backup
  if (fs.existsSync(dataPath))
    fs.renameSync(dataPath, dataPath + ".bak");

  fs.writeFileSync(
    dataPath,
    JSON.stringify(taskJson, null, "\t"),
    { encoding: "utf8" }
  );
}

export function maxWidth(tasks: {
  index: number;
  task: Task;
}[], field: "contexts" | "projects" | "text" | "due" | "deps") {
  return tasks.reduce((width: number, { task }) => {
    let w = 0;
    switch (field) {
      case "contexts":
        w = 3;
      case "projects":
        w = 4;
        w = Math.max(task[field]?.join(" ").length ?? 0, w);
        break;
      case "text":
        w = Math.max(task.text.length, 4);
        break;
      case "due":
        w = task.due ? 10 : 3;
        break;
      case "deps":
        w = Math.max(task.deps?.join(" ").length ?? 0, 3);
        break;
    }
    return Math.max(w, width);
  }, 0);
}

export function colorTask(task: Task) {
  const urgency = taskUrgency(task);
  if (urgency >= 1000)
    return "red";
  if (urgency >= 100)
    return "yellow";
  if (urgency >= 1)
    return "cyan";
  return null;
}

export function idToNumber(taskJson: TaskJson, ids: string[]) {
  const types: TaskType[] = ["todo", "done", "removed"];
  const numbers: string[] = [];
  for (const type of types) {
    const indexes = idToIndex(taskJson, type, ids);
    for (const index of indexes)
      numbers.push(`${type.charAt(0)}${index+1}`);
  }
  return numbers;
}

export function parseNumbers(numbers: string[], taskJson: TaskJson) {
  const handleError = (num: string): never => {
    throw new Error(`Invalid Number: ${num}`);
  };
  const result = {
    todo: [] as number[],
    done: [] as number[],
    removed: [] as number[]
  };

  for (const num of numbers) {
    if (num.length <= 1)
      handleError(num);
    const typeStr = num.substring(0, 1);
    const n = parseInt(num.substring(1));
    if (isNaN(n) || n <= 0)
      handleError(num);
    
    const typeMap: { [key: string]: TaskType } = {
      t: "todo",
      d: "done",
      r: "removed"
    };
    if (!(typeStr in typeMap))
      handleError(num);

    const type = typeMap[typeStr];
    if (n > taskJson[type].length)
      handleError(num);
    result[type].push(n-1);
  }

  return result;
}

export function numberToId(taskJson: TaskJson, numbers: string[]) {
  const result = parseNumbers(numbers, taskJson);
  // Get id for deps
  const ids: string[] = [];
  for (const [type, indexes] of Object.entries(result)) {
    for (const index of indexes)
      ids.push(taskJson[type as TaskType][index].id);
  }
  return ids;
}

export function normalizeTypes(types: string[]) {
  const preset = new Set(["todo", "done", "removed", "all"])
  const result: Set<TaskType> = new Set();
  for (const type of types) {
    if (!preset.has(type))
      throw new Error(`Invalid task type: ${type}`);
      
    if (type === "all") {
      result.add("todo");
      result.add("done");
      result.add("removed");
      break;
    }
    else
      result.add(type as TaskType);
  }
  return [...result];
}

export function filterByDeps(flag: boolean) {
  // Filter when not showing deps
  if (flag)
    return () => true;

  return (task: Task) => {
    if (task.deps)
      for (const dep of task.deps) {
        // Deps in todo
        if (dep.startsWith("t"))
          return false;
      }
    return true;
  };
}

export function filterByPriority(priorities: string[] | undefined) {
  if (!priorities)
    return () => true;

  return (task: Task) => {
    for (const p of priorities) {
      if (p.length === 0 && task.priority === undefined)
        return true;
      if (p.length > 0 && task.priority === p)
        return true;
    }
    return false;
  };
}

// Filter by projects or contexts
export function filterByField(field: "projects" | "contexts", values: string[] | undefined, and: boolean) {
  if (!values)
    return () => true;

  const op = (left: boolean, right: boolean) => (
    and ? (left && right) : (left || right)
  );

  return (task: Task) => {
    let result = and;
    values.forEach(value => {
      if (value.length === 0)
        result = op(result, task[field] === undefined);
      else
        result = op(result, Boolean(task[field]?.includes(value)));
    });

    return result;
  };
}

export function stringifyDiffStat(stat: DiffStat) {
	return Object.entries(stat)
		.map(([key, value]) => `${key}: ${value}`)
		.join(", ");
}

