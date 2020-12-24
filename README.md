todo.json-cli
=============

Command line todo management app for todo.json


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
* [`todo add TEXT`](#todo-add-text)
* [`todo autocomplete [SHELL]`](#todo-autocomplete-shell)
* [`todo do [ID...]`](#todo-do-id)
* [`todo help [COMMAND]`](#todo-help-command)
* [`todo ls`](#todo-ls)
* [`todo restore`](#todo-restore)
* [`todo rm [ID...]`](#todo-rm-id)
* [`todo undo [ID...]`](#todo-undo-id)

## `todo add TEXT`

Add a new task

```
USAGE
  $ todo add TEXT

OPTIONS
  -P, --priority=priority  priority (A-Z)
  -c, --contexts=contexts  one or more contexts
  -d, --due=due            due date
  -h, --help               show CLI help
  -p, --projects=projects  one or more projects

EXAMPLES
  $ todo add Hello World
  $ todo add "Hello World" -p test first-task -c test --due 2020-12-24
```

_See code: [src/commands/add.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/add.ts)_

## `todo autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ todo autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ todo autocomplete
  $ todo autocomplete bash
  $ todo autocomplete zsh
  $ todo autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `todo do [ID...]`

Mark tasks as done

```
USAGE
  $ todo do [ID...]

ARGUMENTS
  ID...  mark specific tasks as done

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ todo done 1
```

_See code: [src/commands/do.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/do.ts)_

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

## `todo ls`

List tasks

```
USAGE
  $ todo ls

OPTIONS
  -P, --priority=priority  priority (A-Z)
  -a, --all                list all tasks including done ones
  -c, --contexts=contexts  one or more contexts
  -d, --done               list only done tasks
  -h, --help               show CLI help
  -p, --projects=projects  one or more projects

EXAMPLE
  $ todo ls
```

_See code: [src/commands/ls.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/ls.ts)_

## `todo restore`

Undo the last modification in todo.json/done.json using the bak file

```
USAGE
  $ todo restore

OPTIONS
  -d, --done   restore done.json
  -f, --force  force overwriting without confirmation
  -h, --help   show CLI help

EXAMPLES
  $ todo restore
  $ todo restore -f --done
```

_See code: [src/commands/restore.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/restore.ts)_

## `todo rm [ID...]`

Delete tasks

```
USAGE
  $ todo rm [ID...]

ARGUMENTS
  ID...  delete specific tasks

OPTIONS
  -d, --done  delete done tasks
  -h, --help  show CLI help

EXAMPLE
  $ todo rm 1
```

_See code: [src/commands/rm.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/rm.ts)_

## `todo undo [ID...]`

Undo tasks

```
USAGE
  $ todo undo [ID...]

ARGUMENTS
  ID...  undo specific done tasks

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ todo undo 1 2
```

_See code: [src/commands/undo.ts](https://github.com/DCsunset/todo.json-cli/blob/v0.1.0/src/commands/undo.ts)_
<!-- commandsstop -->
