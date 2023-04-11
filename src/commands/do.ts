/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { doTasks, classifyTaskJson } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { numbersToTasks, indexesToTasks } from "../utils/task.js";

const doCmd = new Command("do");

type DoOptions = {
	quiet?: boolean
};

doCmd
	.description("mark task(s) as done")
	.option("-q, --quiet", "without showing task text verbosely")
	.argument("<num...>", "task # to mark (must be todo task)")
	.action(execute);


async function execute(nums: string[], options: DoOptions) {
	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const tasks = numbersToTasks(classified, nums);
	// Don't allow do removed or done tasks
	tasks.forEach(t => {
		if (t.status !== "todo") {
			doCmd.error("Only todo tasks can be done");
		}
	});
	
	tj = doTasks(tj, tasks.map(t => t.id));
	writeData("task", tj);

	console.log(`Finish ${tasks.length} task(s)`);
	if (!options.quiet) {
		tasks.forEach((t, i) => {
			console.log(`- ${nums[i]}: ${t.text}`);
		});
	}
}

export default doCmd;
