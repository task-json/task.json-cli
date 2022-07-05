/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { undoTasks } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { parseNumbers } from "../utils/task.js";

const undoCmd = new Command("undo");

undoCmd
	.description("undo task(s)")
	.argument("<num...>", "task # to undo")
	.action(execute);


function execute(nums: string[]) {
	const taskJson = readData("task");
	const indexes = parseNumbers(nums, taskJson);
	if (indexes.todo.length > 0)
		undoCmd.error("Cannot delete removed tasks")
	undoTasks(taskJson, "done", indexes.done);
	undoTasks(taskJson, "removed", indexes.removed);
	writeData("task", taskJson);

	console.log(`Undo ${new Set(indexes.done).size + new Set(indexes.removed).size} task(s)`);
}

export default undoCmd;
