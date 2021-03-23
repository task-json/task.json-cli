import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { TaskType, removeTasks } from 'task.json';

export default class Remove extends Command {
  static description = 'Delete tasks';

  static examples = [
    `$ tj rm 1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      char: "D",
      description: "delete done tasks"
    })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    description: "delete specific tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Remove);

    checkTaskExistence(this.error);
    const type: TaskType = flags.done ? "done" : "todo";

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson[type].length, this.error);
    removeTasks(taskJson, type, indexes);
    writeTaskJson(taskJson);

    this.log(`Remove ${new Set(indexes).size} task(s)`);
  }
}
