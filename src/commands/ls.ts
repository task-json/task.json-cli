/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command, Option } from "commander";
import { classifyTaskJson, Task, taskUrgency } from "task.json";
import { TaskStr, numbersToIds  } from "../utils/task.js";

const lsCmd = new Command("ls");

type LsOptions = {
	status: string[],
	prior?: string[],
	wait?: boolean,
	dep?: boolean,
	proj?: string[],
	ctx?: string[],
	workspace: boolean,
  json?: boolean
};

lsCmd
	.description("list tasks")
	.addOption(
		new Option("-S, --status <status...>", "filter tasks by status")
			.choices(["todo", "done", "removed", "all"])
			.default(["todo"])
	)
	.option("-P, --prior <priorities...>", "filter tasks by priorities (A-Z)")
	.option("-p, --proj <projects...>", "filter tasks by projects")
	.option("-c, --ctx <contexts...>", "filter tasks by contexts")
	.option("-w, --wait", "show waiting tasks")
	.option("-D, --dep", "show dependent tasks and dependencies")
	.option("--no-workspace", "ignore workspace settings temporarily")
  .option("-j, --json", "output in ndjson format with num")
	.argument("[num...]", "task # to list")
	.action(execute);


async function execute(nums: string[], options: LsOptions) {
	const { DateTime } = await import('luxon');
	const { default: wrapAnsi } = await import("wrap-ansi");
	const { default: chalk } = await import("chalk");
	const { table } = await import("table");
	const { readData } = await import("../utils/config.js");
	const {
		filterByDeps,
		filterByField,
		filterByPriority,
		filterByWait,
		idsToNumbers,
		colorTask,
		maxWidth,
		normalizeStatuses,
	} = await import("../utils/task.js");
	const { calculateWidth, tableConfig } = await import("../utils/table.js");
	const { showDate } = await import("../utils/date.js");

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

	const taskJson = await readData("task");
	const classified = classifyTaskJson(taskJson);
	const ws = options.workspace ? (await readData("workspace")).find(w => w.enabled) : undefined;
	const statuses = normalizeStatuses(options.status);
  // Only include the specified tasks
  const includedIds = nums.length ? new Set(numbersToIds(classified, nums)) : undefined;

	for (const st of statuses) {
		const priorityFilter = filterByPriority(options.prior);
		const depFilter = filterByDeps(options.dep);
		const waitFilter = filterByWait(options.wait);
		// use workpsace's values if not specified
		const projectFilter = filterByField(
			"projects",
			options.proj ?? ws?.config.projects,
		);
		const contextFilter = filterByField(
			"contexts",
			options.ctx ?? ws?.config.contexts,
		);

		const parseDeps = (task: Task): Task => {
			return {
				...task,
				...(task.deps && { deps: idsToNumbers(classified, task.deps) })
			};
		};

		const data = classified[st].map((task, index) => ({
			index,
			task: parseDeps(task)
		}))
			.filter(({ task }) => (
				projectFilter(task) &&
				contextFilter(task) &&
				priorityFilter(task) &&
        waitFilter(task) &&
        depFilter(task) &&
        // filter by number if specified
        (!includedIds ||
          includedIds.has(task.id))
			));

		if (st === "todo") {
			data.sort((a, b) => {
				return taskUrgency(b.task) - taskUrgency(a.task);
			});
		}

    // log json data instead of a table
    if (options.json) {
      console.log(
        data.map(({ task, index }) => JSON.stringify({
          num: `${st.charAt(0)}${index}`,
          ...task
        })).join("\n")
      );
      continue;
    }

		const processedData: TaskStr[] = data.map(({ task, index }) => ({
			number: `${st.charAt(0)}${index}`,
			priority: task.priority ?? "",
			text: task.text,
			...(options.dep && { deps: task.deps?.join(" ") ?? "" }),
			...(options.wait && { wait: task.wait ? showDate(DateTime.fromISO(task.wait)) : "" }),
			projects: task.projects?.join(" ") ?? "",
			contexts: task.contexts?.join(" ") ?? "",
			due: task.due ? showDate(DateTime.fromISO(task.due)) : "",
			color: st === "todo" ? colorTask(task) : null
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
