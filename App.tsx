import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import { colors, TaskItem } from "./src/constants";
import Task from "./src/Task";

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  const unfocus = (tasks: any): TaskItem[] => {
    const newTasks = tasks.map((item: object) => {
      return { ...item, focused: false };
    });
    return newTasks;
  };

  const deselect = (tasks: any): TaskItem[] => {
    const newTasks = tasks.map((item: object) => {
      return { ...item, selected: false };
    });
    return newTasks;
  };

  const saveToFile = async (): Promise<void> => {
    try {
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "tasks.json",
        JSON.stringify({ tasks: taskItems })
      );
      console.log("Saved to file.");
    } catch (e: unknown) {
      if (typeof e === "string") {
        console.log(e.toUpperCase());
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const loadFromFile = async (): Promise<void> => {
    try {
      const contents: any = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "tasks.json");
      console.log("contents: " + contents);
      if (contents) setTaskItems(unfocus(deselect(JSON.parse(contents).tasks)));
      else console.log("Problem reading tasks.json");
    } catch (e: unknown) {
      if (typeof e === "string") {
        console.log(e.toUpperCase());
      } else if (e instanceof Error) {
        console.log(e.message);
      }
      saveToFile();
    }
  };

  useEffect(() => {
    loadFromFile();
  }, []);

  useEffect(() => {
    saveToFile();
  }, [taskItems]);

  const handleAddTask = () => {
    const newTasks = unfocus(taskItems);
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
    const newTasks = unfocus(taskItems);
    newTasks[index].selected = !newTasks[index].selected;
    setTaskItems(newTasks);
  };

  const handleChangeText = (index: number, changedText: string): void => {
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

  const testButton1 = (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "green" : "green" }]}
      onPress={() => loadFromFile()}
      accessibilityLabel="test"
    >
      <Text style={styles.buttonText}>load</Text>
    </Pressable>
  );

  const testButton2 = (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "green" : "green" }]}
      onPress={() => saveToFile()}
      accessibilityLabel="test"
    >
      <Text style={styles.buttonText}>save</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#ebebeb" translucent={false} />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Pressable style={styles.about} accessibilityLabel="About" />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="never"
        onScrollBeginDrag={Keyboard.dismiss}
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
                changeTextFunc={handleChangeText}
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
  header: {
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  about: {
    marginRight: 20,
    padding: 20,
    backgroundColor: "#5865F2",
    borderRadius: 10,
  },
  tasksList: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
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
