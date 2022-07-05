/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { readData } from "../utils/config.js";
import { normalizeTypes } from "../utils/task.js";

const lsCtxCmd = new Command("lsCtx");

type LsCtxOptions = {
	type: string[]
};

lsCtxCmd
	.description("list contexts")
	.addOption(
		new Option("-T, --type <types...>", "filter tasks by types")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


function execute(options: LsCtxOptions) {
	const contexts: Set<string> = new Set();
	const types = normalizeTypes(options.type);
	const taskJson = readData("task");

	for (const type of types)
		for (const task of taskJson[type])
			task.contexts?.forEach(c => {
				contexts.add(c);
			});

	console.log([...contexts].join("\n"));
}

export default lsCtxCmd;
