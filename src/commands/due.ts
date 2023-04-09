/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { DateTime } from 'luxon';
import { readData } from "../utils/config.js";
import { showDate } from "../utils/date.js";

const dueCmd = new Command("due");

type DueOptions = {
	iso?: boolean
};

dueCmd
	.description("show most recent due date")
	.option("--iso", "show due date in ISO format")
	.action(execute);

async function execute(options: DueOptions) {
	const tj = await readData("task");
	let due: DateTime | null = null;
	for (const task of tj) {
		if (task.due) {
			const date = DateTime.fromISO(task.due);
			if (due === null || date < due) {
				due = date;
			}
		}
	}

	if (due !== null) {
		if (options.iso)
			console.log(due.toISO());
		else
			console.log(showDate(due));
	}
}

export default dueCmd;
