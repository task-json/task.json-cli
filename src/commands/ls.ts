import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { colorTask, readTasks, urgency } from "../utils/task";
import { readConfig } from "../utils/config";
import { table, TableUserConfig } from "table";
import { Task } from "../types";
import chalk = require('chalk');

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

      const todoData = todoTasks.map((task, index) => ({
        index,
        task
      })).sort((a, b) => {
        return urgency(b.task) - urgency(a.task);
      }).map(({ index, task }) => {
        const color = colorTask(task);
        return [
          (index + 1).toString(),
          task.priority ?? "",
          task.text,
          task.projects?.join(",") ?? "",
          task.contexts?.join(",") ?? "",
          task.due ?? ""
        ].map(field => color ? chalk[color](field) : field);
      });

      todoOutput = table(header.concat(todoData), tableOptions);
    }

    if (flags.done || flags.all) {
      let doneTasks = [] as Task[];

      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      const doneData = doneTasks.map((task, index) => ({
        index,
        task
      })).sort((a, b) => {
        return urgency(b.task) - urgency(a.task);
      }).map(({ index, task }) => {
        const color = colorTask(task);
        return [
          (index + 1).toString(),
          task.priority ?? "",
          task.text,
          task.projects?.join(",") ?? "",
          task.contexts?.join(",") ?? "",
          task.due ?? ""
        ].map(field => color ? chalk[color](field) : field);
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
