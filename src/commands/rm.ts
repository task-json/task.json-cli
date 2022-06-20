/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { removeTasks } from "task.json";
import { readData, writeData } from "../utils/config";
import { parseNumbers } from "../utils/task";

const rmCmd = new Command("rm");

rmCmd
	.description("delete task(s)")
	.argument("<num...>", "task # to delete")
	.action(execute);

function execute(nums: string[]) {
	const taskJson = readData("task");
	const indexes = parseNumbers(nums, taskJson);
	if (indexes.removed.length > 0)
		rmCmd.error("Cannot delete removed tasks")
	removeTasks(taskJson, "todo", indexes.todo);
	removeTasks(taskJson, "done", indexes.done);
	writeData("task", taskJson);

	console.log(`Remove ${new Set(indexes.todo).size + new Set(indexes.done).size} task(s)`);
}

export default rmCmd;
