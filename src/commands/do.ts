import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import * as _ from "lodash";

export default class Do extends Command {
  static description = 'Mark tasks as done';

  static examples = [
    `$ tj do 1`,
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
    const numbers = parseNumbers(argv, taskJson.todo.length, this.error);
    const date = new Date().toISOString();

    const doneTasks = _.remove(taskJson.todo, (_, index) => numbers.includes(index)).map(task => {
      task.end = date;
      task.modified = date;
      return task;
    });
    taskJson.done.push(...doneTasks);

    writeTaskJson(taskJson);

    this.log(`Finish ${doneTasks.length} task(s): ${doneTasks.map(task => `"${task.text}"`).join(", ")}`);
  }
}
