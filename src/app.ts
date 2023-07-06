#!/usr/bin/env node
/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { Settings } from "luxon";

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
import rollbackCmd from "./commands/rollback.js";
import workspaceCmd from "./commands/workspace.js";
import modifyCmd from "./commands/modify.js";
import serverCmd from "./commands/server.js";

// Set global luxon settings
Settings.throwOnInvalid = true;
declare module 'luxon' {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

const program = new Command();

program
	.name("tj")
	.description("Command line todo management app based on task.json format")
	.version("v8.1.0");

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
	.addCommand(rollbackCmd)
	.addCommand(modifyCmd)
	.addCommand(workspaceCmd)
	.addCommand(serverCmd);

try {
	await program.parseAsync();
}
catch (err: any) {
	console.error("Error:", (err as Error).message);
}
