import {Command, flags} from '@oclif/command'
import { normalizeTypes, readTaskJson } from "../utils/task";

export default class ListProj extends Command {
  static description = 'List projects'

  static examples = [
    `$ tj lsproj`,
    `$ tj lsproj -T all`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    types: flags.string({
      char: "T",
      description: "list projects of tasks of types (todo, done, removed, all) [default: todo]",
      default: ["todo"],
      multiple: true
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);

    const projects: Set<string> = new Set();
    const types = normalizeTypes(flags.types);
    const taskJson = readTaskJson();

    for (const type of types)
      for (const task of taskJson[type])
        task.projects?.forEach(p => projects.add(p));

    this.log([...projects].join("\n"));
  }
}
