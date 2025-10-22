export const colors: string[] = ["#93acfdff", "#ff6a6aff", "#ffe555ff", "#a7ff6dff"];

export interface TaskItem {
  id: string;
  text: string;
  status: number;
  selected: boolean;
}

export const maxTasks = 50;

export const maxTaskCharaters = 100;
