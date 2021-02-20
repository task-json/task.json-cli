import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import { TaskType } from "task.json";
import * as _ from "lodash";

export default class ListProj extends Command {
  static description = 'List IDs'

  static examples = [
    `$ tj lsid`,
    `$ tj lsid -D`,
    `$ tj lsid -R`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list IDs of only done tasks"
    }),
    removed: flags.boolean({
      char: "R",
      description: "list IDs of only removed tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);

    const type: TaskType = flags.done
			? "done" : (flags.removed
			? "removed" : "todo");
    const taskJson = readTaskJson();
    const size = taskJson[type].length;

    this.log(_.range(1, size + 1).join("\n"));
  }
}
