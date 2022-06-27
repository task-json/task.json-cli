/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { DateTime } from 'luxon';
import wrapAnsi from "wrap-ansi";
import chalk from "chalk";
import { table } from "table";
import { Task, taskUrgency } from "task.json";
import { readData } from "../utils/config";
import {
	normalizeTypes,
	filterByDeps,
	filterByField,
	filterByPriority,
	filterByWait,
	idToNumber,
	colorTask,
	maxWidth,
	TaskStr,
} from "../utils/task";
import { calculateWidth, tableConfig } from "../utils/table";
import { showDate } from "../utils/date";

const lsCmd = new Command("ls");

type LsOptions = {
	type: string[],
	prior?: string[],
	wait?: boolean,
	dep?: boolean,
	proj?: string[],
	ctx?: string[],
	workspace: boolean
};

lsCmd
	.description("list tasks")
	.addOption(
		new Option("-T, --type <types...>", "filter tasks by types")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.option("-P, --prior <priorities...>", "filter tasks by priorities (A-Z)")
	.option("-p, --proj <projects...>", "filter tasks by projects")
	.option("-c, --ctx <contexts...>", "filter tasks by contexts")
	.option("-w, --wait", "show waiting tasks")
	.option("-d, --dep", "show dependent tasks and dependencies")
	.option("--no-workspace", "ignore workspace settings temporarily")
	.action(execute);


function execute(options: LsOptions) {
	const header = [
		["#", "P", "Text", "Proj", "Ctx", "Due", ...(options.wait ? ["Wait"] : []), ...(options.dep ? ["Dep"] : [])]
	];

	const stdoutColumns = process.stdout.columns ?? 80;
	if (stdoutColumns < 50) {
		lsCmd.error("Terminal width must be greater than 50.");
	}

	const wrapOptions = {
		hard: true
	};

	const taskJson = readData("task");
	const workspace = options.workspace ? readData("workspace").find(ws => ws.enabled) : undefined;
	const types = normalizeTypes(options.type);

	for (const type of types) {
		const priorityFilter = filterByPriority(options.prior);
		const depFilter = filterByDeps(options.dep);
		const waitFilter = filterByWait(options.wait);
		// use workpsace's values if not specified
		const projectFilter = filterByField(
			"projects",
			options.proj ?? workspace?.config.projects,
		);
		const contextFilter = filterByField(
			"contexts",
			options.ctx ?? workspace?.config.contexts,
		);

		const parseDeps = (task: Task): Task => {
			return {
				...task,
				...(task.deps && { deps: idToNumber(taskJson, task.deps) })
			};
		};

		const data = taskJson[type].map((task, index) => ({
			index,
			task: parseDeps(task)
		}))
			.filter(({ task }) => (
				projectFilter(task) &&
				contextFilter(task) &&
				priorityFilter(task) &&
				waitFilter(task) &&
				depFilter(task)
			));

		if (type === "todo")
			data.sort((a, b) => {
				return taskUrgency(b.task) - taskUrgency(a.task);
			});

		const processedData: TaskStr[] = data.map(({ task, index }) => ({
			number: `${type.charAt(0)}${index + 1}`,
			priority: task.priority ?? "",
			text: task.text,
			...(options.dep && { deps: task.deps?.join(" ") ?? "" }),
			...(options.wait && { wait: task.wait ? showDate(DateTime.fromISO(task.wait)) : "" }),
			projects: task.projects?.join(" ") ?? "",
			contexts: task.contexts?.join(" ") ?? "",
			due: task.due ? showDate(DateTime.fromISO(task.due)) : "",
			color: type === "todo" ? colorTask(task) : null
		}));

		const widths = maxWidth(processedData, options.dep, options.wait);

		const result = calculateWidth(stdoutColumns, {
			numWidth: Math.max(1, data.length.toString().length + 1),
			priWidth: 1,
			depWidth: widths.deps,
			textWidth: widths.text,
			projWidth: widths.projects,
			ctxWidth: widths.contexts,
			waitWidth: widths.wait,
			dueWidth: widths.due
		}, 2 * (6 + (options.dep ? 1 : 0) + (options.wait ? 1 : 0)));

		const tableData = processedData.map(task => {
			const row = [
				task.number,
				task.priority,
				task.text,
				task.projects,
				task.contexts,
				task.due,
				...(options.wait ? [task.wait!] : [])
			].map((field, i) => {
				let value = field;
				if (result) {
					if (i === 2)
						value = wrapAnsi(field, result.textWidth, wrapOptions);
					if (i === 3)
						value = wrapAnsi(field, result.projWidth, wrapOptions);
					if (i === 4)
						value = wrapAnsi(field, result.ctxWidth, wrapOptions);
				}
				return value;
			});
			if (options.dep) {
				let value = task.deps!;
				if (result)
					value = wrapAnsi(value, result.depWidth, wrapOptions);
				row.push(value);
			}
			return row.map(value => task.color ? chalk[task.color].bold(value) : value);
		});

		const output = table(header.concat(tableData), tableConfig);

		// Remove one extra newline
		console.log(`\n${output.substring(0, output.length - 1)}`);
	}
}

export default lsCmd;
