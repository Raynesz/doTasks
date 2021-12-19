import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard, TouchableOpacity } from "react-native";
import { colors, TaskItem } from "./src/constants";
import Task from "./src/Task";

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  const handleAddTask = () => {
    const newTasks = taskItems.map((item) => {
      return { ...item, focused: false };
    });
    setTaskItems([
      ...newTasks,
      {
        text: "",
        status: 0,
        selected: false,
        focused: true,
      },
    ]);
  };

  const handleSelectTask = (index: number): void => {
    const newTasks = taskItems.map((item) => {
      return { ...item, focused: false };
    });
    newTasks[index].selected = !newTasks[index].selected;
    setTaskItems(newTasks);
  };

  const handlChangeText = (index: number, changedText: string): void => {
    const newTasks = taskItems.slice();
    newTasks[index].text = changedText;
    setTaskItems(newTasks);
  };

  const handleChangeStatus = (index: number): void => {
    const newTasks = taskItems.slice();
    if (newTasks[index].status < colors.length - 1) newTasks[index].status++;
    else newTasks[index].status = 0;
    setTaskItems(newTasks);
  };

  const handleChangeFocus = (index: number): void => {
    const newTasks = taskItems.slice();
    newTasks[index].focused = !newTasks[index].focused;
    setTaskItems(newTasks);
  };

  const handleDeleteSelected = () => {
    setTaskItems(taskItems.filter((taskItem) => !taskItem.selected));
  };

  const selectedTasksExist = (): boolean => {
    for (let taskItem of taskItems) {
      if (taskItem.selected) return true;
    }
    return false;
  };

  const addTaskButton =
    taskItems.length <= 20 ? (
      <Pressable
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "#5057E9" : "#5865F2" }]}
        onPress={() => handleAddTask()}
        accessibilityLabel="Add a new task"
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>
    ) : null;

  const deleteButton = (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "#E53437" : "#ED4245" }]}
      onPress={() => handleDeleteSelected()}
      accessibilityLabel="Delete selected tasks"
    >
      <Text style={styles.buttonText}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tasksList}>
          {taskItems
            .slice(0)
            .reverse()
            .map((item, index) => (
              <Task
                key={index}
                item={item}
                index={taskItems.length - 1 - index}
                selectFunc={handleSelectTask}
                changeStatusFunc={handleChangeStatus}
                changeFocusFunc={handleChangeFocus}
                changeTextFunc={handlChangeText}
              />
            ))}
        </View>
      </ScrollView>
      {selectedTasksExist() ? deleteButton : addTaskButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ebebeb",
    flex: 1,
  },
  title: {
    paddingTop: 50,
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  tasksList: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#ED4245",
    width: "90%",
    paddingVertical: 15,
    marginVertical: 25,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textTransform: "uppercase",
  },
});
