import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { format } from "date-fns";
import { parseIds, readTasks, writeTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import * as _ from "lodash";

export default class Remove extends Command {
  static description = 'Delete tasks';

  static examples = [
    `$ todo rm 1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      char: "d",
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
    const { todoPath, donePath } = readConfig();

    const taskPath = flags.done ? donePath : todoPath;

    if (!fs.existsSync(taskPath)) {
      this.error(`${flags.done ? "done" : "todo"}.json does not exist.`);
    }

    // Read Todo
    const tasks = readTasks(taskPath);
    const ids = parseIds(argv, tasks.length, this.error);

    const removedTasks = _.remove(tasks, (_, index) => ids.includes(index)).map(task => {
      task.end = format(new Date(), "yyyy-MM-dd")
      return task;
    });
    writeTasks(taskPath, tasks);

    this.log(`Delete ${removedTasks.length} task(s) from ${flags.done ? "done" : "todo"}.json.`);
  }
}
