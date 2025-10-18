import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";
import { File, Paths } from "expo-file-system";
import { colors, TaskItem } from "./constants";
import Task from "./components/Task";
import DistortedText from "./components/Distorted";

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

  async function saveTasks() {
    try {
      // Create a File in the document directory (persistent storage)
      const file = new File(Paths.document, "tasks.json");

      // Write JSON data
      await file.write(JSON.stringify({ tasks: taskItems }));

      console.log("Tasks saved to:", file.uri);
    } catch (error) {
      console.error("Save failed:", error);
    }
  }

  const loadFromFile = async (): Promise<void> => {
    try {
      const file = new File(Paths.document, "tasks.json");

      // Check if the file exists
      const info = await file.info();
      if (info.exists) {
        // Read as UTF-8 text
        const contents = await file.text();
        if (contents) {
          const parsed = JSON.parse(contents);
          setTaskItems(unfocus(deselect(parsed.tasks)));
        } else {
          console.log("tasks.json is empty, creating default file...");
          await saveTasks();
        }
      } else {
        console.log("tasks.json not found, creating new one...");
        await saveTasks();
      }
    } catch (e: unknown) {
      if (typeof e === "string") {
        console.log(e.toUpperCase());
      } else if (e instanceof Error) {
        console.log(e.message);
      }
      // Fallback: ensure a file exists
      await saveTasks();
    }
  };

  useEffect(() => {
    loadFromFile();
  }, []);

  useEffect(() => {
    if (!focusedTaskExists()) saveTasks();
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
    saveTasks();
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

  const focusedTaskExists = (): boolean => {
    for (let taskItem of taskItems) {
      if (taskItem.focused) return true;
    }
    return false;
  };

  const addTaskButton =
    taskItems.length <= 20 ? (
      <Pressable
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "#5057E9" : "#5865F2" }]}
        onPress={() => {
          handleAddTask();
        }}
        accessibilityLabel="Add a new task"
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>
    ) : null;

  const testButton = (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: "transparent",
          borderWidth: 2, // add border
          borderColor: "#5865F2", // choose a color that fits
          borderRadius: 8, // optional: rounded corners
        },
      ]}
      onPress={() => {}}
      accessibilityLabel="Test"
    >
      <Text style={{ fontSize: 18, color: "#5865F2" }}>
        &#169; 2025 <DistortedText text="Raynesz" fontSize={18} />
      </Text>
    </Pressable>
  );

  const deleteButton = (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? "#E53437" : "#ED4245" }]}
      onPress={() => {
        handleDeleteSelected();
      }}
      accessibilityLabel="Delete selected tasks"
    >
      <Text style={styles.buttonText}>Delete</Text>
    </Pressable>
  );

  const Tasks = (
    <View style={styles.tasks}>
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ebebeb" translucent={false} />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      {Tasks}
      {testButton}
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
  aboutButton: {
    marginRight: 20,
    padding: 20,
    backgroundColor: "#5865F2",
    borderRadius: 10,
  },
  tasks: {
    flex: 1,
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
