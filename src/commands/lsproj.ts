import {Command, flags} from '@oclif/command'
import { readData } from '../utils/config';
import { normalizeTypes } from "../utils/task";

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
      description: "list projects of tasks of types (todo, done, removed, all)",
      default: ["todo"],
      options: ["todo", "done", "removed", "all"],
      multiple: true
    }),
    negative: flags.boolean({
      char: "n",
      description: "include negative representation (! symbol before projects)",
      default: false
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);

    const projects: Set<string> = new Set();
    const types = normalizeTypes(flags.types);
    const taskJson = readData("task");

    for (const type of types)
      for (const task of taskJson[type])
        task.projects?.forEach(p => {
          projects.add(p);
          if (flags.negative)
            projects.add(`!${p}`);
        });

    this.log([...projects].join("\n"));
  }
}
