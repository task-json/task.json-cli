/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { readData } from '../utils/config';
import { normalizeTypes } from "../utils/task";

const lsprojCmd = new Command("lsproj");

type LsprojOptions = {
	type: string[]
};

lsprojCmd
	.description("list projects")
	.addOption(
		new Option("-T, --type <types...>", "filter tasks by types")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


function execute(options: LsprojOptions) {
	const projects: Set<string> = new Set();
	const types = normalizeTypes(options.type);
	const taskJson = readData("task");

	for (const type of types)
		for (const task of taskJson[type])
			task.projects?.forEach(c => {
				projects.add(c);
			});

	console.log([...projects].join("\n"));
}

export default lsprojCmd;
