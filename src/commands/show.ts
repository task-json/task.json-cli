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
import { printAttrs } from "../utils/format";

const showCmd = new Command("show");

type ShowOptions = {
	iso?: boolean
};

showCmd
	.description("show task details")
	.option("--iso", "show date in ISO format")
	.argument("<num...>", "task # to show")
	.action(execute);


function execute(nums: string[], options: ShowOptions) {
	const taskJson = readData("task");
	const numbers = parseNumbers(nums, taskJson);

	for (const [type, indexes] of Object.entries(numbers)) {
		for (const index of indexes) {
			const task = taskJson[type as TaskType][index];
			const num = chalk.bold(`${type.charAt(0)}${index + 1}`);
			const attrs: [string, string][] = [];
			
			attrs.push(["status", type]);
			if (task.priority) {
				const priColor = colorPriority(task.priority);
				attrs.push(["prior", chalk[priColor].bold(task.priority)]);
			}
			attrs.push(["text", task.text])
			if (task.deps) {
				attrs.push(["deps", task.deps.join(" ")]);
			}
			if (task.projects) {
				attrs.push(["proj", task.projects.join(" ")]);
			}
			if (task.contexts) {
				attrs.push(["ctx", task.contexts.join(" ")]);
			}
			if (task.due) {
				const dueColor = colorDue(task.due);
				const due = options.iso ? task.due : showDate(DateTime.fromISO(task.due));
				const coloredDue = dueColor ? chalk[dueColor].bold(due) : due;
				attrs.push(["due", coloredDue]);
			}
			if (task.wait) {
				const wait = options.iso ? task.wait : showDate(DateTime.fromISO(task.wait));
				attrs.push(["wait", wait]);
			}

			console.log(`\nTask ${num}`);
			printAttrs(attrs, {
				keyColor: "cyanBright",
				prefix: "  "
			});
		}
	}
}

export default showCmd;
