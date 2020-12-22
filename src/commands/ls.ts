import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import { table } from "table";

export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ todo ls`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list all tasks including completed ones"
    }),
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

  async run() {
    const { flags } = this.parse(List);
    const { todoPath } = readConfig();

    if (!fs.existsSync(todoPath)) {
      this.error("todo.json does not exist. Use `todo add` to create one.");
    }

    // Read Todo
    const todoTasks = readTasks(todoPath);

    const header = [
      ["ID", "Pri", "Text", "Projects", "Contexts", "Due"]
    ];
    const todoData = todoTasks.map((task, index) => ([
      (index + 1).toString(),
      task.priority ?? "",
      task.text,
      task.projects?.join(",") ?? "",
      task.contexts?.join(",") ?? "",
      task.due ?? ""
    ])).sort((a, b) => {
      // Priority
      if (a[1].length !== b[1].length)
        return b[1].length - a[1].length;
      if (a[1] !== b[1])
        return a[1] < b[1] ? -1 : 1;

      // Due date
      if (a[5].length !== b[5].length)
        return b[5].length - a[5].length;
      if (a[5] !== b[5])
        return a[5] < b[5] ? -1 : 1;

      return 0;
    });

    const todoOutput = table(header.concat(todoData), {
      drawHorizontalLine: index => index === 1,
      border: {
        bodyLeft: "",
        bodyRight: "",
        bodyJoin: "",
        bottomLeft: "",
        bottomRight: "",
        bottomJoin: "",
        bottomBody: "─",

        joinLeft: "",
        joinRight: "",
        joinJoin: ""
      }
    });

    this.log(`\n${todoOutput}`);
  }
}
