import {Command, flags} from '@oclif/command'
import { parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import * as _ from "lodash";
import { TaskType } from "task.json";

export default class Undo extends Command {
  static description = 'Undo tasks';

  static examples = [
    `$ tj undo 1 2`,
    `$ tj undo --removed 1 2`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
		removed: flags.boolean({
			char: "R",
			description: "restore removed tasks"
		})
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    description: "undo specific done or removed tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Undo);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
		const type: TaskType = flags.removed ? "removed" : "done";
    const numbers = parseNumbers(argv, taskJson[type].length, this.error);
    const date = new Date().toISOString();
    const undoneTasks = _.remove(taskJson[type], (_, index) => numbers.includes(index))
      .map(task => {
        task.modified = date;
        return task;
      });
    const doneTasks = undoneTasks.filter(task => type === "removed" && task.end);
    const todoTasks = undoneTasks.filter(task => type === "done" || !task.end);

    todoTasks.forEach(task => {
      delete task.end;
      return task;
    });

    taskJson.todo.push(...todoTasks);
    taskJson.done.push(...doneTasks);

    writeTaskJson(taskJson);

    this.log(`Undo ${undoneTasks.length} task(s): ${undoneTasks.map(task => `"${task.text}"`).join(", ")}`);
  }
}
