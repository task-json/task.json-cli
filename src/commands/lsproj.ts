import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import { TaskType } from "task.json";

export default class ListProj extends Command {
  static description = 'List projects'

  static examples = [
    `$ tj lsproj`,
    `$ tj lsproj -a`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list projects of all tasks including done ones"
    }),
    done: flags.boolean({
      char: "D",
      description: "list projects of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);

    const projects: Set<string> = new Set();
    const types: TaskType[] = flags.all ? ["todo", "done"] : (flags.done ? ["done"] : ["todo"]);
    const taskJson = readTaskJson();

    for (const type of types)
      for (const task of taskJson[type])
        task.projects?.forEach(p => projects.add(p));

    this.log([...projects].join("\n"));
  }
}
