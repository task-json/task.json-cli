/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { readData } from "../utils/config";
import { DateTime } from 'luxon';
import { showDate } from "../utils/date";

const dueCmd = new Command("due");

type DueOptions = {
	iso?: boolean
};

dueCmd
	.description("show most recent due date")
	.option("--iso", "show due date in ISO format")
	.action(execute);

function execute(options: DueOptions) {
	const taskJson = readData("task");
	let due: DateTime | null = null;
	for (const task of taskJson.todo) {
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
