/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import chalk from "chalk";
import { TaskType } from "task.json";
import { DateTime } from 'luxon';
import { readData } from "../utils/config";
import { parseNumbers } from "../utils/task";
import { colorPriority, colorDue } from "../utils/task";
import { showDate } from "../utils/date";

const showCmd = new Command("show");

type ShowOptions = {
	iso?: boolean
};

showCmd
	.description("show task details")
	.option("--iso", "show due date in ISO format")
	.argument("<num...>", "task # to show")
	.action(execute);


function execute(nums: string[], options: ShowOptions) {
	const taskJson = readData("task");
	const numbers = parseNumbers(nums, taskJson);

	for (const [type, indexes] of Object.entries(numbers)) {
		for (const index of indexes) {
			const task = taskJson[type as TaskType][index];
			const color = chalk.cyanBright;
			const num = chalk.bold(`${type.charAt(0)}${index + 1}`);
			console.log(`\nTask ${num}`);
			console.log(`  ${color("Status")}: ${type}`);
			if (task.priority) {
				const priColor = colorPriority(task.priority);
				console.log(`  ${color("Pri")}: ${chalk[priColor].bold(task.priority)}`);
			}
			console.log(`  ${color("Text")}: ${task.text}`);
			if (task.deps)
				console.log(`  ${color("Deps")}: ${task.deps.join(" ")}`);
			if (task.projects)
				console.log(`  ${color("Proj")}: ${task.projects.join(" ")}`);
			if (task.contexts)
				console.log(`  ${color("Ctx")}: ${task.contexts.join(" ")}`);
			if (task.due) {
				const dueColor = colorDue(task.due);
				const due = options.iso ? task.due : showDate(DateTime.fromISO(task.due));
				const coloredDue = dueColor ? chalk[dueColor].bold(due) : due;
				console.log(`  ${color("Due")}: ${coloredDue}`)
			}
			if (task.wait) {
				const wait = options.iso ? task.wait : showDate(DateTime.fromISO(task.wait));
				console.log(`  ${color("Wait")}: ${wait}`);
			}
		}
	}
}

export default showCmd;
