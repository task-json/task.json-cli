import { Command, flags } from '@oclif/command'
import { Task, TaskType } from "task.json";
import { v4 as uuidv4 } from "uuid";
import { numberToId, parseNumbers, readTaskJson, writeTaskJson } from "../utils/task";
import { readConfig } from "../utils/config";
import { parseDate } from '../utils/date';

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
      description: "Dependencies (use #)",
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
  }];

  async run() {
    const { argv, flags } = this.parse(Add);

    // Create rootPath if not exists
    readConfig();
    const taskJson = readTaskJson();

    const text = argv.join(" ");
    const date = new Date().toISOString();
    const due = flags.due && parseDate(flags.due);

    let deps: string[] | undefined = undefined;
    if (flags.deps)
      deps = numberToId(taskJson, flags.deps);

    const task: Task = {
      id: uuidv4(),
      text,
      priority: flags.priority,
      contexts: flags.contexts,
      projects: flags.projects,
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
