export const colors: string[] = ["#5865F2", "#ED4245", "#FEE75C", "#57F287"];

export interface TaskItem {
  text: string;
  status: number;
  selected: boolean;
  focused: boolean;
}
