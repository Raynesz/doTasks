export const colors: string[] = ["#93acfdff", "#ff6a6aff", "#ffe555ff", "#a7ff6dff"];

export interface TaskItem {
  id: string;
  text: string;
  status: number;
}

export interface TaskProps {
  id: string;
  item: TaskItem;
  selected: boolean;
  isEditing: boolean;
  onChangeStatus: () => void;
  onChangeText: (text: string) => void;
  onPressSelect: () => void;
  onEndEditing: () => void;
  selectMode: boolean;
  onStartEditing: () => void;
  onLongPress: () => void;
}

export const maxTasks = 50;

export const maxTaskCharaters = 100;
