import {Command, flags} from '@oclif/command'
import { parseIds, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
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

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const ids = parseIds(argv, taskJson.todo.length, this.error);
    const date = new Date().toISOString();

    const doneTasks = _.remove(taskJson.todo, (_, index) => ids.includes(index)).map(task => {
      task.end = date;
      task.modified = date;
      return task;
    });
    taskJson.done.push(...doneTasks);

    writeTaskJson(taskJson);

    this.log(`Finish ${doneTasks.length} task(s): ${doneTasks.map(task => `"${task.text}"`).join(", ")}`);
  }
}
