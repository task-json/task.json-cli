/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { DateTime } from "luxon";
import { Task, TaskJson, DiffStat, taskUrgency, dueUrgency, classifyTaskJson, TaskStatus, ClassifiedTaskJson, indexTaskJson, IndexedTaskJson } from "task.json";
import { isTaskStatus } from "task.json/dist/index.guard.js";

const statusMap: { [key: string]: TaskStatus } = {
  t: "todo",
  d: "done",
  r: "removed"
};

/// Index: (status, index of tasks of that status)
export type TaskIndex = [TaskStatus, number];

export function numbersToIndexes(nums: string[]): TaskIndex[] {
  const handleError = (num: string): never => {
    throw new Error(`Invalid Number: ${num}`);
  };
  
  // Keep only unique nums
  return [...new Set(nums)].map(num => {
    if (num.length <= 1)
      handleError(num);
    const s = num.substring(0, 1);
    const n = parseInt(num.substring(1));
    if (isNaN(n) || n < 0 || !(s in statusMap))
      handleError(num);

    return [statusMap[s], n];
  });
}


export function colorTask(task: Task) {
  const urgency = taskUrgency(task);
  // gray if it's pending or has todo dependant
  if (!filterByWait(false)(task) || !filterByDeps(false)(task))
    return "gray";

  if (urgency >= 1000)
    return "red";
  if (urgency >= 600)
    return "yellow";
  if (urgency >= 2)
    return "cyan";
  return null;
}

export function colorPriority(pri: string) {
  switch (pri) {
    case "A":
      return "red";
    case "B":
      return "yellow";
    default:
      return "cyan";
  }
}

export function colorDue(due: string) {
  const urgency = dueUrgency(due);
  if (urgency >= 1000)
    return "red";
  if (urgency >= 600)
    return "yellow";
  return null;
}

export function idsToNumbers(classified: ClassifiedTaskJson, ids: string[]) {
  return ids.map(id => {
    let num: string | null = null;
    for (const [status, tasks] of Object.entries(classified)) {
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        num = `${status.charAt(0)}${index}`;
        break;
      }
    }
    if (!num) {
      throw new Error(`Invalid id: ${id}`);
    }
    return num;
  });
}

export function indexesToTasks(classified: ClassifiedTaskJson, indexes: TaskIndex[]) {
  return indexes.map(([status, i]) => {
    if (i >= classified[status].length)
      throw new Error(`Invalid index: ${status.substring(0, 1)}${i}`);
    return classified[status][i];
  });
}

/// Find tasks for given numbers
export function numbersToTasks(classified: ClassifiedTaskJson, numbers: string[]) {
  const indexes = numbersToIndexes(numbers);
  return indexesToTasks(classified, indexes);
}

export function numbersToIds(classified: ClassifiedTaskJson, numbers: string[]) {
  return numbersToTasks(classified, numbers).map(t => t.id);
}

export function indexesToIds(classified: ClassifiedTaskJson, indexes: TaskIndex[]) {
  return indexesToTasks(classified, indexes).map(t => t.id);
}

export function normalizeStatuses(statuses: string[]) {
  const result: Set<TaskStatus> = new Set();
  for (const st of statuses) {
    if (st === "all") {
      result.add("todo");
      result.add("done");
      result.add("removed");
    }
    else {
      if (!isTaskStatus(st)) {
        throw new Error(`Invalid status: ${st}`);
      }
      result.add(st as TaskStatus);
    }
  }
  return [...result];
}

export function filterByWait(flag: boolean | undefined) {
  // Showing all tasks if flag is true
  if (flag)
    return () => true;

  return (task: Task) => {
    if (task.wait) {
      const date = DateTime.fromISO(task.wait);
      // true if the wait date is after current date
      return DateTime.now() >= date;
    }
    return true;
  };
}

export function filterByDeps(flag: boolean | undefined) {
  // Showing all tasks if flag is true
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
export function filterByField(field: "projects" | "contexts", values: string[] | undefined) {
  if (!values)
    return () => true;

  return (task: Task) => {
    // whether there's positive filter
    let hasPos = false;
    let posResult = false;
    let negResult = true;
    values.forEach(value => {
      if (value.length === 0)
        posResult = posResult || task[field] === undefined;
      else if (value[0] === "!") {
        // use and operator for negative filter
        negResult = negResult && !(task[field]?.includes(value.substring(1)));
      }
      else {
        posResult = posResult || Boolean(task[field]?.includes(value));
        hasPos = true;
      }
    });

    return negResult && (!hasPos || posResult);
  };
}

export function stringifyDiffStat(stat: DiffStat) {
	return Object.entries(stat)
		.map(([key, value]) => `${key}: ${value}`)
		.join(", ");
}

/**
 * Stringified task
 */
export type TaskStr = {
  number: string;
  priority: string;
  text: string;
  deps?: string;
  wait?: string;
  projects: string;
  contexts: string;
  due: string;
  color: ReturnType<typeof colorTask> | null;
};

export function maxWidth(tasks: TaskStr[], deps: boolean | undefined, wait: boolean | undefined) {
  const initWidths = {
    text: 4,
    contexts: 3,
    projects: 4,
    deps: deps ? 3 : 0,
    wait: wait ? 4 : 0,
    due: 3
  };
  return tasks.reduce<typeof initWidths>((widths, task) => {
    for (const [field, value] of Object.entries(widths)) {
      if (field === "deps" && !deps)
        continue;
      if (field === "wait" && !wait)
        continue;
      type Key = keyof typeof initWidths;
      widths[field as Key] = Math.max(task[field as Key]!.length, value);
    }
    return widths;
  }, initWidths);
}
