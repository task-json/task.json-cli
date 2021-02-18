import {Command, flags} from '@oclif/command'
import { colorTask, filterByField, filterByPriority, maxWidth, readTaskJson, urgency } from "../utils/task";
import { calculateWidth } from "../utils/table";
import { table, TableUserConfig } from "table";
import { TaskType } from "task.json";
import chalk = require('chalk');
import wrapAnsi = require("wrap-ansi");
export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ tj ls`,
    `$ tj ls -p test`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list only done tasks"
    }),
    priority: flags.string({
      char: "P",
      description: "filter tasks by priority (A-Z)",
      multiple: true
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
    "without-priority": flags.boolean({
      description: "list tasks without priority",
      default: false
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

    const taskJson = readTaskJson();
    const type: TaskType = flags.done ? "done" : "todo";

    const priorityFilter = filterByPriority(
      flags.priority,
      flags["without-priority"]
    );
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

    const data = taskJson[type].map((task, index) => ({
      index,
      task
    }))
      .filter(({ task }) => (
        projectFilter(task) &&
        contextFilter(task) &&
        priorityFilter(task)
      ));

    if (type === "todo")
      data.sort((a, b) => {
        return urgency(b.task) - urgency(a.task);
      });

    const textWidth = maxWidth(data, "text");
    const projWidth = maxWidth(data, "projects");
    const ctxWidth = maxWidth(data, "contexts");
    const dueWidth = maxWidth(data, "due");

    const result = calculateWidth(stdoutColumns, {
      idWidth: Math.max(2, data.length.toString().length),
      priWidth: 1,
      textWidth,
      projWidth,
      ctxWidth,
      dueWidth
    }, 2 * 6);

    const tableData = data.map(({ index, task }) => {
      const color = type === "todo" ? colorTask(task) : null;
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

    const output = table(header.concat(tableData), tableOptions);

    this.log(`\n${output}`);
  }
}
