import {Command, flags} from '@oclif/command'
import chalk = require('chalk');
import { DateTime } from 'luxon';
import { TaskType } from 'task.json';
import { readData } from '../utils/config';
import { showDate } from '../utils/date';
import { colorDue, colorPriority, parseNumbers } from "../utils/task";

export default class Detail extends Command {
  static description = 'Show task details'

  static examples = [
    `$ tj detail t1`,
    `$ tj detail t1 d1`
  ]

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{
    name: "NUM...",
    required: true,
    description: "tasks to show details of"
  }];

  async run() {
    const { argv } = this.parse(Detail);
    if (argv.length === 0)
      this.error("No task specified");

    const taskJson = readData("task");
    const numbers = parseNumbers(argv, taskJson);

    for (const [type, indexes] of Object.entries(numbers)) {
      for (const index of indexes) {
        const task = taskJson[type as TaskType][index];
        const color = chalk.cyanBright;
        const num = chalk.bold(`${type.charAt(0)}${index + 1}`);
        this.log(`\nTask ${num}`);
        this.log(`  ${color("Status")}: ${type}`);
        if (task.priority) {
          const priColor = colorPriority(task.priority);
          this.log(`  ${color("Pri")}: ${chalk[priColor].bold(task.priority)}`);
        }
        this.log(`  ${color("Text")}: ${task.text}`);
        if (task.deps)
          this.log(`  ${color("Deps")}: ${task.deps.join(" ")}`);
        if (task.projects)
          this.log(`  ${color("Proj")}: ${task.projects.join(" ")}`);
        if (task.contexts)
          this.log(`  ${color("Ctx")}: ${task.contexts.join(" ")}`);
        if (task.due) {
          const dueColor = colorDue(task.due);
          const due = showDate(DateTime.fromISO(task.due));
          const coloredDue = dueColor ? chalk[dueColor].bold(due) : due;
          this.log(`  ${color("Due")}: ${coloredDue}`)
        }
      }
    }
  }
}
