import {Command, flags} from '@oclif/command'
import { Config } from '@oclif/config';
import { readWorkspace, Workspace, writeWorkspace } from '../utils/workspace';

export default class WorkspaceCommand extends Command {
  static description = 'Set workspace';

  static examples = [
    `$ tj workspace -c ctxA`,
    `$ tj workspace -c ctxA -c ctxB -p projA`,
    `$ tj workspace -r  # reset workspace to empty`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    projects: flags.string({
      char: "p",
      description: "set current projects (auto filter and set projects for other commands [add, ls] if not specified)",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "set current contexts (auto filter and set contexts for other commands [add, ls] not specified)",
      multiple: true
    }),
    reset: flags.boolean({
      char: "r",
      description: "reset workspace (to empty)"
    })
  };

  async run() {
    const { flags } = this.parse(WorkspaceCommand);
    const workspace = readWorkspace();
    let showWorkspace = true;

    let newWorkspace: Workspace | null = workspace;
    const keys: (keyof Workspace)[] = ["projects", "contexts"];

    for (const key of keys) {
      const value = flags[key];
      if (value !== undefined) {
        showWorkspace = false;
        if (value.length > 0) {
          newWorkspace = {
            ...newWorkspace,
            [key]: value
          };
        }
        else {
          delete newWorkspace[key];
        }
      }
    }

    if (flags.reset) {
      showWorkspace = false;
      newWorkspace = null;
    }

    if (showWorkspace) {
      for (const [key, value] of Object.entries(workspace)) {
        if (Array.isArray(value)) {
          this.log(`${key}: ${value.join(", ")}`);
        }
        else {
          this.log(`${key}: ${value}`);
        }
      }
    }
    else {
      writeWorkspace(newWorkspace);
    }
  }
}
