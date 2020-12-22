import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { format } from "date-fns";
import { Task } from "../types";
import { readTodo, writeTodo } from "../utils/task";
import { readConfig } from "../utils/config";

export default class Add extends Command {
  static description = 'add a new task'

  static examples = [
    `$ todo add "Hello world" -p hello world -c test
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)"
    }),
    projects: flags.string({
      char: "p",
      description: "one or more projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "one or more contexts",
      multiple: true
    }),
  }

  static args = [{
    name: "text"
  }]

  async run() {
    const { args, flags } = this.parse(Add);
    let tasks: Task[];

    const { dataPath } = readConfig();

    if (!fs.existsSync(dataPath)) {
      tasks = [];
    }
    else {
      // Read
      tasks = readTodo(dataPath);
    }

    tasks.push({
      text: args.text,
      priority: flags.priority || "",
      done: false,
      contexts: flags.contexts || [],
      projects: flags.projects || [],
      due: null,
      start: format(new Date(), "yyyy-MM-dd"),
      end: null
    });

    writeTodo(dataPath, tasks);
    this.log(`Task ${tasks.length} added: ${args.text}`);
  }
}
