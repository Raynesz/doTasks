export const colors: string[] = ["#5865F2", "#57F287", "#FEE75C", "#ED4245", "#EB459E"];

export interface TaskItem {
  text: string;
  status: number;
  selected: boolean;
  focused: boolean;
}
