import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import { TaskType } from "task.json";

export default class ListCtx extends Command {
  static description = 'List contexts'

  static examples = [
    `$ td lsctx`,
    `$ td lsctx -a`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({
      char: "a",
      description: "list contexts of all tasks including done ones"
    }),
    done: flags.boolean({
      char: "D",
      description: "list contexts of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListCtx);

    const contexts: Set<string> = new Set();
    const types: TaskType[] = flags.all ? ["todo", "done"] : (flags.done ? ["done"] : ["todo"]);
    const taskJson = readTaskJson();

    for (const type of types)
      for (const task of taskJson[type])
        task.contexts?.forEach(c => contexts.add(c));

    this.log([...contexts].join("\n"));
  }
}
