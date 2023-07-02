/**
 * Copyright (C) 2020-2023 DCsunset
 * See full notice in README.md in this project
 */

import { Command } from "commander";

const completionCmd = new Command("completion");

type CompletionOptions = {
	zsh?: boolean
};

completionCmd
	.description("install completion script")
	.option("--zsh", "install zsh completion")
	.argument("<dir>", "install completion script to the directory")
	.action(execute);


async function execute(dir: string, options: CompletionOptions) {
	const path = await import("node:path");
	const fs = await import("node:fs");
	const { fileURLToPath } = await import("node:url");

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

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
