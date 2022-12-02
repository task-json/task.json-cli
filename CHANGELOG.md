# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [7.0.5](https://github.com/DCsunset/task.json-cli/compare/v7.0.4...v7.0.5) (2022-12-02)


### Bug Fixes

* handle errors gracefully ([765ce65](https://github.com/DCsunset/task.json-cli/commit/765ce65477195790e01cbbddcfa6ec24ec1ee579))

### [7.0.4](https://github.com/DCsunset/task.json-cli/compare/v7.0.3...v7.0.4) (2022-07-09)


### Bug Fixes

* fix arguments in zsh completion ([6ed4741](https://github.com/DCsunset/task.json-cli/commit/6ed4741476366575143ca3ea89032b3720bc8f6e))
* fix bool options in _tj ([d9a1b4d](https://github.com/DCsunset/task.json-cli/commit/d9a1b4dd01793a5be4ca61a63f0532c56ce3dd8c))
* fix filterByField ([2f8edc5](https://github.com/DCsunset/task.json-cli/commit/2f8edc5d245fe296e98d90826f2fba88ce4a1e3e))
* fix zsh completion for workspace ([cead379](https://github.com/DCsunset/task.json-cli/commit/cead37966fbbffd57789e35afaa251584bf01fbb))

### [7.0.3](https://github.com/DCsunset/task.json-cli/compare/v7.0.2...v7.0.3) (2022-07-06)


### Bug Fixes

* fix zsh completion ([f09cc45](https://github.com/DCsunset/task.json-cli/commit/f09cc451e486c51885f9613306fa9ddefda674d9))

### [7.0.2](https://github.com/DCsunset/task.json-cli/compare/v7.0.1...v7.0.2) (2022-07-05)


### Bug Fixes

* include missing file ([911f272](https://github.com/DCsunset/task.json-cli/commit/911f272757f579065019844e9c90ca9791541bd1))
* read version from package.json ([d6a0fcf](https://github.com/DCsunset/task.json-cli/commit/d6a0fcf6f6df11ea2669135f2ac9d6e7ab1774c7))

### [7.0.1](https://github.com/DCsunset/task.json-cli/compare/v7.0.0...v7.0.1) (2022-07-05)


### Bug Fixes

* bump task.json-client and update metadata ([00a2a19](https://github.com/DCsunset/task.json-cli/commit/00a2a198a048bd02a3b22deaf9a4dbf1a0238682))
* fix esm import extension ([4265c83](https://github.com/DCsunset/task.json-cli/commit/4265c833811c77517119bad7eadc3f6a8c3d0082))

## [7.0.0](https://github.com/DCsunset/task.json-cli/compare/v6.2.2...v7.0.0) (2022-07-05)


### ⚠ BREAKING CHANGES

* add basic framework using commander
* update license, docs, and config files

### Features

* add `add` command ([6d4b712](https://github.com/DCsunset/task.json-cli/commit/6d4b712a7731e3d2101fd924b373cc627a67d01a))
* add `do` and `undo` command ([c372505](https://github.com/DCsunset/task.json-cli/commit/c372505b4a06df8813033382d6539ebc0196a9ba))
* add `erase` command (using inquirer.js) ([e096e57](https://github.com/DCsunset/task.json-cli/commit/e096e5768b4bae2eaf15f4eeec453d2dc9ee2242))
* add `login` subcommand for `server` command ([07eea66](https://github.com/DCsunset/task.json-cli/commit/07eea667724d3187ae6916f220a4577fc4478cf0))
* add `restore` and `show` commands ([ec71560](https://github.com/DCsunset/task.json-cli/commit/ec715601baca3ca8f86b8e43d9722fa51a92078d))
* add `rm` and `due` commands ([ee2bfe7](https://github.com/DCsunset/task.json-cli/commit/ee2bfe7e30a962f49d7f6db78e6fca7c0c053058))
* add `workspace` command ([9f0d193](https://github.com/DCsunset/task.json-cli/commit/9f0d193c58aa905f22184ec8c5081abfd416df3e))
* add basic framework using commander ([be5fe21](https://github.com/DCsunset/task.json-cli/commit/be5fe219321ffe8437abed7fcc1677139695d7ae))
* add completion and lsnum commands ([6ded8cb](https://github.com/DCsunset/task.json-cli/commit/6ded8cb3fb1f0fdb47c7ca530307102013b97f3c))
* add ls command ([ac34c1a](https://github.com/DCsunset/task.json-cli/commit/ac34c1a65fce24f38cb2904ad7a44ec678a6a51b))
* add lsctx and lsproj commands ([92c3fd4](https://github.com/DCsunset/task.json-cli/commit/92c3fd434ffd95070df79ab4cc424d20bd65a5c0))
* add modify command ([e1761a8](https://github.com/DCsunset/task.json-cli/commit/e1761a83ba618b99429af48a30eec398258589be))
* add server command ([63c1090](https://github.com/DCsunset/task.json-cli/commit/63c10906f7383338e039a2db8e4adb505e7a399f))
* add sync subcommand for server ([9456b26](https://github.com/DCsunset/task.json-cli/commit/9456b262da1bccd6a85193262ab283fac1f2c1d0))
* add zsh completion for remaining commands ([6553d22](https://github.com/DCsunset/task.json-cli/commit/6553d22cb83f6acdec930d914bfd5b1ae9ddc26c))
* support showing only names in server and workspace ([cc5537a](https://github.com/DCsunset/task.json-cli/commit/cc5537a4215046e43d1cd2466ece686f4b5ae687))


### Bug Fixes

* fix `workspace` command ([4df7549](https://github.com/DCsunset/task.json-cli/commit/4df754942fbf39b9f2e7993cf82c0b6ebeddd0c9))
* fix options ([dfeef96](https://github.com/DCsunset/task.json-cli/commit/dfeef96ff7308fbca3ed2e8813525b4cc8dd6512))


* update license, docs, and config files ([669ef81](https://github.com/DCsunset/task.json-cli/commit/669ef81169ac25fd3109c56973130d3f998f3877))
