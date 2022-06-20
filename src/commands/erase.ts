/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { eraseTasks } from "task.json";
import inquirer from "inquirer";
import { readData, writeData } from "../utils/config";
import { parseNumbers } from "../utils/task";

const eraseCmd = new Command("erase");

type EraseOptions = {
	force?: boolean
};

eraseCmd
	.description("erase task(s) permanently")
	.option("-f, --force", "force erasing without confirmation")
	.argument("<num...>", "task # to erase")
	.action(execute);

async function execute(nums: string[], options: EraseOptions) {
	const taskJson = readData("task");
	const indexes = parseNumbers(nums, taskJson);

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
		if (indexes.todo.length + indexes.done.length > 0)
			eraseCmd.error("Cannot erase todo or done tasks");
		eraseTasks(taskJson, indexes.removed);
		writeData("task", taskJson);
		console.log(`Erase ${new Set(indexes.removed).size} task(s)`);
	}
}

export default eraseCmd;
