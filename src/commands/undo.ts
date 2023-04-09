/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { classifyTaskJson, undoTasks } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { numbersToTasks } from "../utils/task.js";

const undoCmd = new Command("undo");

undoCmd
	.description("undo task(s)")
	.argument("<num...>", "task # to undo")
	.action(execute);


async function execute(nums: string[]) {
	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const tasks = numbersToTasks(classified, nums);
	tasks.forEach(t => {
		if (t.status === "removed") {
			undoCmd.error("Cannot undo todo tasks");
		}
	});
	tj = undoTasks(tj, tasks.map(t => t.id));
	writeData("task", tj);

	console.log(`Undo ${tasks.length} task(s)`);
}

export default undoCmd;
