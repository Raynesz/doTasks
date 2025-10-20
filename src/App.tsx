import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { File, Paths } from "expo-file-system";
import { useTheme } from "./themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, TaskItem } from "./constants";
import Task from "./Task";

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const { theme } = useTheme();

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
          setTaskItems(deselect(parsed.tasks));
        } else {
          await saveTasks();
        }
      } else {
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
    if (!editingIndex) saveTasks();
  }, [taskItems]);

  const handleAddTask = () => {
    setTaskItems([
      ...taskItems,
      {
        text: "",
        status: 0,
        selected: false,
      },
    ]);
    setEditingIndex(taskItems.length);
    saveTasks();
  };

  const handleChangeText = (index: number, newText: string) => {
    const newTasks = [...taskItems];
    newTasks[index].text = newText;
    setTaskItems(newTasks);
  };

  const handleChangeStatus = (index: number) => {
    const newTasks = [...taskItems];
    newTasks[index].status = (newTasks[index].status + 1) % colors.length;
    setTaskItems(newTasks);
  };

  const handlePressSelect = (index: number) => {
    const newTasks = [...taskItems];
    newTasks[index].selected = !newTasks[index].selected;
    setTaskItems(newTasks);
  };

  const handleStartEditing = (index: number) => {
    setEditingIndex(index);
  };

  const handleEndEditing = () => {
    setEditingIndex(null);
  };

  const handleDeleteSelected = () => {
    setTaskItems(taskItems.filter((taskItem) => !taskItem.selected));
    setSelectMode(false);
  };

  const addTaskButton =
    taskItems.length <= 20 ? (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? theme.accentPressed : theme.accent, borderColor: theme.accent },
        ]}
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
          borderColor: theme.accent,
        },
      ]}
      onPress={() => setShowAbout(false)}
      accessibilityLabel="Test"
    >
      <Text selectable={false} style={{ fontSize: 18, color: theme.accent }}>
        est.{" "}
        <Text selectable={false} style={{ fontSize: 18, fontWeight: "bold" }}>
          2025
        </Text>{" "}
        by{" "}
        <Text selectable={false} style={{ fontSize: 18, fontWeight: "bold" }}>
          raynesz
        </Text>
      </Text>
    </Pressable>
  );

  const deleteButton = (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? "#E53437" : "#ED4245", borderColor: "#ED4245" },
      ]}
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
  } else if (selectMode) {
    mainButton = deleteButton;
  } else {
    mainButton = addTaskButton;
  }

  const Tasks = (
    <ScrollView
      contentContainerStyle={styles.tasksList}
      keyboardShouldPersistTaps="never"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      {taskItems.map((item, index) => (
        <Task
          key={index}
          item={item}
          isEditing={editingIndex === index}
          onChangeText={(text) => handleChangeText(index, text)}
          onChangeStatus={() => handleChangeStatus(index)}
          onPressSelect={() => handlePressSelect(index)}
          onEndEditing={handleEndEditing}
          selectMode={selectMode}
          onStartEditing={() => handleStartEditing(index)}
        />
      ))}
    </ScrollView>
  );

  const titleText = showAbout ? (
    <Text>
      doTasks - <Text style={{ color: theme.accent }}>v2.0.0</Text>
    </Text>
  ) : (
    "Tasks"
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar style="auto" backgroundColor={theme.background} translucent={false} />
      <View style={styles.header}>
        <TouchableWithoutFeedback
          style={styles.header}
          onLongPress={() => setShowAbout(!showAbout)}
          delayLongPress={2000}
        >
          <Text selectable={false} style={[styles.title, { color: theme.text }]}>
            {titleText}
          </Text>
        </TouchableWithoutFeedback>
        <Pressable
          style={[
            styles.circular,
            { borderColor: theme.accent, backgroundColor: selectMode ? theme.accent : theme.background },
          ]}
          onPress={() => setSelectMode(!selectMode)}
        ></Pressable>
      </View>
      {Tasks}
      {mainButton}
    </SafeAreaView>
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
  tasksList: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    width: "90%",
    paddingVertical: 15,
    marginVertical: 13,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textTransform: "uppercase",
  },
  circular: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    marginTop: 10,
    marginRight: 15,
  },
});
