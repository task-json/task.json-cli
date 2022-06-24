/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

export type ServerConfig = {
  url: string,
  token?: string,
  /// trusted CA
  ca?: string[]
};

export type Server = {
  name: string,
  config: ServerConfig,
  /// created date (ISO format)
  created: string,
  /// modified date (ISO format)
  modified: string,
  /// Whether it's the default server
  default?: boolean
};

export type WorkspaceConfig = {
  projects?: string[],
  contexts?: string[]
};

export type Workspace = {
  name: string,
  config: WorkspaceConfig,
  /// created date (ISO format)
  created: string,
  /// modified date (ISO format)
  modified: string,
  /// whether this workspace is enabled
  enabled?: boolean
};
