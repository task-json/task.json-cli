/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import inquirer from "inquirer";
import { DateTime } from 'luxon';
import { Task, TaskType } from "task.json";
import { readData, writeData } from "../utils/config.js";
import { parseDate } from "../utils/date.js";
import {
	normalizeTypes,
	filterByField,
	filterByPriority,
	numberToId,
	parseNumbers
} from "../utils/task.js";

const modifyCmd = new Command("modify");

type ModifyOptions = {
	type?: string[],
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
		new Option("-T, --type <types...>", "filter tasks by types")
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
	let hasFilters = false;
	const filterOptions: (keyof ModifyOptions)[] = [
		"filterPrior",
		"filterProj",
		"filterCtx",
		"type"
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

	const taskJson = readData("task");
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
				numberToId(taskJson, value) :
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
		const types = normalizeTypes(options.type || ["all"]);
		const priorityFilter = filterByPriority(options.filterPrior);
		const projectFilter = filterByField(
			"projects",
			options.filterProj
		);
		const contextFilter = filterByField(
			"contexts",
			options.filterCtx
		);

		for (const type of types) {
			taskJson[type]
				.filter(task => (
					projectFilter(task) &&
					contextFilter(task) &&
					priorityFilter(task)
				))
				.forEach(task => {
					modifyTask(task);
					count++;
				});
		}
	}
	else {
		const numbers = parseNumbers(nums, taskJson);
		for (const [type, indexes] of Object.entries(numbers)) {
			for (const i of indexes) {
				modifyTask(taskJson[type as TaskType][i]);
			}
			count += indexes.length;
		}
	}

	writeData("task", taskJson);
	console.log(`Modified ${count} task(s)`);
}

export default modifyCmd;
