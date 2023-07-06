# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [8.2.1](https://github.com/DCsunset/task.json-cli/compare/v8.2.0...v8.2.1) (2023-07-06)


### Bug Fixes

* fix zsh completion ([3c68fb0](https://github.com/DCsunset/task.json-cli/commit/3c68fb01a7a8278506805dba31608883fb361c5c))

## [8.2.0](https://github.com/DCsunset/task.json-cli/compare/v8.1.0...v8.2.0) (2023-07-06)


### ⚠ BREAKING CHANGES

* rename comand restore to rollback and fix undo command

### Bug Fixes

* rename comand restore to rollback and fix undo command ([a406a47](https://github.com/DCsunset/task.json-cli/commit/a406a476387461c78b02aa1311564258b07ffbc0))

## [8.1.0](https://github.com/DCsunset/task.json-cli/compare/v8.0.4...v8.1.0) (2023-06-30)


### Features

* use dynamic imports to speed up startup ([174bc42](https://github.com/DCsunset/task.json-cli/commit/174bc4215884a2ed0da5327c4681aae3e1e7e06f))


### Bug Fixes

* hard code version in app.js to reduce package loading ([82ff8b4](https://github.com/DCsunset/task.json-cli/commit/82ff8b41a323e5ee8fa487acd1110c528b4495e6))

## [8.0.4](https://github.com/DCsunset/task.json-cli/compare/v8.0.3...v8.0.4) (2023-04-14)


### Bug Fixes

* update client library to fix error mesages ([9deff5f](https://github.com/DCsunset/task.json-cli/commit/9deff5f396583e451080aafc40566f883c23b214))

## [8.0.3](https://github.com/DCsunset/task.json-cli/compare/v8.0.2...v8.0.3) (2023-04-14)


### Bug Fixes

* fix key option in server cmd ([2485e2c](https://github.com/DCsunset/task.json-cli/commit/2485e2ce7fab6f75e8d12354ec5e9a9033ec47e9))

## [8.0.2](https://github.com/DCsunset/task.json-cli/compare/v8.0.1...v8.0.2) (2023-04-11)


### Bug Fixes

* let luxon throw on invalid dates ([3b45335](https://github.com/DCsunset/task.json-cli/commit/3b45335a7b7d2492b5e96fe049e45814745bb48d))

## [8.0.1](https://github.com/DCsunset/task.json-cli/compare/v8.0.0...v8.0.1) (2023-04-11)


### Bug Fixes

* add new line in serialize/deserialize function ([d3300be](https://github.com/DCsunset/task.json-cli/commit/d3300bebd9f5f6472a36d55d78294b9a2e84bede))
* append a new line when appending data ([5299cdc](https://github.com/DCsunset/task.json-cli/commit/5299cdcbc82996b9035a360a22713a1a63f83d44))
* keep only unique number ([3b1bba1](https://github.com/DCsunset/task.json-cli/commit/3b1bba1da9cb0f6d4ffca9234b02b7cbf2f1d964))
* show task detail in do cmd ([2f76ebd](https://github.com/DCsunset/task.json-cli/commit/2f76ebd114cccd958eb7419b7649245557e10d0d))

## [8.0.0](https://github.com/DCsunset/task.json-cli/compare/v7.0.6...v8.0.0) (2023-04-09)


### ⚠ BREAKING CHANGES

* upgrade to task.json v2

### Features

* add e2e encryption when syncing with server ([897d48c](https://github.com/DCsunset/task.json-cli/commit/897d48c1529fe679c5a94f552ef0d73819c7e969))
* show removed task text by default ([5e0d1ae](https://github.com/DCsunset/task.json-cli/commit/5e0d1ae1c440a19e6215a9b8e37847c3f69c9c98))
* update zsh completion ([5f74efe](https://github.com/DCsunset/task.json-cli/commit/5f74efe8f945a389f6833c53270900884bf3f8ed))
* upgrade to task.json v2 ([ac62a8a](https://github.com/DCsunset/task.json-cli/commit/ac62a8a2bb71a66d75b22c687d9023b55e125cea))


### Bug Fixes

* allow showing server encryption key ([747cacd](https://github.com/DCsunset/task.json-cli/commit/747cacd9ceee36e47cbee88135e114127e49df84))
* copy instead of removing when adding new task ([33023bd](https://github.com/DCsunset/task.json-cli/commit/33023bd29d934a87f0a16e150e51e525535279a0))
* fix due command ([10041fd](https://github.com/DCsunset/task.json-cli/commit/10041fd0aa14aca675395b780d7cad9f5134dc14))
* rename encryptionKey to key ([d0c3bc6](https://github.com/DCsunset/task.json-cli/commit/d0c3bc65c4e567731cac71e8097864bcd18a70bb))
* start index from 0 instead of 1 ([9168817](https://github.com/DCsunset/task.json-cli/commit/91688176453126b77dec9b7feaa1ed5fe8c647da))
* update zsh completion ([502baa1](https://github.com/DCsunset/task.json-cli/commit/502baa12b214985177902f3315208c98f581e54a))

### [7.0.6](https://github.com/DCsunset/task.json-cli/compare/v7.0.5...v7.0.6) (2022-12-02)

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
