# task.json-cli

[![Version](https://img.shields.io/npm/v/task.json-cli.svg)](https://npmjs.org/package/task.json-cli)
[![License](https://img.shields.io/npm/l/task.json-cli.svg)](https://github.com/DCsunset/task.json-cli/blob/master/package.json)

Command line todo management app for [task.json](https://github.com/DCsunset/task.json) written in Node.js.


## Installation

```
npm i -g task.json-cli
```

## Usage
<!-- usage -->
```sh-session
$ npm install -g task.json-cli
$ tj COMMAND
running command...
$ tj (-v|--version|version)
task.json-cli/3.0.2 linux-x64 node-v15.7.0
$ tj --help [COMMAND]
USAGE
  $ tj COMMAND
...
```
<!-- usagestop -->

## Commands
<!-- commands -->
* [`tj add [TEXT]`](#tj-add-text)
* [`tj autocomplete DIR`](#tj-autocomplete-dir)
* [`tj do [ID...]`](#tj-do-id)
* [`tj help [COMMAND]`](#tj-help-command)
* [`tj ls`](#tj-ls)
* [`tj lsctx`](#tj-lsctx)
* [`tj lsid`](#tj-lsid)
* [`tj lsproj`](#tj-lsproj)
* [`tj modify [ID...]`](#tj-modify-id)
* [`tj restore`](#tj-restore)
* [`tj rm [ID...]`](#tj-rm-id)
* [`tj undo [ID...]`](#tj-undo-id)

## `tj add [TEXT]`

Add a new task

```
USAGE
  $ tj add [TEXT]

OPTIONS
  -P, --priority=priority  priority (A-Z)
  -c, --context=context    one or more contexts
  -d, --due=due            due date
  -h, --help               show CLI help
  -p, --project=project    one or more projects

EXAMPLES
  $ tj add Hello World
  $ tj add "Hello World" -p test -p greeting -c test --due 2020-12-24
```

_See code: [src/commands/add.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/add.ts)_

## `tj autocomplete DIR`

Install completion file

```
USAGE
  $ tj autocomplete DIR

ARGUMENTS
  DIR  Install completion files to specific directory

OPTIONS
  -h, --help  show CLI help
  --zsh       Install zsh completion

EXAMPLE
  $ tj autocomplete --zsh ~/.zsh_completion
```

_See code: [src/commands/autocomplete.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/autocomplete.ts)_

## `tj do [ID...]`

Mark tasks as done

```
USAGE
  $ tj do [ID...]

ARGUMENTS
  ID...  mark specific tasks as done

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ tj do 1
```

_See code: [src/commands/do.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/do.ts)_

## `tj help [COMMAND]`

display help for tj

```
USAGE
  $ tj help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `tj ls`

List tasks

```
USAGE
  $ tj ls

OPTIONS
  -D, --done               list only done tasks
  -P, --priority=priority  priority (A-Z)
  -c, --context=context    filter tasks by specific contexts
  -h, --help               show CLI help
  -p, --project=project    filter tasks by specific projects
  --and-contexts           filter contexts using AND operator instead of OR
  --and-projects           filter projects using AND operator instead of OR
  --without-contexts       list tasks without contexts
  --without-projects       list tasks without projects

EXAMPLES
  $ tj ls
  $ tj ls -p test
```

_See code: [src/commands/ls.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/ls.ts)_

## `tj lsctx`

List contexts

```
USAGE
  $ tj lsctx

OPTIONS
  -D, --done  list contexts of only done tasks
  -a, --all   list contexts of all tasks including done ones
  -h, --help  show CLI help

EXAMPLES
  $ tj lsctx
  $ tj lsctx -a
```

_See code: [src/commands/lsctx.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/lsctx.ts)_

## `tj lsid`

List IDs

```
USAGE
  $ tj lsid

OPTIONS
  -D, --done  list IDs of only done tasks
  -h, --help  show CLI help

EXAMPLES
  $ tj lsid
  $ tj lsid -D
```

_See code: [src/commands/lsid.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/lsid.ts)_

## `tj lsproj`

List projects

```
USAGE
  $ tj lsproj

OPTIONS
  -D, --done  list projects of only done tasks
  -a, --all   list projects of all tasks including done ones
  -h, --help  show CLI help

EXAMPLES
  $ tj lsproj
  $ tj lsproj -a
```

_See code: [src/commands/lsproj.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/lsproj.ts)_

## `tj modify [ID...]`

Modify tasks

```
USAGE
  $ tj modify [ID...]

ARGUMENTS
  ID...  modify specific tasks

OPTIONS
  -D, --done               modify done tasks
  -P, --priority=priority  modify priority
  -c, --context=context    modify contexts
  -d, --due=due            modify due date
  -h, --help               show CLI help
  -p, --project=project    modify projects
  -t, --text=text          modify text
  --delete-contexts        delete contexts
  --delete-due             delete due date
  --delete-priority        delete priority
  --delete-projects        delete projects

EXAMPLES
  $ tj modify 1 --due 2020-12-12
  $ tj modify 2 3 -p projA -p projB
  $ tj modify 1 --text "New description" --done
```

_See code: [src/commands/modify.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/modify.ts)_

## `tj restore`

Undo the last modification using the bak file

```
USAGE
  $ tj restore

OPTIONS
  -D, --done   restore done.json
  -f, --force  force overwriting without confirmation
  -h, --help   show CLI help

EXAMPLES
  $ tj restore
  $ tj restore -f --done
```

_See code: [src/commands/restore.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/restore.ts)_

## `tj rm [ID...]`

Delete tasks

```
USAGE
  $ tj rm [ID...]

ARGUMENTS
  ID...  delete specific tasks

OPTIONS
  -D, --done  delete done tasks
  -h, --help  show CLI help

EXAMPLE
  $ tj rm 1
```

_See code: [src/commands/rm.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/rm.ts)_

## `tj undo [ID...]`

Undo tasks

```
USAGE
  $ tj undo [ID...]

ARGUMENTS
  ID...  undo specific done tasks

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ tj undo 1 2
```

_See code: [src/commands/undo.ts](https://github.com/DCsunset/task.json-cli/blob/v3.0.2/src/commands/undo.ts)_
<!-- commandsstop -->
