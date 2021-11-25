import {Command, flags} from '@oclif/command'
import { Client, HttpError } from "task.json-client";
import cli from "cli-ux";
import { readData, writeData } from '../utils/config';

export default class Login extends Command {
  static description = "Log into the server";

  static examples = [
    `$ tj login  # interactive input the password`,
    `$ tj login --password "xxx"  # log in with password`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    password: flags.string({
      char: "p",
      description: "log in with password"
    })
  };

  async run() {
    const { flags } = this.parse(Login);
    const config = readData("config");

    if (!config.server) {
      this.error("Use `tj config --server <address>` to set server address");
    }

    let password: string;
    if (flags.password) {
      password = flags.password;
    }
    else {
      password = await cli.prompt("Input the password", { type: "hide" });
    }

    const client = new Client(config.server);
    try {
      await client.login(password);

      writeData("config", {
        ...config,
        token: client.token
      });
      this.log("Log in successfully.")
    }
    catch (error) {
      const err = error as HttpError;
      this.error(`${err.status}: ${err.message}`);
    }
  }
}
