import {Command, flags} from '@oclif/command'
import { readConfig, Config, writeConfig } from "../utils/config";

export default class ConfigCommand extends Command {
  static description = "Modify or show config";

  static examples = [
    `$ tj config  # show config`,
    `$ tj config --server "http://localhost:3000"  # set config`,
    `$ tj config --reset all  # reset all config`,
    `$ tj config -r server -r token # reset server and token`
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
    reset: flags.string({
      char: "r",
      description: "reset configurations (server, token, all)",
      options: ["server", "token", "all"],
      multiple: true
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
        newConfig = {
          ...newConfig,
          [key]: value
        };
      }
    }

    if (flags.reset) {
      showConfig = false;
      const fields: (keyof Config)[] = ["server", "token"];
      for (const field of fields) {
        if (flags.reset.includes(field))
          delete newConfig[field];
      }
      if (flags.reset.includes("all"))
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
