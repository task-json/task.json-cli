import {Command, flags} from '@oclif/command'
import { colorTask, filterByField, filterByPriority, maxWidth, readTaskJson } from "../utils/task";
import { calculateWidth } from "../utils/table";
import { table, TableUserConfig } from "table";
import { TaskType, taskUrgency } from "task.json";
import chalk = require('chalk');
import wrapAnsi = require("wrap-ansi");
import { DateTime } from "luxon";

export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ tj ls`,
    `$ tj ls -p test`,
    `$ tj ls -c "" # list tasks without contexts`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list only done tasks"
    }),
    removed: flags.boolean({
      char: "R",
      description: "list only removed tasks"
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

		if (flags.done && flags.removed) {
			this.error("Cannot specify both `--done` and `--removed` flags");
		}

    const taskJson = readTaskJson();
    const type: TaskType = flags.done
			? "done" : (flags.removed
			? "removed" : "todo");

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
      numWidth: Math.max(1, data.length.toString().length),
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

    const output = table(header.concat(tableData), tableOptions);

    this.log(`\n${output}`);
  }
}
