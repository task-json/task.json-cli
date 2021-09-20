import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { doTasks } from "task.json";

export default class Do extends Command {
  static description = 'Mark tasks as done';

  static examples = [
    `$ tj do t1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    description: "mark specific tasks as done"
  }];

  async run() {
    const { argv } = this.parse(Do);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson, this.error);
    if (indexes.removed.length + indexes.done.length > 0)
      this.error("Cannot do done tasks or removed tasks");
    doTasks(taskJson, indexes.todo);
    writeTaskJson(taskJson);

    this.log(`Finish ${new Set(indexes.todo).size} task(s)`);
  }
}
