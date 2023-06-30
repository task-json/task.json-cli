/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { Workspace } from "../utils/types.js";

const workspaceCmd = new Command("workspace");

workspaceCmd.description("workspace configuration");

/**
 * Sub command: show
 */
type ShowOptions = {
	name?: boolean
};

const showCmd = new Command("show");
showCmd
	.description("show workspace(s)")
	.argument("[names...]", "workspace name(s)")
	.option("-n, --name", "only show workspace names")
	.action(show);

async function show(names: string[], options: ShowOptions) {
	const { default: chalk } = await import("chalk");
	const { readData } = await import("../utils/config.js");
	const { printAttrs } = await import("../utils/format.js");

	const workspaces = await readData("workspace");
	for (const ws of workspaces) {
		if (names.length > 0 && !names.includes(ws.name)) {
			continue;
		}

		if (options.name) {
			console.log(ws.name);
			continue;
		}

		const status = ws.enabled ? "[enabled]" : "";
		console.log(`\nWorkspace ${chalk.bold(ws.name)} ${status}`);

		const attrs: [string, string][] = [];
		for (const [key, value] of Object.entries(ws.config)) {
			if (Array.isArray(value)) {
				attrs.push([key, value.map(v => v.length ? v : '""').join(", ")]);
			}
			else {
				attrs.push([key, value]);
			}
		}
		printAttrs(attrs, {
			keyColor: "cyanBright",
			prefix: "  "
		});
	}
}

/**
 * Sub command: add
 */
type AddOptions = {
	proj?: string[],
	ctx?: string[],
	enabled?: boolean
}

const addCmd = new Command("add");
addCmd
	.description("add a new workspace")
	.argument("<name>", "workspace name")
	.option("-p, --proj <proj...>", "auto filter and set projects for other commands (add, ls) if not specified")
	.option("-c, --ctx <ctx...>", "auto filter and set contexts for other commands (add, ls) if not specified")
	.option("-e, --enabled", "enable this workspace")
	.action(add);

async function add(name: string, options: AddOptions) {
	const { DateTime } = await import('luxon');
	const { readData, writeData } = await import("../utils/config.js");

	const workspaces = await readData("workspace");
	if (workspaces.findIndex(v => v.name === name) !== -1) {
		addCmd.error(`Workspace ${name} already exists`);
	}

	const date = DateTime.now().toISO();
	const ws: Workspace = {
		name,
		config: {
			projects: options.proj,
			contexts: options.ctx,
		},
		enabled: options.enabled,
		created: date,
		modified: date
	};

	if (options.enabled) {
		// make sure there's at most one enabled workspace
		workspaces.forEach(w => {
			delete w.enabled;
		});
	}

	workspaces.push(ws);
	writeData("workspace", workspaces);
	console.log(`Workspace ${name} added.`);
}

/**
 * Sub command: modify
 * modify an existing workspace
 */
type ModifyOptions = {
	proj?: string[] | false,
	ctx?: string[] | false,
	enabled?: boolean,
}

const modifyCmd = new Command("modify");
modifyCmd
	.description("modify an existing workspace")
	.argument("<name>", "workspace name")
	.option("-p, --proj <proj...>", "auto filter and set projects for other commands (add, ls) if not specified")
	.option("--no-proj", "clear projects")
	.option("-c, --ctx <ctx...>", "auto filter and set contexts for other commands (add, ls) if not specified")
	.option("--no-ctx", "clear contexts")
	.option("-e, --enabled", "enable this workspace")
	.option("--no-enabled", "disable this workspace")
	.action(modify);

async function modify(name: string, options: ModifyOptions) {
	const { DateTime } = await import('luxon');
	const { readData, writeData } = await import("../utils/config.js");

	const workspaces = await readData("workspace");
	const ws = workspaces.find(v => v.name === name);

	if (!ws) {
		modifyCmd.error(`Workspace ${name} doesn't exist`);
		return;
	}

	let modified = false;
	if ("proj" in options) {
		ws.config.projects = options.proj || undefined;
		modified = true;
	}
	if ("ctx" in options) {
		ws.config.contexts = options.ctx || undefined;
		modified = true;
	}
	if ("enabled" in options) {
		// make sure there's at most one enabled workspace
		if (options.enabled) {
			workspaces.forEach(w => {
				delete w.enabled;
			});
			ws.enabled = true;
		}
		else {
			delete ws.enabled;
		}
		modified = true;
	}

	if (!modified) {
		modifyCmd.error(`Workspace ${name} unmodified`);
	}

	const date = DateTime.now().toISO();
	ws.modified = date;
	writeData("workspace", workspaces);
	console.log(`Workspace ${name} updated.`);
}

/**
 * Sub command: rm
 */
const rmCmd = new Command("rm");
rmCmd
	.description("remove an existing workspace")
	.argument("<name...>", "workspace names")
	.action(rm);

async function rm(names: string) {
	const { readData, writeData } = await import("../utils/config.js");

	let workspaces = await readData("workspace");
	const nameSet = new Set(names);
	const count = nameSet.size;
	workspaces = workspaces.filter(ws => {
		if (nameSet.has(ws.name)) {
			nameSet.delete(ws.name);
			return false;
		}
		return true;
	});

	if (nameSet.size > 0) {
		rmCmd.error(`Folloing workspace(s) not found: ${[...nameSet].join(", ")}`);
	}

	writeData("workspace", workspaces);
	console.log(`${count} workspace(s) removed`);
}

// Add all sub commands
workspaceCmd
	.addCommand(showCmd)
	.addCommand(addCmd)
	.addCommand(modifyCmd)
	.addCommand(rmCmd);

export default workspaceCmd;
