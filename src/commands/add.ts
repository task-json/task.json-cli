/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import crypto from "node:crypto";
import { Command } from "commander";
import { DateTime } from 'luxon';
import { Task } from "task.json";
import { readData, writeData } from "../utils/config";
import { parseDate } from '../utils/date';
import { numberToId } from "../utils/task";

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


function execute(options: AddOptions) {
	const taskJson = readData("task");
	const workspace = options.workspace ? readData("workspace").find(ws => ws.enabled) : undefined;

	const date = DateTime.now().toISO();
	const wait = options.wait && parseDate(options.wait);
	const due = options.due && parseDate(options.due);

	let deps: string[] | undefined = undefined;
	if (options.dep)
		deps = numberToId(taskJson, options.dep);

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
		workspace?.config.projects?.filter(v => !v.startsWith("!"))
	)?.filter(v => v !== "");
	const contexts = (options.ctx ??
		workspace?.config.contexts?.filter(v => !v.startsWith("!"))
	)?.filter(v => v !== "");

	// use workpsace's values if not specified
	const task: Task = {
		id: crypto.randomUUID(),
		text: options.text,
		priority: options.prior,
		contexts: contexts?.length ? contexts : undefined,
		projects: projects?.length ? projects : undefined,
		deps,
		wait,
		due,
		start: date,
		modified: date
	};

	taskJson.todo.push(task);
	writeData("task", taskJson);

	console.log(`Task t${taskJson.todo.length} added: ${options.text}`);
}

export default addCmd;
