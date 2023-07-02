/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";

const dueCmd = new Command("due");

type DueOptions = {
	iso?: boolean
};

dueCmd
	.description("show most recent due date")
	.option("--iso", "show due date in ISO format")
	.action(execute);

async function execute(options: DueOptions) {
	const { DateTime } = await import('luxon');
	const { readData } = await import("../utils/config.js");
	const{ showDate } = await import("../utils/date.js");

	const tj = await readData("task");
	let due = undefined;
	for (const task of tj) {
		if (task.due) {
			const date = DateTime.fromISO(task.due);
			if (due === undefined || date < due) {
				due = date;
			}
		}
	}

	if (due !== undefined) {
		if (options.iso)
			console.log(due.toISO());
		else
			console.log(showDate(due));
	}
}

export default dueCmd;
