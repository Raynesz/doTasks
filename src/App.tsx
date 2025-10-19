import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { File, Paths } from "expo-file-system";
import { ThemeProvider, useTheme } from "./themes";
import { colors, TaskItem } from "./constants";
import Task from "./components/Task";
import DistortedText from "./components/Distorted";

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const { theme } = useTheme();

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
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? theme.accentPressed : theme.accent }]}
        onPress={() => {
          handleAddTask();
        }}
        accessibilityLabel="Add a new task"
      >
        <Text selectable={false} style={styles.buttonText}>
          Add Task
        </Text>
      </Pressable>
    ) : null;

  const aboutButton = (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: "transparent",
          borderWidth: 2, // add border
          borderColor: theme.accent, // choose a color that fits
          borderRadius: 8, // optional: rounded corners
        },
      ]}
      onPress={() => setShowAbout(false)}
      accessibilityLabel="Test"
    >
      <Text selectable={false} style={{ fontSize: 18, color: theme.accent }}>
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
      <Text selectable={false} style={styles.buttonText}>
        Delete
      </Text>
    </Pressable>
  );

  let mainButton;
  if (showAbout) {
    mainButton = aboutButton;
  } else if (selectedTasksExist()) {
    mainButton = deleteButton;
  } else {
    mainButton = addTaskButton;
  }

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
    </View>
  );

  const titleText = showAbout ? "doTasks - v2.0.0" : "Tasks";

  return (
    <ThemeProvider>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style="auto" backgroundColor={theme.background} translucent={false} />
        <TouchableWithoutFeedback
          style={styles.header}
          onLongPress={() => setShowAbout(!showAbout)}
          delayLongPress={3000}
        >
          <Text selectable={false} style={[styles.title, { color: theme.text }]}>
            {titleText}
          </Text>
        </TouchableWithoutFeedback>
        {Tasks}
        {mainButton}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
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
