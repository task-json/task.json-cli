/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { readData } from '../utils/config';
import { normalizeTypes } from "../utils/task";

const lsctxCmd = new Command("lsctx");

type LsctxOptions = {
	type: string[]
};

lsctxCmd
	.description("list contexts")
	.addOption(
		new Option("-T, --type <types...>", "filter tasks by types")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


function execute(options: LsctxOptions) {
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

export default lsctxCmd;
