import {Command, flags} from '@oclif/command'

export default class Add extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ todo add "Hello world" -p hello world -c test
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
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
    const { args, flags } = this.parse(Add);

    this.log(`text: ${args.text} projects: ${JSON.stringify(flags.projects)}`);
  }
}
