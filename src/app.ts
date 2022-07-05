#!/usr/bin/env node
/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

import lsCmd from "./commands/ls.js";
import lsCtxCmd from "./commands/lsCtx.js";
import lsProjCmd from "./commands/lsProj.js";
import lsNumCmd from "./commands/lsNum.js";
import completionCmd from "./commands/completion.js";
import addCmd from "./commands/add.js";
import doCmd from "./commands/do.js";
import undoCmd from "./commands/undo.js";
import dueCmd from "./commands/due.js";
import rmCmd from "./commands/rm.js";
import eraseCmd from "./commands/erase.js";
import showCmd from "./commands/show.js";
import restoreCmd from "./commands/restore.js";
import workspaceCmd from "./commands/workspace.js";
import modifyCmd from "./commands/modify.js";
import serverCmd from "./commands/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read version from package.json
const { version } = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "../package.json"),
		"utf8"
	)
);

const program = new Command();

program
	.name("tj")
	.description("Command line todo management app based on task.json format")
	.version(version);

program
	.addCommand(lsCmd)
	.addCommand(lsCtxCmd)
	.addCommand(lsProjCmd)
	.addCommand(lsNumCmd)
	.addCommand(completionCmd)
	.addCommand(addCmd)
	.addCommand(doCmd)
	.addCommand(undoCmd)
	.addCommand(dueCmd)
	.addCommand(rmCmd)
	.addCommand(eraseCmd)
	.addCommand(showCmd)
	.addCommand(restoreCmd)
	.addCommand(modifyCmd)
	.addCommand(workspaceCmd)
	.addCommand(serverCmd);

await program.parseAsync();
