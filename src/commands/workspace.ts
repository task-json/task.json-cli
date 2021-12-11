import {Command, flags} from '@oclif/command'
import { readData, writeData } from '../utils/config';
import { Workspace } from "../utils/types";

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
    "and-projects": flags.boolean({
      description: "filter projects using AND operator instead of OR"
    }),
    "and-contexts": flags.boolean({
      description: "filter contexts using AND operator instead of OR"
    }),
    reset: flags.string({
      char: "r",
      description: "reset fields (projects, contexts, all) to empty",
      options: ["contexts", "projects", "all", "and-projects", "and-contexts"],
      multiple: true
    })
  };

  async run() {
    const { flags } = this.parse(WorkspaceCommand);
    const workspace = readData("workspace");
    let showWorkspace = true;

    let newWorkspace: Workspace | null = workspace;
    const keys: (keyof Workspace)[] = ["projects", "contexts", "and-projects", "and-contexts"];

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
      for (const key of keys) {
        if (flags.reset.includes(key))
          delete newWorkspace[key];
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
      writeData("workspace", newWorkspace);
    }
  }
}
