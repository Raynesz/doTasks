import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  AppState,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { File, Paths } from "expo-file-system";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { useTheme } from "./themes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import debounce from "lodash.debounce";
import { colors, TaskItem, maxTasks } from "./constants";
import Task from "./Task";

const saveTasks = debounce(async (tasks: TaskItem[]) => {
  //console.log("Start save " + Date.now().toString()); //LOG
  try {
    const file = new File(Paths.document, "tasks.json");

    await file.write(JSON.stringify({ tasks }));
  } catch (error) {
    console.error("Save failed:", error);
  }
}, 1000);

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([
    { id: "1", text: "Buy groceries", status: 0 },
    { id: "2", text: "Walk the dog", status: 1 },
  ]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const insets = useSafeAreaInsets();

  const { theme } = useTheme();

  const loadFromFile = async (): Promise<void> => {
    //console.log("Loading tasks..."); //LOG
    const file = new File(Paths.document, "tasks.json");

    try {
      const info = await file.info();

      // If file doesn’t exist, create it with defaults
      if (!info.exists) {
        console.warn("No tasks file found — creating new one.");
        await saveTasks(taskItems);
        return;
      }

      const contents = await file.text();

      if (!contents.trim()) {
        console.warn("Tasks file is empty — writing defaults.");
        await saveTasks(taskItems);
        return;
      }

      const parsed = JSON.parse(contents);

      if (Array.isArray(parsed.tasks)) {
        setTaskItems(parsed.tasks);
        //console.log("Tasks loaded successfully"); //LOG
      } else {
        console.warn("Invalid tasks format — resetting file.");
        await saveTasks(taskItems);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      // As fallback, rewrite defaults to prevent app crash
      await saveTasks(taskItems);
    }
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        saveTasks.flush();
      }
    });

    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      //console.log("Keyboard closed"); //LOG
      setEditingIndex(null);
    });

    if (Platform.OS === "android") {
      NavigationBar.setStyle("auto");
    }

    loadFromFile();

    return () => {
      appStateListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    saveTasks(taskItems);
  }, [taskItems]);

  const handleAddTask = () => {
    setTaskItems([
      ...taskItems,
      {
        id: Date.now().toString(),
        text: "",
        status: 0,
      },
    ]);
    setEditingIndex(taskItems.length);
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

  const handlePressSelect = (id: string) => {
    setSelectedTasks((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleStartEditing = (index: number) => {
    if (selectMode) return;
    setEditingIndex(index);
  };

  const handleEndEditing = () => {
    setEditingIndex(null);
  };

  const handleDeleteSelected = () => {
    setTaskItems((prevTasks) => prevTasks.filter((taskItem) => !selectedTasks.includes(taskItem.id)));
    setSelectedTasks([]);
    setSelectMode(false);
  };

  const addTaskButton =
    taskItems.length < maxTasks ? (
      <Pressable
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? theme.accentPressed : theme.accent }]}
        onPress={() => {
          handleAddTask();
        }}
        accessibilityLabel="Add a new task"
      >
        <Text selectable={false} style={styles.buttonText}>
          New Task
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
      accessibilityLabel="about"
    >
      <Text selectable={false} style={{ fontSize: 18, color: theme.accent }}>
        est.{" "}
        <Text selectable={false} style={{ fontSize: 18, fontWeight: "bold" }}>
          2025
        </Text>{" "}
        by{" "}
        <Text selectable={false} style={{ fontSize: 18, fontWeight: "bold", color: "#c22c4c" }}>
          raynesz
        </Text>
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
  } else if (selectMode) {
    mainButton = deleteButton;
  } else {
    mainButton = addTaskButton;
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TaskItem>) => {
    const index = taskItems.indexOf(item);
    return (
      <TouchableWithoutFeedback onLongPress={drag} delayLongPress={200}>
        <View style={{ opacity: isActive ? 0.8 : 1 }}>
          <Task
            id={item.id}
            item={item}
            selected={selectedTasks.includes(item.id)}
            isEditing={editingIndex === index}
            onChangeText={(text) => handleChangeText(index, text)}
            onChangeStatus={() => handleChangeStatus(index)}
            onPressSelect={() => handlePressSelect(item.id)}
            onEndEditing={handleEndEditing}
            selectMode={selectMode}
            onStartEditing={() => handleStartEditing(index)}
            onLongPress={drag}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const titleText = showAbout ? (
    <Text>
      doTasks - <Text style={{ color: theme.accent }}>v2.0.0</Text>
    </Text>
  ) : (
    "Tasks"
  );

  const footer =
    editingIndex === null ? (
      <View style={[styles.footer, { backgroundColor: theme.backgroundPrimary }]}>{mainButton}</View>
    ) : null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundPrimary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <StatusBar style="auto" backgroundColor={theme.backgroundPrimary} translucent />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableWithoutFeedback onLongPress={() => setShowAbout(!showAbout)} delayLongPress={2000}>
            <Text selectable={false} style={[styles.title, { color: theme.text }]}>
              {titleText}
            </Text>
          </TouchableWithoutFeedback>
          <Pressable
            style={[
              styles.circular,
              { borderColor: theme.accent, backgroundColor: selectMode ? theme.accent : theme.backgroundPrimary },
            ]}
            onPress={() => {
              setSelectedTasks([]);
              setSelectMode(!selectMode);
              setEditingIndex(null);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={taskItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ data }) => {
              setTaskItems(data);
            }}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            contentContainerStyle={{ backgroundColor: theme.backgroundSecondary, paddingHorizontal: 20 }}
          />
        </View>
        {footer}
      </KeyboardAvoidingView>
    </View>
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
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    width: "90%",
    paddingVertical: 15,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
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
    marginRight: 23,
  },
});
