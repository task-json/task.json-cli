import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import { Task } from "task.json";

export default class ListCtx extends Command {
  static description = 'List contexts'

  static examples = [
    `$ td lsctx`,
    `$ td lsctx -a`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list contexts of all tasks including done ones"
    }),
    done: flags.boolean({
      char: "D",
      description: "list contexts of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListCtx);
    const { todoPath, donePath } = readConfig();

    const contexts: Set<string> = new Set();

    if (!flags.done) {
      let todoTasks = [] as Task[];
      if (fs.existsSync(todoPath)) {
        todoTasks = readTasks(todoPath);
      }

      todoTasks.forEach(task => {
        task.contexts?.forEach(p => contexts.add(p));
      });
    }

    if (flags.done || flags.all) {
      let doneTasks = [] as Task[];
      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      doneTasks.forEach(task => {
        task.contexts?.forEach(p => contexts.add(p));
      });
    }

    this.log([...contexts].join("\n"));
  }
}
