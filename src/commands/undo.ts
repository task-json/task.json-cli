import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { appendTasks, readTasks, writeTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import * as _ from "lodash";

export default class Undo extends Command {
  static description = 'Mark tasks as done';

  static examples = [
    `$ todo done 1`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "ID...",
    description: "mark specific IDs as done"
  }];

  async run() {
    const { argv } = this.parse(Undo);
    const { todoPath, donePath } = readConfig();

    if (!fs.existsSync(donePath)) {
      this.error("done.json does not exist. Use `todo add` to create one.");
    }

    // Read Todo
    const doneTasks = readTasks(donePath);

    const ids = argv.map(a => {
      const id = parseInt(a);
      if (isNaN(id) || id <= 0)
        this.error("Invalid IDs");
      if (id > doneTasks.length)
        this.error(`Task ${id} does not exist.`);
      return id;
    });

    const todoTasks = _.remove(doneTasks, (_, index) => ids.includes(index)).map(task => {
      delete task.end;
      return task;
    });
    writeTasks(donePath, doneTasks);
    appendTasks(todoPath, todoTasks);

    this.log(`Undo ${todoTasks.length} task(s).`);
  }
}
