import {Command, flags} from '@oclif/command'
import { readTaskJson } from "../utils/task";
import * as _ from "lodash";
import { DateTime } from 'luxon';
import { showDate } from '../utils/date';

export default class Due extends Command {
  static description = 'Show most recent due date'

  static examples = [
    `$ tj due`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    iso: flags.boolean({
      description: "show most recent due date in ISO format",
      default: false
    })
  }

  async run() {
    const { flags } = this.parse(Due);

    const taskJson = readTaskJson();
    let due: DateTime | null = null;
    for (const task of taskJson.todo) {
      if (task.due) {
        const date = DateTime.fromISO(task.due);
        if (due === null || date < due) {
          due = date;
        }
      }
    }

    if (due !== null) {
      if (flags.iso)
        console.log(due.toISO());
      else
        console.log(showDate(due));
    }
  }
}
