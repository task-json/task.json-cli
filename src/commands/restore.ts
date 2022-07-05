/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import path from "node:path";
import fs from "node:fs";
import inquirer from "inquirer";
import { Command } from "commander";
import { pathConfig } from "../utils/config.js";

const restoreCmd = new Command("restore");

type RestoreOptions = {
	force?: boolean
};

restoreCmd
	.description("undo last modification using .bak file")
	.option("-f, --force", "force overwriting without confirmation")
	.action(execute);

async function execute(options: RestoreOptions) {
	const dataPath = path.join(pathConfig.root, pathConfig["task"]);
	const bakPath = dataPath + ".bak";

	if (!fs.existsSync(bakPath)) {
		restoreCmd.error("task.json.bak does not exist.");
	}

	let confirm = true;
	if (!options.force) {
		const answer = await inquirer.prompt([{
			type: "confirm",
			name: "confirm",
			message: `The file ${dataPath} will be overwritten irreversibly. Continue?`,
			default: false
		}]);
		confirm = answer.confirm;
	}

	if (confirm) {
		fs.renameSync(bakPath, dataPath);
		console.log(`Restored successfully`);
	}
}

export default restoreCmd;
