/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";

const showCmd = new Command("show");

type ShowOptions = {
	iso?: boolean
};

showCmd
	.description("show task details")
	.option("--iso", "show date in ISO format")
	.argument("<num...>", "task # to show")
	.action(execute);


async function execute(nums: string[], options: ShowOptions) {
	const { default: chalk } = await import("chalk");
	const { classifyTaskJson } = await import("task.json");
	const { DateTime } = await import('luxon');
	const { readData } = await import("../utils/config.js");
	const { colorPriority, colorDue, numbersToTasks } = await import("../utils/task.js");
	const { showDate } = await import("../utils/date.js");
	const { printAttrs } = await import("../utils/format.js");

	const tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const tasks = numbersToTasks(classified, nums);

	tasks.forEach((t, i) => {
		const num = chalk.bold(`${t.status.charAt(0)}${i}`);
		const attrs: [string, string][] = [];
		
		attrs.push(["status", t.status]);
		if (t.priority) {
			const priColor = colorPriority(t.priority);
			attrs.push(["prior", chalk[priColor].bold(t.priority)]);
		}
		attrs.push(["text", t.text])
		if (t.deps) {
			attrs.push(["deps", t.deps.join(" ")]);
		}
		if (t.projects) {
			attrs.push(["proj", t.projects.join(" ")]);
		}
		if (t.contexts) {
			attrs.push(["ctx", t.contexts.join(" ")]);
		}
		if (t.due) {
			const dueColor = colorDue(t.due);
			const due = options.iso ? t.due : showDate(DateTime.fromISO(t.due));
			const coloredDue = dueColor ? chalk[dueColor].bold(due) : due;
			attrs.push(["due", coloredDue]);
		}
		if (t.wait) {
			const wait = options.iso ? t.wait : showDate(DateTime.fromISO(t.wait));
			attrs.push(["wait", wait]);
		}

		console.log(`\nTask ${num}`);
		printAttrs(attrs, {
			keyColor: "cyanBright",
			prefix: "  "
		});
	});
}

export default showCmd;
