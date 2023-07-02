# task.json-cli

[![Version](https://img.shields.io/npm/v/task.json-cli.svg)](https://npmjs.org/package/task.json-cli)
[![License](https://img.shields.io/npm/l/task.json-cli.svg)](https://github.com/DCsunset/task.json-cli/blob/master/package.json)

Command line task management app for [task.json](https://github.com/DCsunset/task.json) written in Node.js.

## Screenshots

![Screenshot](Screenshot.png)

## Features

* User-friendly command-line interface
* Highlighting for urgent tasks
* Filtering tasks by various field
* Sync with remote task.json-server (with end-to-end encryption support)
* Workspace support
* ZSH autocompletion

## Installation

```sh
npm i -g task.json-cli
```

## Usage

This section shows basic usage for tj.
For more detailed usage,
use `tj <command> --help` to show documentation for each command or subcommand.

### Basics

```sh
# add a task with a priority (A-Z)
tj add -t "Todo task 1" -P A
# with project and context
tj add -t "Todo task 1" -p proj -c ctx

# list tasks
tj ls
# list by a certain project or context
tj ls -c ctx
tj ls -p proj -c ctx

# finish task(s) by number(s)
tj do t1 t2
# remove task(s)
tj rm t1 d1
# restore removed task(s)
tj restore r1

# modify a task by number
tj modify t1 -t "Changed text" -c changed-ctx
# modify tasks in a project to a new project
tj modify --filter-proj proj1 -p new-proj
```

The number of task consists of a character and a numeric value,
which is used to conveniently modify a task.
The character decides the type of the task (`t` for todo, `d` for done, `r` for removed).
The number is different from the ID as it's based on the current number of tasks.

### Workspace

A workspace can apply certain filters without manually typing it every time.
This is convenient when you are working on a subset of all tasks.

```sh
# add workspace to show only proj1 and ctx2 and enable it
tj workspace add myworkspace -p proj1 -c ctx2 --enabled
# show existing workspaces
tj workspace show
# now filters in workspace auto applied
tj ls

# disable a workspace
tj workspace modify myworkspace --no-enabled
# enable another workspace
tj workspace modify anotherws --enabled
```

### Server synchronization

Task.json-cli supports synchronizing with a deployed [task.json-server](https://github.com/task-json/task.json-server).
It supports end-to-end encryption if a key is provided (the server won't know the data or the key).

```sh
# add a server with an encryption key and use it as defaault
tj server add myserver --url http://localhost:3000 --key mysecret --default
# login
tj server login
# synchronize data (two-way sync with merging)
tj server sync
# one-way sync (upload and overwrite)
tj server sync --upload
# one-way sync (download and overwrite)
tj server sync --download
```

Self-signed certificate is also supported when using an HTTPS URL.
However, you will be prompted to verify the signature of it to avoid MITM attack.



## Environment Variables

* `TASK_JSON_PATH`: the path of task.json data (default: `$HOME/.config/task.json`)

## Migration from v7 to v8

Backup your old data first.
Then use the script in <https://github.com/task-json/task.json/tree/master/scripts> to migrate your data
from task.json format v1 to v2.

You'll also need to use task.json-server v2 if you want to sync data with a server.

## Migration from v5 to v6

Move the data from `$HOME/.task.json` to `$HOME/.config/task.json`.

## License

AGPL-3.0 License.

Full copyright notice:

    Copyright (C) 2020-2022  DCsunset

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

