import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { undoTasks } from "task.json";

export default class Undo extends Command {
  static description = 'Undo tasks';

  static examples = [
    `$ tj undo d1 d2`,
    `$ tj undo r1 r2  # restore removed tasks`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    description: "undo specific done or removed tasks"
  }];

  async run() {
    const { argv } = this.parse(Undo);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const indexes = parseNumbers(argv, taskJson);
    if (indexes.todo.length > 0)
      this.error("Cannot delete removed tasks")
    undoTasks(taskJson, "done", indexes.done);
    undoTasks(taskJson, "removed", indexes.removed);
    writeTaskJson(taskJson);

    this.log(`Undo ${new Set(indexes.done).size + new Set(indexes.removed).size} task(s)`);
  }
}
