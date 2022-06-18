/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

export type Remote = {
  server?: string;
  token?: string;
};

export type Workspace = {
  projects?: string[],
  contexts?: string[]
};
