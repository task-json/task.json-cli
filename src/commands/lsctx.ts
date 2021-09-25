import {Command, flags} from '@oclif/command'
import { normalizeTypes, readTaskJson } from "../utils/task";

export default class ListCtx extends Command {
  static description = 'List contexts'

  static examples = [
    `$ tj lsctx`,
    `$ tj lsctx -T all`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    types: flags.string({
      char: "T",
      description: "list contexts of tasks of types (todo, done, removed, all) [default: todo]",
      default: ["todo"],
      multiple: true
    })
  }

  async run() {
    const { flags } = this.parse(ListCtx);

    const contexts: Set<string> = new Set();
    const types = normalizeTypes(flags.types);
    const taskJson = readTaskJson();

    for (const type of types)
      for (const task of taskJson[type])
        task.contexts?.forEach(c => contexts.add(c));

    this.log([...contexts].join("\n"));
  }
}
