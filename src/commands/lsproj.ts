import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import { Task } from "todo.json";

export default class ListProj extends Command {
  static description = 'List projects'

  static examples = [
    `$ td lsproj`,
    `$ td lsproj -a`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list projects of all tasks including done ones"
    }),
    done: flags.boolean({
      char: "D",
      description: "list projects of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);
    const { todoPath, donePath } = readConfig();

    const projects: Set<string> = new Set();

    if (!flags.done) {
      let todoTasks = [] as Task[];
      if (fs.existsSync(todoPath)) {
        todoTasks = readTasks(todoPath);
      }

      todoTasks.forEach(task => {
        task.projects?.forEach(p => projects.add(p));
      });
    }

    if (flags.done || flags.all) {
      let doneTasks = [] as Task[];
      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      doneTasks.forEach(task => {
        task.projects?.forEach(p => projects.add(p));
      });
    }

    this.log([...projects].join("\n"));
  }
}
