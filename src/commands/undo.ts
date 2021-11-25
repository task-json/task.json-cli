import {Command, flags} from '@oclif/command'
import { parseNumbers } from "../utils/task";
import { undoTasks } from "task.json";
import { readData, writeData } from '../utils/config';

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
    required: true,
    description: "undo specific done or removed tasks"
  }];

  async run() {
    const { argv } = this.parse(Undo);

    const taskJson = readData("task");
    const indexes = parseNumbers(argv, taskJson);
    if (indexes.todo.length > 0)
      this.error("Cannot delete removed tasks")
    undoTasks(taskJson, "done", indexes.done);
    undoTasks(taskJson, "removed", indexes.removed);
    writeData("task", taskJson);

    this.log(`Undo ${new Set(indexes.done).size + new Set(indexes.removed).size} task(s)`);
  }
}
