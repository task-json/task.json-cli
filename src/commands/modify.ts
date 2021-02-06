import {Command, flags} from '@oclif/command'
import { parseIds, readTaskJson, writeTaskJson } from "../utils/task";
import { checkTaskExistence } from "../utils/config";

export default class Modify extends Command {
  static description = 'Modify tasks';

  static examples = [
    `$ tj modify 1 --due 2020-12-12`,
    `$ tj modify 2 3 -p projA -p projB`,
    `$ tj modify 1 --text "New description" --done`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    done: flags.boolean({
      char: "D",
      description: "modify done tasks"
    }),
    text: flags.string({
      char: "t",
      description: "modify text",
      multiple: true
    }),
    priority: flags.string({
      char: "P",
      description: "modify priority"
    }),
    project: flags.string({
      char: "p",
      description: "modify projects",
      multiple: true
    }),
    context: flags.string({
      char: "c",
      description: "modify contexts",
      multiple: true
    }),
    due: flags.string({
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
    const ids = parseIds(argv, taskJson.todo.length, this.error);
    const date = new Date().toISOString();

    for (const id of ids) {
      if (flags.text)
        taskJson.todo[id].text = flags.text.join(" ");
      if (flags.priority)
        taskJson.todo[id].priority = flags.priority;
      if (flags.project)
        taskJson.todo[id].projects = flags.project;
      if (flags.context)
        taskJson.todo[id].contexts = flags.context;
      if (flags.due)
        taskJson.todo[id].due = flags.due;
      if (flags["delete-contexts"])
        delete taskJson.todo[id].contexts;
      if (flags["delete-due"])
        delete taskJson.todo[id].due;
      if (flags["delete-priority"])
        delete taskJson.todo[id].priority;
      if (flags["delete-projects"])
        delete taskJson.todo[id].projects;

      taskJson.todo[id].modified = date;
    }

    writeTaskJson(taskJson);
    this.log(`Modify ${ids.length} task(s)`);
  }
}
