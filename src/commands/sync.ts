import {Command, flags} from '@oclif/command'
import { readConfig } from "../utils/config";
import { Client, HttpError } from "task.json-client";
import { readTaskJson, writeTaskJson } from '../utils/task';
import cli from "cli-ux";

export default class Sync extends Command {
  static description = "Sync local task.json with server";

  static examples = [
    `$ tj sync`,
    `$ tj sync --upload`,
    `$ tj sync --download --force`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    upload: flags.boolean({
      char: "u",
      description: "upload local task.json to overwrite the one on server"
    }),
    download: flags.boolean({
      char: "d",
      description: "download task.json from server to overwrite the local one"
    }),
    force: flags.boolean({
      char: "f",
      description: "overwrite without confirmation"
    })
  };

  async run() {
    const { flags } = this.parse(Sync);
    const config = readConfig();
    let taskJson = readTaskJson();

    if (!config.server) {
      this.error("Use `tj config --server <address>` to set server address");
    }
    if (!config.token) {
      this.error("Use `tj login` to log into server");
    }

    const client = new Client(config.server, config.token);
    try {
      if (flags.upload) {
        if (!flags.force) {
          const resp = await cli.confirm("This will overwrite task.json on the server. Continue? [y/n]");
          if (!resp)
            return;
        }
        await client.upload(taskJson);
      }
      else if (flags.download) {
        if (!flags.force) {
          const resp = await cli.confirm("This will overwrite local task.json. Continue? [y/n]");
          if (!resp)
            return;
        }
        taskJson = await client.download();
      }
      else {
        taskJson = await client.sync(taskJson);
      }
    }
    catch (error) {
      const err = error as HttpError;
      this.error(`${err.status}: ${err.message}`);
    }

    writeTaskJson(taskJson);
    this.log("Sync with server successfully.")
  }
}
