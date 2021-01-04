# todo.json-cli

[![Version](https://img.shields.io/npm/v/todo.json-cli.svg)](https://npmjs.org/package/todo.json-cli)
[![Downloads/week](https://img.shields.io/npm/dw/todo.json-cli.svg)](https://npmjs.org/package/todo.json-cli)
[![License](https://img.shields.io/npm/l/todo.json-cli.svg)](https://github.com/DCsunset/todo.json-cli/blob/master/package.json)

Command line todo management app for [todo.json](https://github.com/DCsunset/todo.json).


## Installation

```
npm i -g todo.json-cli
```

## Usage
<!-- usage -->
```sh-session
$ npm install -g todo.json-cli
$ td COMMAND
running command...
$ td (-v|--version|version)
todo.json-cli/2.3.0 linux-x64 node-v15.5.0
$ td --help [COMMAND]
USAGE
  $ td COMMAND
...
```
<!-- usagestop -->


## Autocomplete

### zsh

To install the autocompletion function,
copy the `autocompletion/_td` file to any directory of zsh functions (i.e. path in `$fpath` variable) and reopen zsh.


## Commands
<!-- commands -->
* [`td add [TEXT]`](#td-add-text)
* [`td do [ID...]`](#td-do-id)
* [`td help [COMMAND]`](#td-help-command)
* [`td ls`](#td-ls)
* [`td lsctx`](#td-lsctx)
* [`td lsid`](#td-lsid)
* [`td lsproj`](#td-lsproj)
* [`td modify [ID...]`](#td-modify-id)
* [`td restore`](#td-restore)
* [`td rm [ID...]`](#td-rm-id)
* [`td undo [ID...]`](#td-undo-id)

## `td add [TEXT]`

Add a new task

```
USAGE
  $ td add [TEXT]

OPTIONS
  -P, --priority=priority  priority (A-Z)
  -c, --context=context    one or more contexts
  -d, --due=due            due date
  -h, --help               show CLI help
  -p, --project=project    one or more projects

EXAMPLES
  $ td add Hello World
  $ td add "Hello World" -p test -p greeting -c test --due 2020-12-24
```

_See code: [src/commands/add.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/add.ts)_

## `td do [ID...]`

Mark tasks as done

```
USAGE
  $ td do [ID...]

ARGUMENTS
  ID...  mark specific tasks as done

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ td done 1
```

_See code: [src/commands/do.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/do.ts)_

## `td help [COMMAND]`

display help for td

```
USAGE
  $ td help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `td ls`

List tasks

```
USAGE
  $ td ls

OPTIONS
  -D, --done               list only done tasks
  -P, --priority=priority  priority (A-Z)
  -a, --all                list all tasks including done ones
  -c, --context=context    filter tasks by specific contexts
  -h, --help               show CLI help
  -p, --project=project    filter tasks by specific projects
  --and-contexts           filter contexts using AND operator instead of OR
  --and-projects           filter projects using AND operator instead of OR
  --without-contexts       list tasks without contexts
  --without-projects       list tasks without projects

EXAMPLES
  $ td ls
  $ td ls -p test
```

_See code: [src/commands/ls.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/ls.ts)_

## `td lsctx`

List contexts

```
USAGE
  $ td lsctx

OPTIONS
  -D, --done  list contexts of only done tasks
  -a, --all   list contexts of all tasks including done ones
  -h, --help  show CLI help

EXAMPLES
  $ td lsctx
  $ td lsctx -a
```

_See code: [src/commands/lsctx.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/lsctx.ts)_

## `td lsid`

List IDs

```
USAGE
  $ td lsid

OPTIONS
  -D, --done  list IDs of only done tasks
  -h, --help  show CLI help

EXAMPLES
  $ td lsid
  $ td lsid -D
```

_See code: [src/commands/lsid.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/lsid.ts)_

## `td lsproj`

List projects

```
USAGE
  $ td lsproj

OPTIONS
  -D, --done  list projects of only done tasks
  -a, --all   list projects of all tasks including done ones
  -h, --help  show CLI help

EXAMPLES
  $ td lsproj
  $ td lsproj -a
```

_See code: [src/commands/lsproj.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/lsproj.ts)_

## `td modify [ID...]`

Modify tasks

```
USAGE
  $ td modify [ID...]

ARGUMENTS
  ID...  modify specific tasks

OPTIONS
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
  --done                   modify done tasks

EXAMPLES
  $ td modify 1 --due 2020-12-12
  $ td modify 2 3 -p projA -p projB
  $ td modify 1 --text "New description" --done
```

_See code: [src/commands/modify.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/modify.ts)_

## `td restore`

Undo the last modification in todo.json/done.json using the bak file

```
USAGE
  $ td restore

OPTIONS
  -d, --done   restore done.json
  -f, --force  force overwriting without confirmation
  -h, --help   show CLI help

EXAMPLES
  $ todo restore
  $ todo restore -f --done
```

_See code: [src/commands/restore.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/restore.ts)_

## `td rm [ID...]`

Delete tasks

```
USAGE
  $ td rm [ID...]

ARGUMENTS
  ID...  delete specific tasks

OPTIONS
  -d, --done  delete done tasks
  -h, --help  show CLI help

EXAMPLE
  $ todo rm 1
```

_See code: [src/commands/rm.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/rm.ts)_

## `td undo [ID...]`

Undo tasks

```
USAGE
  $ td undo [ID...]

ARGUMENTS
  ID...  undo specific done tasks

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ todo undo 1 2
```

_See code: [src/commands/undo.ts](https://github.com/DCsunset/todo.json-cli/blob/v2.3.0/src/commands/undo.ts)_
<!-- commandsstop -->
