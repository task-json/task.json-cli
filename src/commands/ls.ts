import {Command, flags} from '@oclif/command'
import { colorTask, filterByDeps, filterByField, filterByPriority, idToNumber, maxWidth, normalizeTypes, readTaskJson, TaskStr } from "../utils/task";
import { calculateWidth, tableConfig } from "../utils/table";
import { table } from "table";
import { Task, taskUrgency } from "task.json";
import chalk = require('chalk');
import wrapAnsi = require("wrap-ansi");
import { showDate } from '../utils/date';

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
    deps: flags.boolean({
      char: "D",
      description: "show dependent tasks and dependencies [default: false]",
      default: false
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
      ["#", "P", "Text", "Proj", "Ctx", "Due", ...(flags.deps ? ["Dep"] : [])]
    ];

    const stdoutColumns = process.stdout.columns ?? 80;
    if (stdoutColumns < 50) {
      this.error("Terminal width must be greater than 50.");
    }

    const wrapOptions = {
      hard: true
    };

    const taskJson = readTaskJson();
    const types = normalizeTypes(flags.types);

    for (const type of types) {
      const priorityFilter = filterByPriority(flags.priorities);
      const depFilter = filterByDeps(flags.deps);
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

      const parseDeps = (task: Task): Task => {
        return {
          ...task,
          ...(task.deps && { deps: idToNumber(taskJson, task.deps) })
        };
      };

      const data = taskJson[type].map((task, index) => ({
        index,
        task: parseDeps(task)
      }))
        .filter(({ task }) => (
          projectFilter(task) &&
          contextFilter(task) &&
          priorityFilter(task) &&
          depFilter(task)
        ));

      if (type === "todo")
        data.sort((a, b) => {
          return taskUrgency(b.task) - taskUrgency(a.task);
        });

      const processedData: TaskStr[] = data.map(({ task, index }) => ({
        number: `${type.charAt(0)}${index + 1}`,
        priority: task.priority ?? "",
        text: task.text,
        ...(flags.deps && { deps: task.deps?.join(" ") ?? "" }),
        projects: task.projects?.join(" ") ?? "",
        contexts: task.contexts?.join(" ") ?? "",
        due: task.due ? showDate(task.due) : "",
        color: type === "todo" ? colorTask(task) : null
      }));

      const widths = maxWidth(processedData, flags.deps);

      const result = calculateWidth(stdoutColumns, {
        numWidth: Math.max(1, data.length.toString().length + 1),
        priWidth: 1,
        depWidth: widths.deps,
        textWidth: widths.text,
        projWidth: widths.projects,
        ctxWidth: widths.contexts,
        dueWidth: widths.due
      }, 2 * (6 + (flags.deps ? 1 : 0)));

      const tableData = processedData.map(task => {
        const row = [
          task.number,
          task.priority,
          task.text,
          task.projects,
          task.contexts,
          task.due,
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
        if (flags.deps) {
          let value = task.deps!;
          if (result)
            value = wrapAnsi(value, result.depWidth, wrapOptions);
          row.push(value);
        }
        return row.map(value => task.color ? chalk[task.color].bold(value) : value);
      });

      const output = table(header.concat(tableData), tableConfig);

      this.log(`\n${output}`);
    }
  }
}
