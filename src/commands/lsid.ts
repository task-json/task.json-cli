import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import { TaskType } from "task.json";
import * as _ from "lodash";

export default class ListProj extends Command {
  static description = 'List IDs'

  static examples = [
    `$ td lsid`,
    `$ td lsid -D`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    done: flags.boolean({
      char: "D",
      description: "list IDs of only done tasks"
    })
  }

  async run() {
    const { flags } = this.parse(ListProj);

    const type: TaskType = flags.done ? "done" : "todo";
    const taskJson = readTaskJson();
    const size = taskJson[type].length;

    this.log(_.range(1, size + 1).join("\n"));
  }
}
