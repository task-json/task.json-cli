export type Task = {
  text: string;
  priority: string;
  done: boolean;
  start: string | null;
  end: string | null;
  contexts: string[];
  projects: string[];
};
