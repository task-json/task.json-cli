import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { colorTask, filterByField, maxWidth, readTasks, urgency } from "../utils/task";
import { readConfig } from "../utils/config";
import { calculateWidth } from "../utils/table";
import { table, TableUserConfig } from "table";
import { Task } from "task.json";
import chalk = require('chalk');
import wrapAnsi = require("wrap-ansi");
export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ td ls`,
    `$ td ls -p test`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list all tasks including done ones"
    }),
    done: flags.boolean({
      char: "D",
      description: "list only done tasks"
    }),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)"
    }),
    project: flags.string({
      char: "p",
      description: "filter tasks by specific projects",
      multiple: true
    }),
    context: flags.string({
      char: "c",
      description: "filter tasks by specific contexts",
      multiple: true
    }),
    "without-projects": flags.boolean({
      description: "list tasks without projects",
      default: false
    }),
    "without-contexts": flags.boolean({
      description: "list tasks without contexts",
      default: false
    }),
    "and-projects": flags.boolean({
      description: "filter projects using AND operator instead of OR",
      default: false
    }),
    "and-contexts": flags.boolean({
      description: "filter contexts using AND operator instead of OR",
      default: false
    })
  }

  async run() {
    const { flags } = this.parse(List);
    const { todoPath, donePath } = readConfig();

    const header = [
      ["ID", "P", "Text", "Projects", "Contexts", "Due"]
    ];

    const stdoutColumns = process.stdout.columns ?? 80;
    if (stdoutColumns < 50) {
      this.error("Terminal width must be greater than 50.");
    }

    const tableOptions: TableUserConfig = {
      drawHorizontalLine: index => index === 1,
      border: {
        bodyLeft: "",
        bodyRight: "",
        bodyJoin: "",
        bottomLeft: "",
        bottomRight: "",
        bottomJoin: "",
        bottomBody: "-",

        joinLeft: "",
        joinRight: "",
        joinJoin: ""
      }
    };

    const wrapOptions = {
      hard: true
    };

    let todoOutput = "";
    let doneOutput = "";

    if (!flags.done) {
      let todoTasks = [] as Task[];
      if (fs.existsSync(todoPath)) {
        todoTasks = readTasks(todoPath);
      }

      const projectFilter = filterByField(
        "projects",
        flags.project,
        flags["and-projects"],
        flags["without-projects"]
      );
      const contextFilter = filterByField(
        "contexts",
        flags.context,
        flags["and-contexts"],
        flags["without-contexts"]
      );

      const todoData = todoTasks.map((task, index) => ({
        index,
        task
      }))
        .filter(({ task }) => projectFilter(task) && contextFilter(task))
        .sort((a, b) => {
          return urgency(b.task) - urgency(a.task);
        });

      const textWidth = maxWidth(todoData, "text");
      const projWidth = maxWidth(todoData, "projects");
      const ctxWidth = maxWidth(todoData, "contexts");
      const dueWidth = maxWidth(todoData, "due");

      const result = calculateWidth(stdoutColumns, {
        idWidth: Math.max(2, todoData.length.toString().length),
        priWidth: 1,
        textWidth,
        projWidth,
        ctxWidth,
        dueWidth
      }, 2 * 6);

      const output = todoData.map(({ index, task }) => {
        const color = colorTask(task);
        return [
          (index + 1).toString(),
          task.priority ?? "",
          task.text,
          task.projects?.join(" ") ?? "",
          task.contexts?.join(" ") ?? "",
          task.due ?? ""
        ].map((field, i) => {
          let value = field;
          if (result) {
            if (i === 2)
              value = wrapAnsi(field, result.textWidth, wrapOptions);
            if (i === 3)
              value = wrapAnsi(field, result.projWidth, wrapOptions);
            if (i === 4)
              value = wrapAnsi(field, result.ctxWidth, wrapOptions);
          }

          return color ? chalk[color].bold(value) : value;
        });
      });

      todoOutput = table(header.concat(output), tableOptions);
    }

    if (flags.done || flags.all) {
      let doneTasks = [] as Task[];

      if (fs.existsSync(donePath)) {
        doneTasks = readTasks(donePath);
      }

      const doneData = doneTasks.map((task, index) => ({
        index,
        task
      }));

      const textWidth = maxWidth(doneData, "text");
      const projWidth = maxWidth(doneData, "projects");
      const ctxWidth = maxWidth(doneData, "contexts");
      const dueWidth = maxWidth(doneData, "due");

      const result = calculateWidth(stdoutColumns, {
        idWidth: Math.max(2, doneData.length.toString().length),
        priWidth: 1,
        textWidth,
        projWidth,
        ctxWidth,
        dueWidth
      }, 2 * 6);

      const output = doneData.map(({ index, task }) => {
        return [
          (index + 1).toString(),
          task.priority ?? "",
          task.text,
          task.projects?.join(" ") ?? "",
          task.contexts?.join(" ") ?? "",
          task.due ?? ""
        ].map((field, i) => {
          let value = field;
          if (result) {
            if (i === 2)
              value = wrapAnsi(field, result.textWidth, wrapOptions);
            if (i === 3)
              value = wrapAnsi(field, result.projWidth, wrapOptions);
            if (i === 4)
              value = wrapAnsi(field, result.ctxWidth, wrapOptions);
          }

          return value;
        });
      });

      doneOutput = table(header.concat(output), tableOptions);
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
