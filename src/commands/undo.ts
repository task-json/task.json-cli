/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";

const undoCmd = new Command("undo");

undoCmd
	.description("undo task(s)")
	.argument("<num...>", "task # to undo")
	.action(execute);


async function execute(nums: string[]) {
	const { classifyTaskJson, undoTasks } = await import("task.json");
	const { readData, writeData } = await import("../utils/config.js");
	const { numbersToTasks } = await import("../utils/task.js");

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
