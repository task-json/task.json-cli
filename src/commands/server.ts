/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import chalk from "chalk";
import { DateTime } from 'luxon';
import { readData, writeData } from "../utils/config";
import { printAttrs } from "../utils/format";
import { Server } from "../utils/types";

const serverCmd = new Command("server");

serverCmd.description("server configuration");

/**
 * Sub command: show
 */
type ShowOptions = {
	showToken: boolean
};

const showCmd = new Command("show");
showCmd
	.description("show server(s)")
	.argument("[names...]", "server name(s)")
	.option("--show-token", "show server token")
	.action(show);

function show(names: string[], options: ShowOptions) {
	const servers = readData("server");
	for (const s of servers) {
		if (names.length > 0 && !names.includes(s.name)) {
			continue;
		}

		const status = s.default ? "[default]" : "";
		console.log(`\nServer ${chalk.bold(s.name)} ${status}`);

		const attrs: [string, string][] = [];
		for (const [key, value] of Object.entries(s.config)) {
			if (key === "token" && !options.showToken) {
				attrs.push([key, "*".repeat(value.length)]);
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
	url: string,
	token?: string,
	default?: boolean
}

const addCmd = new Command("add");
addCmd
	.description("add a new server")
	.argument("<name>", "server name")
	.requiredOption("-u, --url <url>", "server URL")
	.option("-t, --token <token>", "token to log in")
	.option("-d, --default", "set this server as default")
	.action(add);

function add(name: string, options: AddOptions) {
	const servers = readData("server");
	if (servers.findIndex(v => v.name === name) !== -1) {
		addCmd.error(`Server ${name} already exists`);
	}

	const date = DateTime.now().toISO();
	const s: Server = {
		name,
		config: {
			url: options.url,
			token: options.token
		},
		default: options.default,
		created: date,
		modified: date
	};

	if (options.default) {
		// make sure there's at most one enabled server
		servers.forEach(v => {
			delete v.default;
		});
	}

	servers.push(s);
	writeData("server", servers);
	console.log(`Server ${name} added.`);
}

/**
 * Sub command: modify
 * modify an existing server
 */
type ModifyOptions = {
	url?: string,
	token?: string,
	default?: boolean
}

const modifyCmd = new Command("modify");
modifyCmd
	.description("modify an existing server")
	.argument("<name>", "server name")
	.option("-u, --url <url>", "server URL")
	.option("-t, --token <token>", "token to log in")
	.option("--no-token", "clear token")
	.option("-d, --default", "set this server as default")
	.option("--no-default", "set this server as not default")
	.action(modify);

function modify(name: string, options: ModifyOptions) {
	const servers = readData("server");
	const s = servers.find(v => v.name === name);
	if (!s) {
		modifyCmd.error(`Server ${name} doesn't exist`);
		return;
	}

	let modified = false;
	if (options.url) {
		s.config.url = options.url;
		modified = true;
	}
	if ("token" in options) {
		s.config.token = options.token || undefined;
		modified = true;
	}
	if ("default" in options) {
		// make sure there's at most one default server
		if (options.default) {
			servers.forEach(w => {
				delete w.default;
			});
			s.default = true;
		}
		else {
			delete s.default;
		}
		modified = true;
	}

	if (!modified) {
		modifyCmd.error(`Server ${name} unmodified`);
	}

	const date = DateTime.now().toISO();
	s.modified = date;
	writeData("server", servers);
	console.log(`Server ${name} updated.`);
}

/**
 * Sub command: rm
 */
const rmCmd = new Command("rm");
rmCmd
	.description("remove an existing server")
	.argument("<name...>", "server names")
	.action(rm);

function rm(names: string) {
	let servers = readData("server");
	const nameSet = new Set(names);
	const count = nameSet.size;
	servers = servers.filter(ws => {
		if (nameSet.has(ws.name)) {
			nameSet.delete(ws.name);
			return false;
		}
		return true;
	});

	if (nameSet.size > 0) {
		rmCmd.error(`Folloing server(s) not found: ${[...nameSet].join(", ")}`);
	}

	writeData("server", servers);
	console.log(`${count} server(s) removed`);
}

// Add all sub commands
serverCmd
	.addCommand(showCmd)
	.addCommand(addCmd)
	.addCommand(modifyCmd)
	.addCommand(rmCmd);

export default serverCmd;
