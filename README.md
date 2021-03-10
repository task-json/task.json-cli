# task.json-cli

[![Version](https://img.shields.io/npm/v/task.json-cli.svg)](https://npmjs.org/package/task.json-cli)
[![License](https://img.shields.io/npm/l/task.json-cli.svg)](https://github.com/DCsunset/task.json-cli/blob/master/package.json)

Command line task management app for [task.json](https://github.com/DCsunset/task.json) written in Node.js.

## Screenshots

![Screenshot](Screenshot.png)

## Installation

```
npm i -g task.json-cli
```

## Environment Variables

* `TASK_JSON_PATH`: the path of task.json data (default: `$HOME/.task.json`)


## Usage
<!-- usage -->
```sh-session
$ npm install -g task.json-cli
$ tj COMMAND
running command...
$ tj (-v|--version|version)
task.json-cli/3.4.0 linux-x64 node-v15.10.0
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
* [`tj config`](#tj-config)
* [`tj do [ID...]`](#tj-do-id)
* [`tj help [COMMAND]`](#tj-help-command)
* [`tj login`](#tj-login)
* [`tj ls`](#tj-ls)
* [`tj lsctx`](#tj-lsctx)
* [`tj lsid`](#tj-lsid)
* [`tj lsproj`](#tj-lsproj)
* [`tj modify [ID...]`](#tj-modify-id)
* [`tj restore`](#tj-restore)
* [`tj rm [ID...]`](#tj-rm-id)
* [`tj sync`](#tj-sync)
* [`tj undo [ID...]`](#tj-undo-id)

## `tj add [TEXT]`

Add a new task

```
USAGE
  $ tj add [TEXT]

OPTIONS
  -P, --priority=priority  priority (A-Z)
  -c, --contexts=contexts  one or more contexts
  -d, --due=due            due date
  -h, --help               show CLI help
  -p, --projects=projects  one or more projects

EXAMPLES
  $ tj add Hello World
  $ tj add "Hello World" -p test -p greeting -c test --due 2020-12-24
```

_See code: [src/commands/add.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/add.ts)_

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

_See code: [src/commands/autocomplete.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/autocomplete.ts)_

## `tj config`

Modify or show config

```
USAGE
  $ tj config

OPTIONS
  -h, --help           show CLI help
  -r, --reset          reset all configurations
  -s, --server=server  set server address
  -t, --token=token    set token for login

EXAMPLES
  $ tj config  # show config
  $ tj config --server "http://localhost:3000"  # set config
```

_See code: [src/commands/config.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/config.ts)_

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

_See code: [src/commands/do.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/do.ts)_

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

## `tj login`

Log into the server

```
USAGE
  $ tj login

OPTIONS
  -h, --help               show CLI help
  -p, --password=password  log in with password

EXAMPLES
  $ tj login  # interactive input the password
  $ tj login --password "xxx"  # log in with password
```

_See code: [src/commands/login.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/login.ts)_

## `tj ls`

List tasks

```
USAGE
  $ tj ls

OPTIONS
  -D, --done                   list only done tasks
  -P, --priorities=priorities  filter tasks by priorities (A-Z)
  -R, --removed                list only removed tasks
  -c, --contexts=contexts      filter tasks by specific contexts
  -h, --help                   show CLI help
  -p, --projects=projects      filter tasks by specific projects
  --and-contexts               filter contexts using AND operator instead of OR
  --and-projects               filter projects using AND operator instead of OR
  --without-contexts           list tasks without contexts
  --without-priorities         list tasks without priorities
  --without-projects           list tasks without projects

EXAMPLES
  $ tj ls
  $ tj ls -p test
```

_See code: [src/commands/ls.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/ls.ts)_

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

_See code: [src/commands/lsctx.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/lsctx.ts)_

## `tj lsid`

List IDs

```
USAGE
  $ tj lsid

OPTIONS
  -D, --done     list IDs of only done tasks
  -R, --removed  list IDs of only removed tasks
  -h, --help     show CLI help

EXAMPLES
  $ tj lsid
  $ tj lsid -D
  $ tj lsid -R
```

_See code: [src/commands/lsid.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/lsid.ts)_

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

_See code: [src/commands/lsproj.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/lsproj.ts)_

## `tj modify [ID...]`

Modify tasks

```
USAGE
  $ tj modify [ID...]

ARGUMENTS
  ID...  modify specific tasks

OPTIONS
  -D, --done                       modify done tasks
  -P, --new-priority=new-priority  modify priority
  -P, --priorities=priorities      filter tasks by priority (A-Z)
  -c, --contexts=contexts          filter tasks by specific contexts
  -c, --new-contexts=new-contexts  modify contexts
  -d, --new-due=new-due            modify due date
  -h, --help                       show CLI help
  -p, --projects=projects          filter tasks by specific projects
  -t, --new-text=new-text          modify text
  --and-contexts                   filter contexts using AND operator instead of OR
  --and-projects                   filter projects using AND operator instead of OR
  --delete-contexts                delete contexts
  --delete-due                     delete due date
  --delete-priority                delete priority
  --delete-projects                delete projects
  --new-projects=new-projects      modify projects
  --without-contexts               list tasks without contexts
  --without-priorities             list tasks without priorities
  --without-projects               list tasks without projects

EXAMPLES
  $ tj modify 1 --due 2020-12-12
  $ tj modify 2 3 -p projA -p projB
  $ tj modify 1 --text "New description" --done
```

_See code: [src/commands/modify.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/modify.ts)_

## `tj restore`

Undo the last modification using the bak file

```
USAGE
  $ tj restore

OPTIONS
  -f, --force  force overwriting without confirmation
  -h, --help   show CLI help

EXAMPLES
  $ tj restore
  $ tj restore -f --done
```

_See code: [src/commands/restore.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/restore.ts)_

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

_See code: [src/commands/rm.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/rm.ts)_

## `tj sync`

Sync local task.json with server

```
USAGE
  $ tj sync

OPTIONS
  -d, --download  download task.json from server to overwrite the local one
  -f, --force     overwrite without confirmation
  -h, --help      show CLI help
  -u, --upload    upload local task.json to overwrite the one on server

EXAMPLES
  $ tj sync
  $ tj sync --upload
  $ tj sync --download --force
```

_See code: [src/commands/sync.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/sync.ts)_

## `tj undo [ID...]`

Undo tasks

```
USAGE
  $ tj undo [ID...]

ARGUMENTS
  ID...  undo specific done or removed tasks

OPTIONS
  -R, --removed  restore removed tasks
  -h, --help     show CLI help

EXAMPLES
  $ tj undo 1 2
  $ tj undo --removed 1 2
```

_See code: [src/commands/undo.ts](https://github.com/DCsunset/task.json-cli/blob/v3.4.0/src/commands/undo.ts)_
<!-- commandsstop -->
