import {Command, flags} from '@oclif/command'
import { parseIds, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
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

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const ids = parseIds(argv, taskJson.done.length, this.error);

    const undoneTasks = _.remove(taskJson.done, (_, index) => ids.includes(index)).map(task => {
      delete task.end;
      task.modified = new Date().toISOString();
      return task;
    });
    taskJson.todo.push(...undoneTasks);

    writeTaskJson(taskJson);

    this.log(`Undo ${undoneTasks.length} task(s): ${undoneTasks.map(task => `"${task.text}"`).join(", ")}`);
  }
}
