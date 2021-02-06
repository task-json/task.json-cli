import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import { Task } from "task.json";
import * as _ from "lodash";

export default class ListProj extends Command {
  static description = 'List IDs'

  static examples = [
    `$ td lsid`,
    `$ td lsid -D`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list IDs of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);
    const { todoPath, donePath } = readConfig();

    let size = 0;

    if (!flags.done) {
      let todoTasks = [] as Task[];
      if (fs.existsSync(todoPath)) {
        todoTasks = readTasks(todoPath);
      }
      size = todoTasks.length;
    }

    if (flags.done) {
      let doneTasks = [] as Task[];
      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      size = doneTasks.length;
    }

    this.log(_.range(1, size + 1).join("\n"));
  }
}
