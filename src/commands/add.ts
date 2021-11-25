import { Command, flags } from '@oclif/command'
import { Task } from "task.json";
import { v4 as uuidv4 } from "uuid";
import { numberToId, readTaskJson, writeTaskJson } from "../utils/task";
import { parseDate } from '../utils/date';
import { readWorkspace } from '../utils/workspace';
import { DateTime } from 'luxon';

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
    const date = DateTime.now().toISO();
    const due = flags.due && parseDate(flags.due);

    let deps: string[] | undefined = undefined;
    if (flags.deps)
      deps = numberToId(taskJson, flags.deps);
    
    // Make sure no name start with !
    flags.projects?.forEach(v => {
      if (v.startsWith("!"))
        this.error(`Project cannot start with !: ${v}`);
    })
    flags.contexts?.forEach(v => {
      if (v.startsWith("!"))
        this.error(`Context cannot start with !: ${v}`);
    })

    // Remove empty values
    const projects = (flags.projects ??
      workspace.projects?.filter(v => !v.startsWith("!"))
    )?.filter(v => v !== "");
    const contexts = (flags.contexts ??
      workspace.contexts?.filter(v => !v.startsWith("!"))
    )?.filter(v => v !== "");

    // use workpsace's values if not specified
    const task: Task = {
      id: uuidv4(),
      text,
      priority: flags.priority,
      contexts: contexts?.length ? contexts : undefined,
      projects: projects?.length ? projects : undefined,
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
