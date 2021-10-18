import {Command, flags} from '@oclif/command'
import { filterByField, filterByPriority, normalizeTypes, numberToId, parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { Task, TaskType } from 'task.json';
import cli from "cli-ux";
import { parseDate } from '../utils/date';

export default class Modify extends Command {
  static description = 'Modify tasks (use a single empty string to delete the field or filter tasks without it)';

  static examples = [
    `$ tj modify t1 -d 2020-12-12`,
    `$ tj modify d2 d3 -p projA -p projB`,
    `$ tj modify t1 -t "New description"`,
    `$ tj modify t2 -p ""  # delete projects field`,
    `$ tj modify -T todo --filter-projects projA -p projB # Modify all projA to projB`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    types: flags.string({
      char: "T",
      description: "filter tasks by types (todo, done, removed, all) [default: all (if no number specified)",
      multiple: true
    }),
    "filter-priorities": flags.string({
      description: "filter tasks by priority (A-Z)",
      multiple: true
    }),
    "filter-projects": flags.string({
      description: "filter tasks by specific projects",
      multiple: true
    }),
    "filter-contexts": flags.string({
      description: "filter tasks by specific contexts",
      multiple: true
    }),
    text: flags.string({
      char: "t",
      description: "modify text"
    }),
    priority: flags.string({
      char: "P",
      description: "modify priority (A-Z)"
    }),
    projects: flags.string({
      char: "p",
      description: "modify projects (overwrite all)",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "modify contexts (overwrite all)",
      multiple: true
    }),
    deps: flags.string({
      char: "D",
      description: "modify dependencies",
      multiple: true
    }),
    due: flags.string({
      char: "d",
      description: "modify due date"
    }),
    "and-projects": flags.boolean({
      description: "filter projects using AND operator instead of OR",
      default: false
    }),
    "and-contexts": flags.boolean({
      description: "filter contexts using AND operator instead of OR",
      default: false
    })
  };

  // Allow multiple arguments
  static strict = false;

  static args = [{
    name: "NUM...",
    description: "modify specific tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Modify);

    type FlagName = keyof (typeof flags);
    let hasFilters = false;
    const filterFlags: FlagName[] = ["filter-priorities", "filter-projects", "filter-contexts", "types"];
    for (const filterFlag of filterFlags) {
      if (flags[filterFlag]) {
        hasFilters = true;
        break;
      }
    }

    if (argv.length > 0 && hasFilters) {
      this.error("Cannot use both numbers and filters.");
    }
    if (!hasFilters && argv.length === 0) {
      const resp = await cli.confirm(`No filter or task number specified. This will make changes to ALL tasks. Continue? [y/n]`);
      if (!resp)
        this.exit(0);
    }

    const taskJson = readTaskJson();
    const date = new Date().toISOString();

    const modifyTasks = (indexes: number[], type: TaskType) => {
      for (const index of indexes) {
        const fields: (keyof Task)[] = ["text", "priority", "projects", "contexts", "due", "deps"];

        for (const field of fields) {
          const value = flags[field as FlagName] as string | string[] | undefined;
          if (value !== undefined) {
            if (typeof value === "string") {
              if (value.length > 0) {
                if (field === "due")
                  taskJson[type][index][field] = parseDate(value);
                else
                  taskJson[type][index][field] = value as any;
              }
              else {
                if (field === "text")
                  this.error(`Invalid empty text`);
                delete taskJson[type][index][field];
              }
            }
            else { // array of strings
              if (value.length === 1 && value[0].length === 0) {
                delete taskJson[type][index][field];
              }
              else {
                for (const v of value) {
                  if (v.length === 0) {
                    this.error(`Invalid empty ${field}`);
                  }
                }

                if (field === "deps")
                  taskJson[type][index][field] = numberToId(taskJson, value);
                else
                  taskJson[type][index][field] = value as any;
              }
            }
          }
        }

        taskJson[type][index].modified = date;
      }
    };

    let count = 0;
    if (argv.length === 0) {
      const types = normalizeTypes(flags.types || ["all"]);
      const priorityFilter = filterByPriority(flags['filter-priorities']);
      const projectFilter = filterByField(
        "projects",
        flags['filter-projects'],
        flags["and-projects"]
      );
      const contextFilter = filterByField(
        "contexts",
        flags['filter-contexts'],
        flags["and-contexts"]
      );

      for (const type of types) {
        const indexes = taskJson[type].map((task, index) => ({
          index,
          task
        }))
          .filter(({ task }) => (
            projectFilter(task) &&
            contextFilter(task) &&
            priorityFilter(task)
          ))
          .map(({ index }) => index);

        modifyTasks(indexes, type);
        count += indexes.length;
      }
    }
    else {
      const numbers = parseNumbers(argv, taskJson);
      for (const [type, indexes] of Object.entries(numbers)) {
        count += indexes.length;
        modifyTasks(indexes, type as TaskType);
      }
    }

    writeTaskJson(taskJson);
    this.log(`Modify ${count} task(s)`);
  }
}
