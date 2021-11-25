import {Command, flags} from '@oclif/command'
import { Client, HttpError } from "task.json-client";
import { stringifyDiffStat } from '../utils/task';
import cli from "cli-ux";
import { readData, writeData } from '../utils/config';

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
    const config = readData("config");
    const taskJson = readData("task");

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
        writeData("task", await client.download());
      }
      else {
				const { data, stat } = await client.sync(taskJson);
        writeData("task", data);
				this.log(`[Client] ${stringifyDiffStat(stat.client)}`);
				this.log(`[Server] ${stringifyDiffStat(stat.server)}`);
      }
      this.log("Sync with server successfully.")
    }
    catch (error) {
      const err = error as HttpError;
      this.error(`${err.status}: ${err.message}`);
    }
  }
}
