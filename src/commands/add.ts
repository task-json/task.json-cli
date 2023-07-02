/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { Task } from "task.json";

const addCmd = new Command("add");

type AddOptions = {
	text: string;
	prior?: string,
	proj?: string[],
	ctx?: string[],
	dep?: string[],
	wait?: string,
	due?: string,
	workspace: boolean
};

addCmd
	.description("add a new task")
	.requiredOption("-t, --text <text>", "text")
	.option("-P, --prior <prior>", "priority (A-Z)")
	.option("-p, --proj <projects...>", "projects")
	.option("-c, --ctx <contexts...>", "contexts")
	.option("-D, --dep <dependencies...>", "dependencies (use #)")
	.option("-w, --wait <date>", "wait until the specified date")
	.option("-d, --due <date>", "due date")
	.option("--no-workspace", "ignore workspace settings temporarily")
	.action(execute);


async function execute(options: AddOptions) {
	const crypto = await import("node:crypto");
	const { DateTime } = await import("luxon");
	const { appendData, readData } = await import("../utils/config.js");
	const { numbersToIds } = await import("../utils/task.js");
	const { parseDate } = await import("../utils/date.js");
	const { classifyTaskJson } = await import("task.json");
	
	const taskJson = await readData("task");
	const classified = classifyTaskJson(taskJson);

	const ws = options.workspace ? (await readData("workspace")).find(w => w.enabled) : undefined;
	const date = DateTime.now().toISO();
	const wait = options.wait && parseDate(options.wait);
	const due = options.due && parseDate(options.due);


	let deps: string[] | undefined = undefined;
	if (options.dep)
		deps = numbersToIds(classified, options.dep);

	// Make sure no name start with !
	options.proj?.forEach(v => {
		if (v.startsWith("!"))
			addCmd.error(`Project cannot start with !: ${v}`);
	})
	options.ctx?.forEach(v => {
		if (v.startsWith("!"))
			addCmd.error(`Context cannot start with !: ${v}`);
	})

	// Remove empty values
	const projects = (options.proj ??
		ws?.config.projects?.filter(v => !v.startsWith("!"))
	)?.filter(v => v !== "");
	const contexts = (options.ctx ??
		ws?.config.contexts?.filter(v => !v.startsWith("!"))
	)?.filter(v => v !== "");

	// use workpsace's values if not specified
	const task: Task = {
		id: crypto.randomUUID(),
		status: "todo",
		text: options.text,
		priority: options.prior,
		contexts: contexts?.length ? contexts : undefined,
		projects: projects?.length ? projects : undefined,
		deps,
		wait,
		due,
		created: date,
		modified: date
	};

	appendData("task", [task]);

	console.log(`Task t${classified.todo.length} added: ${options.text}`);
}

export default addCmd;
