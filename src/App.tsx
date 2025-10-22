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
} from "react-native";
import { File, Paths } from "expo-file-system";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { useTheme } from "./themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, TaskItem, maxTasks } from "./constants";
import Task from "./Task";

export default function App() {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([
    { id: "1", text: "Buy groceries", status: 0, selected: false },
    { id: "2", text: "Walk the dog", status: 1, selected: false },
  ]);
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
    console.log("Saving tasks...");
    try {
      const file = new File(Paths.document, "tasks.json");

      await file.write(JSON.stringify({ tasks: taskItems }));
    } catch (error) {
      console.error("Save failed:", error);
    }
  }

  const loadFromFile = async (): Promise<void> => {
    try {
      const file = new File(Paths.document, "tasks.json");

      const info = await file.info();
      if (info.exists) {
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
        id: Date.now().toString(),
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
          borderWidth: 2,
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
        <Text selectable={false} style={{ fontSize: 18, fontWeight: "bold" }}>
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
            isEditing={editingIndex === index}
            onChangeText={(text) => handleChangeText(index, text)}
            onChangeStatus={() => handleChangeStatus(index)}
            onPressSelect={() => handlePressSelect(index)}
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundPrimary }]} edges={["top", "bottom"]}>
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
            setTaskItems(deselect(taskItems));
            setSelectMode(!selectMode);
          }}
        />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={taskItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ data }) => setTaskItems(data)}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            contentContainerStyle={{ backgroundColor: theme.backgroundSecondary, paddingHorizontal: 20 }}
          />
        </View>
        <View style={{ backgroundColor: theme.backgroundPrimary }}>{mainButton}</View>
      </KeyboardAvoidingView>
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
  button: {
    width: "90%",
    paddingVertical: 15,
    marginVertical: 13,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
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
    marginTop: 7,
    marginRight: 23,
  },
});
