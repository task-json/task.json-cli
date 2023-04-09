/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { doTasks, classifyTaskJson } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { numbersToIndexes, indexesToTasks } from "../utils/task.js";

const doCmd = new Command("do");

doCmd
	.description("mark task(s) as done")
	.argument("<num...>", "task # to mark (must be todo task)")
	.action(execute);


async function execute(nums: string[]) {
	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const indexes = numbersToIndexes(nums);

	// Don't allow do removed or done tasks
	classified.done = [];
	classified.removed = [];
	
	// Keep unique ids
	const ids = [...new Set(
		indexesToTasks(classified, indexes).map(t => t.id)
	)];

	tj = doTasks(tj, ids);
	writeData("task", tj);

	console.log(`Finish ${ids.length} task(s)`);
}

export default doCmd;
