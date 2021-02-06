import { Command, flags } from '@oclif/command'
import { Task } from "task.json";
import { v4 as uuidv4 } from "uuid";
import { readTaskJson, writeTaskJson } from "../utils/task";
import { readConfig } from "../utils/config";

export default class Add extends Command {
  static description = 'Add a new task'

  static examples = [
    '$ td add Hello World',
    '$ td add "Hello World" -p test -p greeting -c test --due 2020-12-24',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)"
    }),
    project: flags.string({
      char: "p",
      description: "one or more projects",
      multiple: true
    }),
    context: flags.string({
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
  }];

  async run() {
    const { argv, flags } = this.parse(Add);

    // Create rootPath if not exists
    readConfig();

    const text = argv.join(" ");
    const date = new Date().toISOString();

    // TODO: add date validation
    const task: Task = {
      uuid: uuidv4(),
      text,
      priority: flags.priority,
      contexts: flags.context,
      projects: flags.project,
      due: flags.due,
      start: date,
      modified: date
    };

    const taskJson = readTaskJson();
    taskJson.todo.push(task);
    writeTaskJson(taskJson);

    this.log(`Task ${taskJson.todo.length} added: ${text}`);
  }
}
