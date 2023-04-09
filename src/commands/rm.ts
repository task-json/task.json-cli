/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { classifyTaskJson, removeTasks } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { numbersToTasks } from "../utils/task.js";

const rmCmd = new Command("rm");

type RmOptions = {
	quiet?: boolean
};

rmCmd
	.description("delete task(s)")
	.option("-q, --quiet", "without showing task text verbosely")
	.argument("<num...>", "task # to delete")
	.action(execute);

async function execute(nums: string[], options: RmOptions) {
	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const tasks = numbersToTasks(classified, nums);
	tasks.forEach(t => {
		if (t.status === "removed") {
			rmCmd.error("Cannot delete removed tasks");
		}
	});
	tj = removeTasks(tj, tasks.map(t => t.id));
	writeData("task", tj);

	console.log(`Removed ${tasks.length} task(s)`);
	if (!options.quiet) {
		tasks.forEach((t, i) => {
			console.log(`- ${nums[i]}: ${t.text}`);
		});
	}
}

export default rmCmd;
