export type Task = {
  text: string;
  priority?: string;
  contexts?: string[];
  projects?: string[];
  due?: string;
  start?: string;
  end?: string;
};
