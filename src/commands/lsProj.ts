/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";

const lsProjCmd = new Command("lsProj");

type LsProjOptions = {
	status: string[]
};

lsProjCmd
	.description("list projects")
	.addOption(
		new Option("-S, --status <status...>", "filter tasks by status")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


async function execute(options: LsProjOptions) {
	const { classifyTaskJson } = await import("task.json");
	const { readData } = await import('../utils/config.js');
	const { normalizeStatuses } = await import("../utils/task.js");
	
	const projects: Set<string> = new Set();
	const statuses = normalizeStatuses(options.status);
	const taskJson = await readData("task");
	const classified = classifyTaskJson(taskJson);

	for (const st of statuses)
		for (const task of classified[st])
			task.projects?.forEach(c => {
				projects.add(c);
			});

	console.log([...projects].join("\n"));
}

export default lsProjCmd;
