/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { classifyTaskJson } from "task.json";
import { readData } from '../utils/config.js';
import { normalizeStatuses } from "../utils/task.js";
import { range } from "../utils/common.js";

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
