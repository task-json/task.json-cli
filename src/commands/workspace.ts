import {Command, flags} from '@oclif/command'
import { Config } from '@oclif/config';
import { readWorkspace, Workspace, writeWorkspace } from '../utils/workspace';

export default class WorkspaceCommand extends Command {
  static description = 'Set workspace';

  static examples = [
    `$ tj workspace -c ctxA`,
    `$ tj workspace -c ctxA -c ctxB -p projA`,
    `$ tj workspace -p ""  # set projects to empty`,
    `$ tj workspace -r projects  # reset projects to empty`,
    `$ tj workspace -r all # reset both ctx and proj to empty`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    projects: flags.string({
      char: "p",
      description: "set current projects (auto filter and set projects for other commands [add, ls] if not specified. empty to reset)",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "set current contexts (auto filter and set contexts for other commands [add, ls] if not specified. empty to reset)",
      multiple: true
    }),
    reset: flags.string({
      char: "r",
      description: "reset fields (projects, contexts, all) to empty",
      options: ["contexts", "projects", "all"],
      multiple: true
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
        newWorkspace = {
          ...newWorkspace,
          [key]: value
        };
      }
    }

    if (flags.reset) {
      showWorkspace = false;
      const fields: (keyof Workspace)[] = ["projects", "contexts"];
      for (const field of fields) {
        if (flags.reset.includes(field))
          delete newWorkspace[field];
      }
      if (flags.reset.includes("all"))
        newWorkspace = null;
    }

    if (showWorkspace) {
      for (const [key, value] of Object.entries(workspace)) {
        if (Array.isArray(value)) {
          this.log(`${key}: ${value.map(v => v.length ? v : '""').join(", ")}`);
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
