import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { colorTask, filterByField, maxWidth, readTasks, urgency } from "../utils/task";
import { readConfig } from "../utils/config";
import { table, TableUserConfig } from "table";
import { Task } from "todo.json";
import chalk = require('chalk');

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
      ["ID", "Pri", "Text", "Projects", "Contexts", "Due"]
    ];

    const stdoutColumns = process.stdout.columns ?? 80;
    if (stdoutColumns < 50) {
      this.error("Terminal width must be greater than 50.");
    }
    const textWidth = Math.floor((stdoutColumns - 28) / 5 * 3);
    const projectWidth = Math.floor((stdoutColumns - 28) / 5);

    const tableOptions = (tasks: Task[]): TableUserConfig => ({
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
      },
      columns: {
        ...(maxWidth(tasks, "text") < textWidth ? null : ({ 2: {
          width: textWidth,
          wrapWord: true
        }})),
        ...(maxWidth(tasks, "projects") < projectWidth ? null : ({ 3: {
          width: projectWidth,
          wrapWord: true
        }})),
        ...(maxWidth(tasks, "contexts") < projectWidth ? null : ({ 4: {
          width: projectWidth,
          wrapWord: true
        }})),
      }
    });

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
        }).map(({ index, task }) => {
          const color = colorTask(task);
          return [
            (index + 1).toString(),
            task.priority ?? "",
            task.text,
            task.projects?.join(", ") ?? "",
            task.contexts?.join(", ") ?? "",
            task.due ?? ""
          ].map(field => color ? chalk[color].bold(field) : field);
      });

      todoOutput = table(header.concat(todoData), tableOptions(todoTasks));
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
        return [
          (index + 1).toString(),
          task.priority ?? "",
          task.text,
          task.projects?.join(",") ?? "",
          task.contexts?.join(",") ?? "",
          task.due ?? ""
        ];
      });

      doneOutput = table(header.concat(doneData), tableOptions(doneTasks));
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
