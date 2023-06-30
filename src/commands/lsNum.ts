/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";

const lsNumCmd = new Command("lsNum");

type LsNumOptions = {
	status: string[]
};

lsNumCmd
	.description("list task numbers")
	.addOption(
		new Option("-S, --status <status...>", "filter tasks by status")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


async function execute(options: LsNumOptions) {
	const { classifyTaskJson } = await import("task.json");
	const { readData } = await import('../utils/config.js');
	const { normalizeStatuses } = await import("../utils/task.js");
	const { range } = await import("../utils/common.js");

	const statuses = normalizeStatuses(options.status);
	const taskJson = await readData("task");
	const classified = classifyTaskJson(taskJson);

	for (const st of statuses) {
		for (const i of range(classified[st].length)) {
			console.log(`${st.charAt(0)}${i}`);
		}
	}
}

export default lsNumCmd;
