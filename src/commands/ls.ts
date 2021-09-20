import {Command, flags} from '@oclif/command'
import { colorTask, filterByField, filterByPriority, maxWidth, normalizeTypes, readTaskJson } from "../utils/task";
import { calculateWidth, tableConfig } from "../utils/table";
import { table } from "table";
import { taskUrgency } from "task.json";
import chalk = require('chalk');
import wrapAnsi = require("wrap-ansi");
import { DateTime } from "luxon";

export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ tj ls`,
    `$ tj ls -p test`,
    `$ tj ls -c ""  # list tasks without contexts`,
    `$ tj ls -p projA -p projB  # list tasks with projA or projB`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    types: flags.string({
      char: "T",
      description: "filter tasks by types (todo, done, removed, all) [default: todo]",
      default: ["todo"],
      multiple: true
    }),
    priorities: flags.string({
      char: "P",
      description: "filter tasks by priorities (A-Z)",
      multiple: true
    }),
    projects: flags.string({
      char: "p",
      description: "filter tasks by specific projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "filter tasks by specific contexts",
      multiple: true
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
      ["#", "P", "Text", "Projects", "Contexts", "Due"]
    ];

    const stdoutColumns = process.stdout.columns ?? 80;
    if (stdoutColumns < 50) {
      this.error("Terminal width must be greater than 50.");
    }

    const wrapOptions = {
      hard: true
    };

    const taskJson = readTaskJson();
    const types = normalizeTypes(flags.types, this.error);

    for (const type of types) {
      const priorityFilter = filterByPriority(flags.priorities);
      const projectFilter = filterByField(
        "projects",
        flags.projects,
        flags["and-projects"]
      );
      const contextFilter = filterByField(
        "contexts",
        flags.contexts,
        flags["and-contexts"]
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
          return taskUrgency(b.task) - taskUrgency(a.task);
        });

      const textWidth = maxWidth(data, "text");
      const projWidth = maxWidth(data, "projects");
      const ctxWidth = maxWidth(data, "contexts");
      const dueWidth = maxWidth(data, "due");

      const result = calculateWidth(stdoutColumns, {
        numWidth: Math.max(1, data.length.toString().length + 1),
        priWidth: 1,
        textWidth,
        projWidth,
        ctxWidth,
        dueWidth
      }, 2 * 6);

      const tableData = data.map(({ index, task }) => {
        const color = type === "todo" ? colorTask(task) : null;
        return [
          `${type.charAt(0)}${index+1}`,
          task.priority ?? "",
          task.text,
          task.projects?.join(" ") ?? "",
          task.contexts?.join(" ") ?? "",
          task.due ? DateTime.fromISO(task.due).toFormat("yyyy-MM-dd") : ""
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

      const output = table(header.concat(tableData), tableConfig);

      this.log(`\n${output}`);
    }
  }
}
