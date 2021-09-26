import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { TaskType, removeTasks } from 'task.json';

export default class Remove extends Command {
  static description = 'Delete tasks';

  static examples = [
    `$ tj rm t1`,
    `$ tj rm d1`
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    required: true,
    description: "delete specific tasks"
  }];

  async run() {
    const { argv } = this.parse(Remove);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson);
    if (indexes.removed.length > 0)
      this.error("Cannot delete removed tasks")
    removeTasks(taskJson, "todo", indexes.todo);
    removeTasks(taskJson, "done", indexes.done);
    writeTaskJson(taskJson);

    this.log(`Remove ${new Set(indexes.todo).size + new Set(indexes.done).size} task(s)`);
  }
}
