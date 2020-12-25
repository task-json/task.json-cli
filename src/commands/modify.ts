import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks, writeTasks } from "../utils/task";
import { readConfig } from "../utils/config";

export default class Modify extends Command {
  static description = 'Modify tasks';

  static examples = [
    `$ todo modify 1 --due 2020-12-12`,
    `$ todo modify 2 3 --projects projA projB`,
    `$ todo modify 1 --text "New description" --done`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      description: "modify done tasks"
    }),
    text: flags.string({
      char: "t",
      description: "modify text",
      multiple: true
    }),
    priority: flags.string({
      char: "P",
      description: "modify priority"
    }),
    projects: flags.string({
      char: "p",
      description: "modify projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "modify contexts",
      multiple: true
    }),
    due: flags.string({
      char: "d",
      description: "modify due date"
    }),
    "delete-priority": flags.boolean({
      description: "delete priority"
    }),
    "delete-projects": flags.boolean({
      description: "delete projects"
    }),
    "delete-contexts": flags.boolean({
      description: "delete contexts"
    }),
    "delete-due": flags.boolean({
      description: "delete due date"
    })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "ID...",
    description: "modify specific tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Modify);
    const { todoPath, donePath } = readConfig();

    const taskPath = flags.done ? donePath : todoPath;

    if (!fs.existsSync(taskPath)) {
      this.error(`${flags.done ? "done" : "todo"}.json does not exist.`);
    }

    const tasks = readTasks(taskPath);

    const ids = argv.map(a => {
      const id = parseInt(a);
      if (isNaN(id) || id <= 0)
        this.error("Invalid IDs");
      if (id > tasks.length)
        this.error(`Task ${id} does not exist.`);
      return id - 1;
    });

    for (const id of ids) {
      if (flags.text)
        tasks[id].text = flags.text.join(" ");
      if (flags.priority)
        tasks[id].priority = flags.priority;
      if (flags.projects)
        tasks[id].projects = flags.projects;
      if (flags.contexts)
        tasks[id].contexts = flags.contexts;
      if (flags.due)
        tasks[id].due = flags.due;
      if (flags["delete-contexts"])
        delete tasks[id].contexts;
      if (flags["delete-due"])
        delete tasks[id].due;
      if (flags["delete-priority"])
        delete tasks[id].priority;
      if (flags["delete-projects"])
        delete tasks[id].projects;
    }

    writeTasks(taskPath, tasks);
    this.log(`Modify ${ids.length} task(s) in ${flags.done ? "done" : "todo"}.json.`);
  }
}
