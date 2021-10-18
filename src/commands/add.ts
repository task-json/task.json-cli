import { Command, flags } from '@oclif/command'
import { Task } from "task.json";
import { v4 as uuidv4 } from "uuid";
import { numberToId, readTaskJson, writeTaskJson } from "../utils/task";
import { parseDate } from '../utils/date';
import { readWorkspace } from '../utils/workspace';

export default class Add extends Command {
  static description = 'Add a new task'

  static examples = [
    '$ tj add Hello World',
    '$ tj add "Hello World" -p test -p greeting -c test --due 2020-12-24',
    '$ tj add Hello World -p test -D t1 -D t2',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)"
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
    deps: flags.string({
      char: "D",
      description: "dependencies (use #)",
      multiple: true
    }),
    due: flags.string({
      char: "d",
      description: "due date"
    }),
    "no-workspace": flags.boolean({
      description: "ignore workspace settings temporarily"
    })
  }

  static strict = false;

  static args = [{
    name: "TEXT",
    required: true,
    description: "text of the task"
  }];

  async run() {
    const { argv, flags } = this.parse(Add);

    const taskJson = readTaskJson();
    const workspace = flags["no-workspace"] ? {} : readWorkspace();

    const text = argv.join(" ");
    const date = new Date().toISOString();
    const due = flags.due && parseDate(flags.due);

    let deps: string[] | undefined = undefined;
    if (flags.deps)
      deps = numberToId(taskJson, flags.deps);

    // use workpsace's values if not specified
    const task: Task = {
      id: uuidv4(),
      text,
      priority: flags.priority,
      contexts: flags.contexts ?? workspace.contexts,
      projects: flags.projects ?? workspace.projects,
      deps,
      due,
      start: date,
      modified: date
    };

    taskJson.todo.push(task);
    writeTaskJson(taskJson);

    this.log(`Task t${taskJson.todo.length} added: ${text}`);
  }
}
