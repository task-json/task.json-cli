import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { format } from "date-fns";
import { appendTasks, parseIds, readTasks, writeTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import * as _ from "lodash";

export default class Do extends Command {
  static description = 'Mark tasks as done';

  static examples = [
    `$ td do 1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "ID...",
    description: "mark specific tasks as done"
  }];

  async run() {
    const { argv } = this.parse(Do);
    const { todoPath, donePath } = readConfig();

    if (!fs.existsSync(todoPath)) {
      this.error("todo.json does not exist. Use `todo add` to create one.");
    }

    // Read Todo
    const todoTasks = readTasks(todoPath);

    const ids = parseIds(argv, todoTasks.length, this.error);

    const doneTasks = _.remove(todoTasks, (_, index) => ids.includes(index)).map(task => {
      task.end = format(new Date(), "yyyy-MM-dd")
      return task;
    });
    writeTasks(todoPath, todoTasks);
    appendTasks(donePath, doneTasks);

    this.log(`Finish ${doneTasks.length} task(s): ${doneTasks.map(task => `"${task.text}"`).join(", ")}`);
  }
}
