import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import * as path from "path";
import { pathConfig } from "../utils/config";
import cli from "cli-ux";

export default class Restore extends Command {
  static description = 'Undo the last modification using the bak file';

  static examples = [
    `$ tj restore`,
    `$ tj restore -f`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({
      char: "f",
      description: "force overwriting without confirmation",
      default: false
    })
  };

  // Allow multiple arguments
  static strict = false;

  async run() {
    const { flags } = this.parse(Restore);

    const dataPath = path.join(pathConfig.root, pathConfig["task"]);
    const bakPath = dataPath + ".bak";

    if (!fs.existsSync(bakPath)) {
      this.error("task.json.bak does not exist.");
    }

    let res = true;
    if (!flags.force || fs.existsSync(dataPath)) {
      res = await cli.confirm(`The file ${dataPath} will be overwritten irreversibly. Continue? [y/n]`);
    }

    if (res) {
      fs.renameSync(bakPath, dataPath);
      this.log(`Successfully restored`);
    }
  }
}
