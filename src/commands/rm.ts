import {Command, flags} from '@oclif/command'
import { parseIds, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import * as _ from "lodash";
import { TaskType } from 'task.json';

export default class Remove extends Command {
  static description = 'Delete tasks';

  static examples = [
    `$ todo rm 1`,
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
    name: "ID...",
    description: "delete specific tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Remove);

    checkTaskExistence(this.error);
    const type: TaskType = flags.done ? "done" : "todo";

    // Read Todo
    const taskJson = readTaskJson();
    const ids = parseIds(argv, taskJson[type].length, this.error);
    const date = new Date().toISOString();

    const removedTasks = _.remove(taskJson[type], (_, index) => ids.includes(index)).map(task => {
      task.modified = date;
      return task;
    });
    taskJson.removed.push(...removedTasks);

    writeTaskJson(taskJson);

    this.log(`Remove ${removedTasks.length} task(s)`);
  }
}
