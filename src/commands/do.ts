import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { doTasks } from "task.json";

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

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson);
    if (indexes.removed.length + indexes.done.length > 0)
      this.error("Cannot do done tasks or removed tasks");
    doTasks(taskJson, indexes.todo);
    writeTaskJson(taskJson);

    this.log(`Finish ${new Set(indexes.todo).size} task(s)`);
  }
}
