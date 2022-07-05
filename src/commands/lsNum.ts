/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import range from "lodash/range.js";
import { readData } from '../utils/config.js';
import { normalizeTypes } from "../utils/task.js";

const lsNumCmd = new Command("lsNum");

type LsNumOptions = {
	type: string[]
};

lsNumCmd
	.description("list numbers")
	.addOption(
		new Option("-T, --type <types...>", "filter tasks by types")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.action(execute);


function execute(options: LsNumOptions) {
	const types = normalizeTypes(options.type);
	const taskJson = readData("task");

	const nums: string[] = [];
	for (const type of types) {
		const size = taskJson[type].length;
		nums.push(...range(1, size+1).map(n => `${type.charAt(0)}${n}`));
	}

	console.log(nums.join("\n"));
}

export default lsNumCmd;
