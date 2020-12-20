todo.json-cli
=============



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/todo.json-cli.svg)](https://npmjs.org/package/todo.json-cli)
[![Downloads/week](https://img.shields.io/npm/dw/todo.json-cli.svg)](https://npmjs.org/package/todo.json-cli)
[![License](https://img.shields.io/npm/l/todo.json-cli.svg)](https://github.com/DCsunset/todo.json-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g todo.json-cli
$ todo COMMAND
running command...
$ todo (-v|--version|version)
todo.json-cli/0.1.0 linux-x64 node-v15.4.0
$ todo --help [COMMAND]
USAGE
  $ todo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`todo hello [FILE]`](#todo-hello-file)
* [`todo help [COMMAND]`](#todo-help-command)

## `todo hello [FILE]`

describe the command here

```
USAGE
  $ todo hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ todo hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/hello.ts)_

## `todo help [COMMAND]`

display help for todo

```
USAGE
  $ todo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_
<!-- commandsstop -->
