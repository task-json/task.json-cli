import {Command, flags} from '@oclif/command'
import { readConfig, Config, writeConfig } from "../utils/config";

export default class ConfigCommand extends Command {
  static description = "Modify or show config";

  static examples = [
    `$ tj config  # show config`,
    `$ tj config --reset  # reset all config`,
    `$ tj config --server "http://localhost:3000"  # set config`,
    `$ tj config --server ""  # reset server`
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
    const configKeys: (keyof Config)[] = ["server", "token"];

    for (const key of configKeys) {
      const value = flags[key];
      if (value !== undefined) {
        showConfig = false;
        if (value.length > 0) {
          newConfig = {
            ...newConfig,
            [key]: value
          };
        }
        else {
          delete newConfig[key];
        }
      }
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
