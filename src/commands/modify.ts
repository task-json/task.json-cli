/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { Task } from "task.json";

const modifyCmd = new Command("modify");

type ModifyOptions = {
	status?: string[],
	filterPrior?: string[],
	filterProj?: string[],
	filterCtx?: string[],
	text?: string,
	prior?: string,
	proj?: string[],
	ctx?: string[],
	dep?: string[],
	wait?: string,
	due?: string
};

modifyCmd
	.description("modify tasks (use empty string to delete field)")
	.addOption(
		new Option("-S, --status <status...>", "filter tasks by status")
			.choices(["todo", "done", "removed", "all"])
	)
	.option("--filter-prior <priorities...>", "filter tasks by priorities (A-Z)")
	.option("--filter-proj <projects...>", "filter tasks by projects")
	.option("--filter-ctx <contexts...>", "filter tasks by contexts")
	.option("-t, --text <text>", "modify text")
	.option("-P, --prior <prior>", "modify priority (A-Z)")
	.option("-p, --proj <projects...>", "modify projects")
	.option("-c, --ctx <contexts...>", "modify contexts")
	.option("-D, --dep <dependencies...>", "modify dependencies (use #)")
	.option("-w, --wait <date>", "modify wait date")
	.option("-d, --due <date>", "modify due date")
	.argument("[num...]", "task # to modify")
	.action(execute);

async function execute(nums: string[], options: ModifyOptions) {
	const { default: inquirer } = await import("inquirer");
	const { DateTime } = await import('luxon');
	const { classifyTaskJson } = await import("task.json");
	const { readData, writeData } = await import("../utils/config.js");
	const { parseDate } = await import("../utils/date.js");
	const {
		normalizeStatuses,
		filterByField,
		filterByPriority,
		numbersToTasks,
		numbersToIds
	} = await import("../utils/task.js");

	let hasFilters = false;
	const filterOptions: (keyof ModifyOptions)[] = [
		"filterPrior",
		"filterProj",
		"filterCtx",
		"status"
	];
	for (const filterOption of filterOptions) {
		if (options[filterOption] !== undefined) {
			hasFilters = true;
			break;
		}
	}

	if (nums.length > 0 && hasFilters) {
		modifyCmd.error("Cannot use both numbers and filters.");
	}
	if (!hasFilters && nums.length === 0) {
		const answer = await inquirer.prompt([{
			type: "confirm",
			name: "confirm",
			message: "No filter or task number specified. This will make changes to ALL tasks. Continue?",
			default: false
		}]);
		if (!answer.confirm) {
			return;
		}
	}

	let tj = await readData("task");
	const classified = classifyTaskJson(tj);
	const date = DateTime.now().toISO();

	const modifyDate = (task: Task, field: "due" | "wait", value: string) => {
		if (value.length === 0) {
			delete task[field];
		}
		else {
			try {
				task[field] = parseDate(value);
			}
			catch (err: any) {
				modifyCmd.error(err.message);
			}
		}
	};

	const modifyArray = (task: Task, field: "projects" | "contexts" | "deps", value: any[]) => {
		if (value.length === 1 && value[0].length === 0) {
			delete task[field];
		}
		else {
			for (const v of value) {
				if (v.length === 0) {
					modifyCmd.error(`empty ${field} not allowed`);
				}
			}
			
			task[field] = field === "deps" ?
				numbersToIds(classified, value) :
				value;
		}
	};

	const modifyTask = (task: Task) => {
		let modified = false;

			const fields: (keyof Task)[] = ["text", "priority", "projects", "contexts", "wait", "due", "deps"];

		if (options.text !== undefined) {
			if (options.text.length === 0) {
				modifyCmd.error("empty text not allowed")
			}
			task.text = options.text;
			modified = true;
		}

		if (options.prior !== undefined) {
			if (options.prior.length === 0) {
				delete task.priority;
			}
			else {
				task.priority = options.prior;
				modified = true;
			}
		}
		if (options.proj !== undefined) {
			modifyArray(task, "projects", options.proj);
			modified = true;
		}
		if (options.ctx !== undefined) {
			modifyArray(task, "contexts", options.ctx);
			modified = true;
		}
		if (options.dep !== undefined) {
			modifyArray(task, "deps", options.dep)
			modified = true;
		}
		if (options.wait !== undefined) {
			modifyDate(task, "wait", options.wait);
			modified = true;
		}
		if (options.due !== undefined) {
			modifyDate(task, "due", options.due);
			modified = true;
		}

		if (!modified) {
			modifyCmd.error("no field to modify");
		}

		task.modified = date;
	};

	let count = 0;
	if (nums.length === 0) {
		const statuses = normalizeStatuses(options.status ?? ["all"]);
		const priorityFilter = filterByPriority(options.filterPrior);
		const projectFilter = filterByField(
			"projects",
			options.filterProj
		);
		const contextFilter = filterByField(
			"contexts",
			options.filterCtx
		);

		for (const st of statuses) {
			classified[st]
				.filter(task => (
					projectFilter(task) &&
					contextFilter(task) &&
					priorityFilter(task)
				))
				.forEach(task => {
					// Modify in place
					modifyTask(task);
					count++;
				});
		}
	}
	else {
		const tasks = numbersToTasks(classified, nums);
		// Modify in place
		tasks.forEach(modifyTask);
		count += tasks.length;
	}

	writeData("task", tj);
	console.log(`Modified ${count} task(s)`);
}

export default modifyCmd;
