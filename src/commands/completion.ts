/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const completionCmd = new Command("completion");

type CompletionOptions = {
	zsh?: boolean
};

completionCmd
	.description("list projects")
	.option("--zsh", "install zsh completion")
	.argument("<dir>", "install completion file to the directory")
	.action(execute);


function execute(dir: string, options: CompletionOptions) {
	try {
		if (options.zsh) {
			const target = path.join(dir, "_tj");
			fs.copyFileSync(path.join(__dirname, "../../completion/_tj"), target);
			console.log(`Completion file installed to ${target}.\nMake sure ${dir} is in $fpath environment.\nStart a new zsh shell to put it into effect.`);
		}
		else {
			completionCmd.error("Shell flag required. See --help for details");
		}
	}
	catch (error: any) {
		completionCmd.error(error);
	}
}

export default completionCmd;
