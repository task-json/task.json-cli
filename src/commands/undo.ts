import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { appendTasks, parseIds, readTasks, writeTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import * as _ from "lodash";

export default class Undo extends Command {
  static description = 'Undo tasks';

  static examples = [
    `$ todo undo 1 2`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "ID...",
    description: "undo specific done tasks"
  }];

  async run() {
    const { argv } = this.parse(Undo);
    const { todoPath, donePath } = readConfig();

    if (!fs.existsSync(donePath)) {
      this.error("done.json does not exist.");
    }

    // Read Todo
    const doneTasks = readTasks(donePath);
    const ids = parseIds(argv, doneTasks.length, this.error);

    const todoTasks = _.remove(doneTasks, (_, index) => ids.includes(index)).map(task => {
      delete task.end;
      task.modified = new Date().toISOString();
      return task;
    });
    writeTasks(donePath, doneTasks);
    appendTasks(todoPath, todoTasks);

    this.log(`Undo ${todoTasks.length} task(s).`);
  }
}
