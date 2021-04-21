import {Command, flags} from '@oclif/command'
import { filterByField, filterByPriority, parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { Task, TaskType } from 'task.json';

export default class Modify extends Command {
  static description = 'Modify tasks (use empty value to delete the field or filter tasks without ';

  static examples = [
    `$ tj modify 1 -d 2020-12-12`,
    `$ tj modify 2 3 -p projA -p projB`,
    `$ tj modify 1 -t "New description" --done`,
    `$ tj modify --filter-projects projA -p projB # Modify all projA to projB`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      char: "D",
      description: "modify done tasks"
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
      description: "modify priority"
    }),
    projects: flags.string({
      description: "modify projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "modify contexts",
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
    name: "ID...",
    description: "modify specific tasks"
  }];

  async run() {
    const { argv, flags } = this.parse(Modify);

    checkTaskExistence(this.error);

    const taskJson = readTaskJson();
    const numbers = parseNumbers(argv, taskJson.todo.length, this.error);
    const date = new Date().toISOString();
    const type: TaskType = flags.done ? "done" : "todo";

    type FlagName = keyof (typeof flags);

    let hasFilters = false;
    const filterFlags: FlagName[] = ["filter-priorities", "filter-projects", "filter-contexts"];
    for (const filterFlag of filterFlags) {
      if (flags[filterFlag]) {
        hasFilters = true;
        break;
      }
    }

    if (numbers.length > 0 && hasFilters) {
      this.error("Cannot use both numbers and filters.");
    }

    const modifyTasks = (numbers: number[]) => {
      for (const num of numbers) {
        const fields: (keyof Task)[] = ["text", "priority", "projects", "contexts", "due"];

        for (const field of fields) {
          const value = flags[field as FlagName] as string | string[] | undefined;
          if (value !== undefined) {
            if (typeof value === "string") {
              if (value.length > 0) {
                taskJson[type][num][field] = value as any;
              }
              else {
                if (field === "text")
                  this.error(`Invalid empty text`);
                delete taskJson[type][num][field];
              }
            }
            else {
              if (value.length === 1 && value[0].length === 0) {
                delete taskJson[type][num][field];
              }
              else {
                for (const v of value) {
                  if (v.length === 0) {
                    this.error(`Invalid empty ${field}`);
                  }
                }
                taskJson[type][num][field] = value as any;
              }
            }
          }
        }

        taskJson[type][num].modified = date;
      }
      this.log(`Modify ${numbers.length} task(s)`);
    };

    if (hasFilters) {
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

      modifyTasks(indexes);
    }
    else {
      modifyTasks(numbers);
    }

    writeTaskJson(taskJson);
  }
}
