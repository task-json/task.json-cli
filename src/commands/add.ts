import { Command, flags } from '@oclif/command'
import { format } from "date-fns";
import { Task } from "../types";
import { appendTasks } from "../utils/task";
import { readConfig } from "../utils/config";

export default class Add extends Command {
  static description = 'Add a new task'

  static examples = [
    '$ todo add Hello World',
    '$ todo add "Hello World" -p test first-task -c test --due 2020-12-24',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)",
      default: ""
    }),
    projects: flags.string({
      char: "p",
      description: "one or more projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "one or more contexts",
      multiple: true
    }),
    due: flags.string({
      char: "d",
      description: "due date"
    })
  }

  static strict = false;

  static args = [{
    name: "text",
    required: true
  }];

  async run() {
    const { argv, flags } = this.parse(Add);
    const { todoPath } = readConfig();

    const text = argv.join(" ");

    // TODO: add date validation
    const task = {
      text,
      priority: flags.priority,
      contexts: flags.contexts,
      projects: flags.projects,
      due: flags.due,
      start: format(new Date(), "yyyy-MM-dd")
    } as Task;

    const id = appendTasks(todoPath, [task]);
    this.log(`Task ${id + 1} added: ${text}`);
  }
}
