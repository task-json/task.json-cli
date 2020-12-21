import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import { readTodo } from "../utils/task";
import { readConfig } from "../utils/config";
import { table } from "table";

export default class List extends Command {
  static description = 'List tasks'

  static examples = [
    `$ todo ls`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    priority: flags.string({
      char: "P",
      description: "priority (A-Z)"
    }),
    projects: flags.string({
      char: "p",
      description: "one or more projects",
      multiple: true
    }),
    contexts: flags.string({
      char: "c",
      description: "one or more contexts",
      multiple: true
    }),
  }

  static args = [{
    name: "text"
  }]

  async run() {
    const { args, flags } = this.parse(List);
    const { dataPath } = readConfig();

    if (!fs.existsSync(dataPath)) {
      this.log("todo.json does not exist.")
      return;
    }

    // Read Todo
    const tasks = readTodo(dataPath);

    const data = [
      // Head
      ["Pri", "Text", "Projects", "Contexts"]
    ];
    const output = table(data.concat(tasks.map(task => ([
      task.priority,
      task.text,
      task.projects.join(","),
      task.contexts.join(",")
    ]))), {
      drawHorizontalLine: index => index === 1,
      border: {
        bodyLeft: "",
        bodyRight: "",
        bodyJoin: " ",

        joinLeft: "",
        joinRight: "",
        joinJoin: "─"
      }
    });

    this.log(`\n${output}`);
  }
}
