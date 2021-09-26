import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { eraseTasks } from 'task.json';
import cli from "cli-ux";

export default class Erase extends Command {
  static description = 'Erase removed tasks';

  static examples = [
    `$ tj erase r1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({
      char: "f",
      description: "force erasing without confirmation",
      default: false
    })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    required: true,
    description: "erase specific removed tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Erase);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson);

    let res = true;
    if (!flags.force) {
      res = await cli.confirm("Warning: This will erase the REMOVED tasks permanently. Make sure the erased tasks are not in other servers and clients if you want to sync with them. Continue? [y/n]");
    }
    if (res) {
      if (indexes.todo.length + indexes.done.length > 0)
        this.error("Cannot delete todo or done tasks");
      eraseTasks(taskJson, indexes.removed);
      writeTaskJson(taskJson);
      this.log(`Erase ${new Set(indexes.removed).size} task(s)`);
    }
  }
}
