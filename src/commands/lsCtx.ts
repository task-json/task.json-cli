/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { classifyTaskJson } from "task.json";
import { readData } from "../utils/config.js";
import { normalizeStatuses } from "../utils/task.js";

const lsCtxCmd = new Command("lsCtx");

type LsCtxOptions = {
	status: string[]
};

lsCtxCmd
	.description("list contexts")
	.addOption(
		new Option("-S, --status <status...>", "filter tasks by status")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


async function execute(options: LsCtxOptions) {
	const contexts: Set<string> = new Set();
	const statuses = normalizeStatuses(options.status);
	const taskJson = await readData("task");
	const classified = classifyTaskJson(taskJson);

	for (const st of statuses)
		for (const task of classified[st])
			task.contexts?.forEach(c => {
				contexts.add(c);
			});

	console.log([...contexts].join("\n"));
}

export default lsCtxCmd;
