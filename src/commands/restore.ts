import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readConfig } from "../utils/config";
import cli from "cli-ux";

export default class Restore extends Command {
  static description = 'Undo the last modification in todo.json/done.json using the bak file';

  static examples = [
    `$ todo restore`,
    `$ todo restore -f --done`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({
      char: "f",
      description: "force overwriting without confirmation"
    }),
    done: flags.boolean({
      char: 'd',
      description: "restore done.json"
    })
  };

  // Allow multiple arguments
  static strict = false;

  async run() {
    const { flags } = this.parse(Restore);
    const { todoPath, donePath } = readConfig();

    const taskPath = flags.done ? donePath : todoPath;
    const bakPath = taskPath + ".bak";

    if (!fs.existsSync(bakPath)) {
      this.error(`${flags.done ? "done" : "todo"}.json.bak does not exist.`);
    }

    let res = true;
    if (flags.force || fs.existsSync(taskPath)) {
      res = await cli.confirm(`The file ${taskPath} will be overwritten irreversibly. Continue? [y/n]`);
    }

    if (res)
      fs.renameSync(bakPath, taskPath)
  }
}
