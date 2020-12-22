import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTasks } from "../utils/task";
import { readConfig } from "../utils/config";
import { table, TableUserConfig } from "table";
import { Task } from "../types";

export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ todo ls`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list all tasks including done ones"
    }),
    done: flags.boolean({
      char: "d",
      description: "list only done tasks"
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
    const { todoPath, donePath } = readConfig();

    const header = [
      ["ID", "Pri", "Text", "Projects", "Contexts", "Due"]
    ];
    const tableOptions: TableUserConfig = {
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
    };

    let todoOutput = "";
    let doneOutput = "";

    if (!flags.done) {
      let todoTasks = [] as Task[];
      if (fs.existsSync(todoPath)) {
        todoTasks = readTasks(todoPath);
      }

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

      todoOutput = table(header.concat(todoData), tableOptions);
    }

    if (flags.done || flags.all) {
      let doneTasks = [] as Task[];

      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      const doneData = doneTasks.map((task, index) => ([
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

      doneOutput = table(header.concat(doneData), tableOptions);
    }

    if (flags.all) {
      this.log(`\nTodo:\n\n${todoOutput}\nDone:\n\n${doneOutput}`)
    }
    else if (flags.done) {
      this.log(`\n${doneOutput}`);
    }
    else {
      this.log(`\n${todoOutput}`);
    }
  }
}
