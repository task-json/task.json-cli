#!/usr/bin/env node
/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { version } from "../package.json";

import lsCmd from "./commands/ls";
import lsCtxCmd from "./commands/lsCtx";
import lsProjCmd from "./commands/lsProj";
import lsNumCmd from "./commands/lsNum";
import completionCmd from "./commands/completion";
import addCmd from "./commands/add";
import doCmd from "./commands/do";
import undoCmd from "./commands/undo";
import dueCmd from "./commands/due";
import rmCmd from "./commands/rm";
import eraseCmd from "./commands/erase";
import showCmd from "./commands/show";
import restoreCmd from "./commands/restore";
import workspaceCmd from "./commands/workspace";
import modifyCmd from "./commands/modify";
import serverCmd from "./commands/server";

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
