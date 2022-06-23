/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import chalk from "chalk";
import { DateTime } from 'luxon';
import { readData, writeData } from "../utils/config";
import { printAttrs } from "../utils/format";
import { Workspace } from "../utils/types";

const workspaceCmd = new Command("workspace");

workspaceCmd.description("workspace configuration");

/**
 * Sub command: show
 */
const showCmd = new Command("show");
showCmd
	.description("show workspace(s)")
	.argument("[names...]", "workspace name(s)")
	.action(show);

function show(names: string[]) {
	const workspaces = readData("workspace");
	for (const ws of workspaces) {
		if (names.length > 0 && !names.includes(ws.name)) {
			continue;
		}

		const status = ws.enabled ? "enabled" : "eisabled"
		console.log(`\nWorkspace ${chalk.bold(ws.name)} [${status}]`);

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

type WorkspaceOptions = {
	// true means no arguments, set to empty
	proj?: string[] | true,
	ctx?: string[] | true,
	enabled?: boolean
}

function parseArrayArgs(args: string[] | true | undefined) {
	return args === true ? undefined : args;
}

/**
 * Sub command: add
 */
const addCmd = new Command("add");
addCmd
	.description("add a new workspace")
	.argument("<name>", "workspace name")
	.option("-p, --proj <projects...>", "auto filter and set projects for other commands (add, ls) if not specified")
	.option("-c, --ctx <contexts...>", "auto filter and set contexts for other commands (add, ls) if not specified")
	.option("-e, --enabled", "enable this workspace")
	.action(add);

function add(name: string, options: WorkspaceOptions) {
	const workspaces = readData("workspace");
	if (workspaces.findIndex(v => v.name === name) !== -1) {
		addCmd.error(`Workspace ${name} already exists`);
	}

	const date = DateTime.now().toISO();
	const ws: Workspace = {
		name,
		config: {
			projects: parseArrayArgs(options.proj),
			contexts: parseArrayArgs(options.ctx),
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
const modifyCmd = new Command("modify");
modifyCmd
	.description("modify an existing workspace")
	.argument("<name>", "workspace name")
	.option("-p, --proj [proj...]", "auto filter and set projects for other commands (add, ls) if not specified")
	.option("-c, --ctx [ctx...]", "auto filter and set contexts for other commands (add, ls) if not specified")
	.option("-e, --enabled", "enable this workspace")
	.action(modify);

function modify(name: string, options: WorkspaceOptions) {
	const workspaces = readData("workspace");
	const ws = workspaces.find(v => v.name === name);
	if (!ws) {
		modifyCmd.error(`Workspace ${name} doesn't exist`);
		return;
	}

	let modified = false;
	if (options.proj) {
		ws.config.projects = parseArrayArgs(options.proj);
		modified = true;
	}
	if (options.ctx) {
		ws.config.contexts = parseArrayArgs(options.ctx);
		modified = true;
	}
	if (options.enabled) {
		// make sure there's at most one enabled workspace
		workspaces.forEach(w => {
			delete w.enabled;
		});
		ws.enabled = true;
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

function rm(names: string) {
	let workspaces = readData("workspace");
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
