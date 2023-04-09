/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { eraseTasks, classifyTaskJson } from "task.json";
import inquirer from "inquirer";
import { readData, writeData } from "../utils/config.js";
import { numbersToIndexes, indexesToTasks } from "../utils/task.js";

const eraseCmd = new Command("erase");

type EraseOptions = {
	force?: boolean
};

eraseCmd
	.description("erase task(s) permanently")
	.option("-f, --force", "force erasing without confirmation")
	.argument("<num...>", "task # to erase (must be removed task for safety)")
	.action(execute);

async function execute(nums: string[], options: EraseOptions) {
	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const indexes = numbersToIndexes(nums);

	// Don't allow erase todo or done tasks
	classified.todo = [];
	classified.done = [];
	
	// Keep unique ids
	const ids = [...new Set(
		indexesToTasks(classified, indexes).map(t => t.id)
	)];

	let confirm = true;
	if (!options.force) {
		const answer = await inquirer.prompt([{
			type: "confirm",
			name: "confirm",
			message: "Warning: This will erase the REMOVED tasks permanently. Make sure the erased tasks are not in other servers and clients if you want to sync with them. Continue?",
			default: false
		}]);
		confirm = answer.confirm;
	}

	if (confirm) {
		tj = eraseTasks(tj, ids);
		writeData("task", tj);
		console.log(`Erase ${ids.length} task(s)`);
	}
}

export default eraseCmd;
