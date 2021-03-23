import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import { TaskType } from "task.json";
import * as _ from "lodash";

export default class ListNum extends Command {
  static description = 'List Numbers'

  static examples = [
    `$ tj lsnum`,
    `$ tj lsnum -D`,
    `$ tj lsnum -R`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list numbers of only done tasks"
    }),
    removed: flags.boolean({
      char: "R",
      description: "list numbers of only removed tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListNum);

    const type: TaskType = flags.done
			? "done" : (flags.removed
			? "removed" : "todo");
    const taskJson = readTaskJson();
    const size = taskJson[type].length;

    this.log(_.range(1, size + 1).join("\n"));
  }
}
