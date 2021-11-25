import {Command, flags} from '@oclif/command'
import { parseNumbers } from "../utils/task";
import { doTasks } from "task.json";
import { readData, writeData } from '../utils/config';

export default class Do extends Command {
  static description = 'Mark tasks as done';

  static examples = [
    `$ tj do t1`,
    `$ tj do t1 t2`
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    required: true,
    description: "mark specific tasks as done"
  }];

  async run() {
    const { argv } = this.parse(Do);

    const taskJson = readData("task");
    const indexes = parseNumbers(argv, taskJson);
    if (indexes.removed.length + indexes.done.length > 0)
      this.error("Cannot do done tasks or removed tasks");
    doTasks(taskJson, indexes.todo);
    writeData("task", taskJson);

    this.log(`Finish ${new Set(indexes.todo).size} task(s)`);
  }
}
