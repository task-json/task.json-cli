import {Command, flags} from '@oclif/command'
import { filterByField, filterByPriority, parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";
import { Task, TaskType } from 'task.json';

export default class Modify extends Command {
  static description = 'Modify tasks';

  static examples = [
    `$ tj modify 1 --new-due 2020-12-12`,
    `$ tj modify 2 3 --new-projects projA --new-projects projB`,
    `$ tj modify 1 --new-text "New description" --done`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      char: "D",
      description: "modify done tasks"
    }),
    priorities: flags.string({
      char: "P",
      description: "filter tasks by priority (A-Z)",
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
    "without-priorities": flags.boolean({
      description: "list tasks without priorities",
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
    "new-text": flags.string({
      char: "t",
      description: "modify text",
      multiple: true
    }),
    "new-priority": flags.string({
      char: "P",
      description: "modify priority"
    }),
    "new-projects": flags.string({
      description: "modify projects",
      multiple: true
    }),
    "new-contexts": flags.string({
      char: "c",
      description: "modify contexts",
      multiple: true
    }),
    "new-due": flags.string({
      char: "d",
      description: "modify due date"
    }),
    "delete-priority": flags.boolean({
      description: "delete priority"
    }),
    "delete-projects": flags.boolean({
      description: "delete projects"
    }),
    "delete-contexts": flags.boolean({
      description: "delete contexts"
    }),
    "delete-due": flags.boolean({
      description: "delete due date"
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
    const filterFlags: FlagName[] = ["priorities", "projects", "contexts"];
    for (const filterFlag of filterFlags) {
      const withoutFlag = `without-${filterFlag}` as FlagName;
      if (flags[filterFlag] || flags[withoutFlag]) {
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
          const newFlagName = `new-${field}` as FlagName;
          const deleteFlagName = `delete-${field}` as FlagName;

          if (field === "text") {
            if (flags[newFlagName]) {
              taskJson[type][num][field] = flags["new-text"].join(" ");
            }
            continue;
          }

          if (flags[newFlagName]) {
            taskJson[type][num][field] = flags[newFlagName] as any;
          }
          if (flags[deleteFlagName]) {
            delete taskJson[type][num][field];
          }
        }

        taskJson[type][num].modified = date;
      }
      this.log(`Modify ${numbers.length} task(s)`);
    };

    if (hasFilters) {
      const priorityFilter = filterByPriority(
        flags.priorities,
        flags["without-priorities"]
      );
      const projectFilter = filterByField(
        "projects",
        flags.projects,
        flags["and-projects"],
        flags["without-projects"]
      );
      const contextFilter = filterByField(
        "contexts",
        flags.contexts,
        flags["and-contexts"],
        flags["without-contexts"]
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
