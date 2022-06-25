/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import chalk from "chalk";
import { DateTime } from 'luxon';
import inquirer from "inquirer";
import { getCertificate, HttpError, setupClient } from "task.json-client";
import { readData, writeData } from "../utils/config";
import { printAttrs, printCert } from "../utils/format";
import { Server } from "../utils/types";
import { stringifyDiffStat } from "../utils/task";

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
			else if (key === "ca") {
				const len = (value as string[]).length;
				attrs.push([key, `[${len} cert(s)]`]);
			}
			else {
				attrs.push([key, value as string]);
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
	default?: boolean,
	ca: boolean
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
	.option("--no-ca", "clear all trusted CA certs")
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
	if (!options.ca) {
		delete s.config.ca;
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

/**
 * Sub command login
 */
type LoginOptions = {
	password?: string
}

const loginCmd = new Command("login");
loginCmd
	.description("log into the server")
	.argument("[name]", "server name (use default one if not specified")
	.option("-p, --password <password>", "password for login")
	.action(login);

async function login(name: string | undefined, options: LoginOptions) {
	const servers = readData("server");
	const server = servers.find(s => {
		if (name !== undefined) {
			return name === s.name;
		}
		else {
			return s.default;
		}
	});

	if (!server) {
		loginCmd.error("server not found");
		return;
	}

	let password: string;
	if (options.password) {
		password = options.password;
	}
	else {
		const answer = await inquirer.prompt([{
			type: "password",
			name: "password",
			message: "Password:",
			mask: "*"
		}]);
		password = answer.password;
	}

	while (true) {
		try {
			const client = await setupClient({
				server: server.config.url,
				ca: server.config.ca
			});
			await client.login(password);
			server.config.token = client.config.token;
			break;
		}
		catch (error) {
			const err = error as HttpError;
			if (err.status === 503 && err.message === "self signed certificate") {
				const cert = await getCertificate(server.config.url);
				if (cert) {
					console.log("Self signed certificate found:")
					printCert(cert, {
						keyColor: "cyanBright",
						prefix: "  "
					});
					const answer = await inquirer.prompt([{
						type: "confirm",
						name: "confirm",
						message: "Trust this certificate?",
						default: false
					}]);
					if (answer.confirm) {
						const ca = server.config.ca ?? [];
						ca.push(cert.toString());
						server.config.ca = ca;
						writeData("server", servers);
						continue;
					}
				}
				else {
					loginCmd.error("Not able to get server certificate");
				}
			}

			loginCmd.error(`${err.status}: ${err.message}`);
		}
	}

	writeData("server", servers);
	console.log("Logged in successfully.")
}


/**
 * Sub command: sync
 */
type SyncOptions = {
	upload?: boolean,
	download?: boolean,
	force?: boolean
};

const syncCmd = new Command("sync");
syncCmd
	.description("sync with server")
	.argument("[name]", "server name (use default one if not specified)")
	.option("-u, --upload", "upload local task.json to overwrite the one on server")
	.option("-d, --download", "download task.json from server to overwrite the local one")
	.option("-f, --force", "overwrite without confirmation")
	.action(sync);

async function sync(name: string | undefined, options: SyncOptions) {
	const servers = readData("server");
	
	const server = servers.find(s => {
		if (name !== undefined) {
			return name === s.name;
		}
		else {
			return s.default;
		}
	});

	if (!server) {
		syncCmd.error("server not found");
		return;
	}

	if (!server.config.token) {
		syncCmd.error("server not logged in");
	}
	
	const taskJson = readData("task");

	const client = await setupClient({
		server: server.config.url,
		token: server.config.token,
		ca: server.config.ca,
	});

	try {
		if (options.upload) {
			if (!options.force) {
				const anwser = await inquirer.prompt([{
					type: "confirm",
					name: "confirm",
					message: "This will overwrite task.json on the server. Continue?",
					default: false
				}]);
				if (!anwser.confirm)
					return;
			}
			await client.upload(taskJson);
		}
		else if (options.download) {
			if (!options.force) {
				const anwser = await inquirer.prompt([{
					type: "confirm",
					name: "confirm",
					message: "This will overwrite local task.json. Continue?",
					default: false
				}]);
				if (!anwser.confirm)
					return;
			}
			writeData("task", await client.download());
		}
		else {
			const { data, stat } = await client.sync(taskJson);
			writeData("task", data);
			console.log(`[Client] ${stringifyDiffStat(stat.client)}`);
			console.log(`[Server] ${stringifyDiffStat(stat.server)}`);
		}
		console.log("Sync with server successfully.")
	}
	catch (error) {
		const err = error as HttpError;
		syncCmd.error(`${err.status}: ${err.message}`);
	}
}


// Add all sub commands
serverCmd
	.addCommand(showCmd)
	.addCommand(addCmd)
	.addCommand(modifyCmd)
	.addCommand(rmCmd)
	.addCommand(loginCmd)
	.addCommand(syncCmd);

export default serverCmd;
