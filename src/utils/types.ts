export type Config = {
  server?: string;
  token?: string;
};

export type Workspace = {
  projects?: string[],
  contexts?: string[]
};