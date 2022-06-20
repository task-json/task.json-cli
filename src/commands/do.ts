/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { doTasks } from "task.json";
import { readData, writeData } from "../utils/config";
import { parseNumbers } from "../utils/task";

const doCmd = new Command("do");

doCmd
	.description("mark task(s) as done")
	.argument("<num...>", "task # to mark")
	.action(execute);


function execute(nums: string[]) {
	const taskJson = readData("task");
	const indexes = parseNumbers(nums, taskJson);
	if (indexes.removed.length + indexes.done.length > 0)
		doCmd.error("Cannot do done tasks or removed tasks");
	doTasks(taskJson, indexes.todo);
	writeData("task", taskJson);

	console.log(`Finish ${new Set(indexes.todo).size} task(s)`);
}

export default doCmd;
