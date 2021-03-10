import {Command, flags} from '@oclif/command'
import { readConfig, Config, writeConfig } from "../utils/config";

export default class ConfigCommand extends Command {
  static description = "Modify or show config";

  static examples = [
    `$ tj config  # show config`,
    `$ tj config --server "http://localhost:3000"  # set config`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    server: flags.string({
      char: "s",
      description: "set server address"
    }),
    token: flags.string({
      char: "t",
      description: "set token for login"
    }),
    reset: flags.boolean({
      char: "r",
      description: "reset all configurations"
    })
  };

  async run() {
    const { flags } = this.parse(ConfigCommand);
    const config = readConfig();
    let showConfig = true;

    let newConfig: Config | null = config;

    if (flags.server) {
      showConfig = false;
      newConfig = {
        ...newConfig,
        server: flags.server
      };
    }
    if (flags.token) {
      showConfig = false;
      newConfig = {
        ...newConfig,
        token: flags.token
      };
    }
    if (flags.reset) {
      showConfig = false;
      newConfig = null;
    }

    if (showConfig) {
      for (const [key, value] of Object.entries(config)) {
        this.log(`${key}: ${value}`);
      }
    }
    else {
      writeConfig(newConfig);
    }
  }
}
