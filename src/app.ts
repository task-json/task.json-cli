#!/usr/bin/env node
/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import { version } from "../package.json";

import lsCmd from "./commands/ls";
import lsctxCmd from "./commands/lsctx";
import lsprojCmd from "./commands/lsproj";
import lsnumCmd from "./commands/lsnum";
import completionCmd from "./commands/completion";
import addCmd from "./commands/add";
import doCmd from "./commands/do";
import undoCmd from "./commands/undo";
import dueCmd from "./commands/due";
import rmCmd from "./commands/rm";
import eraseCmd from "./commands/erase";

const program = new Command();

program
	.name("tj")
	.description("Command line todo management app based on task.json format")
	.version(version);

program
	.addCommand(lsCmd)
	.addCommand(lsctxCmd)
	.addCommand(lsprojCmd)
	.addCommand(lsnumCmd)
	.addCommand(completionCmd)
	.addCommand(addCmd)
	.addCommand(doCmd)
	.addCommand(undoCmd)
	.addCommand(dueCmd)
	.addCommand(rmCmd)
	.addCommand(eraseCmd);

await program.parseAsync();
