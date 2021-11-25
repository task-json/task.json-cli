import {Command, flags} from '@oclif/command'
import { normalizeTypes } from "../utils/task";
import * as _ from "lodash";
import { readData } from '../utils/config';

export default class ListNum extends Command {
  static description = 'List Numbers'

  static examples = [
    `$ tj lsnum`,
    `$ tj lsnum -T all`,
    `$ tj lsnum -T done`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    types: flags.string({
      char: "T",
      description: "list numbers of tasks of types (todo, done, removed, all)",
      default: ["todo"],
      options: ["todo", "done", "removed", "all"],
      multiple: true
    })
  }

  async run() {
    const { flags } = this.parse(ListNum);

    const types = normalizeTypes(flags.types);
    const taskJson = readData("task");

    const nums: string[] = [];
    for (const type of types) {
      const size = taskJson[type].length;
      nums.push(..._.range(1, size+1).map(n => `${type.charAt(0)}${n}`));
    }

    this.log(nums.join("\n"));
  }
}
