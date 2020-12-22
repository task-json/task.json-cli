export type Task = {
  text: string;
  priority: string;
  done: boolean;
  contexts: string[];
  projects: string[];
  due: string | null;
  start: string | null;
  end: string | null;
};
