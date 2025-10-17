import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { colors, TaskItem } from "../constants";

interface Props {
  item: TaskItem;
  index: number;
  selectFunc: (index: number) => void;
  changeStatusFunc: (index: number) => void;
  changeFocusFunc: (index: number) => void;
  changeTextFunc: (index: number, changedText: string) => void;
}

const Task: FunctionComponent<Props> = (props) => {
  let circularBgColor: string;
  let circularBorderWidth: number;
  if (props.item.selected) {
    circularBgColor = "#5865F2";
    circularBorderWidth = 0;
  } else {
    circularBgColor = "#FFF";
    circularBorderWidth = 2;
  }

  const text = props.item.focused ? (
    <TextInput
      style={styles.taskText}
      onEndEditing={() => {
        props.changeFocusFunc(props.index);
      }}
      onChangeText={(changedText: string) => {
        props.changeTextFunc(props.index, changedText);
      }}
      defaultValue={props.item.text}
      maxLength={100}
      multiline
      autoFocus
    />
  ) : (
    <Text style={styles.taskText}>{props.item.text}</Text>
  );

  return (
    <Pressable
      style={[styles.task, { borderColor: props.item.selected ? "#5865F2" : "#FFF" }]}
      onPress={() => props.changeFocusFunc(props.index)}
    >
      <View style={styles.taskLeft}>
        <Pressable
          style={[
            styles.square,
            { backgroundColor: colors[props.item.status], opacity: props.item.status === 0 ? 0.4 : 1 },
          ]}
          onPress={() => props.changeStatusFunc(props.index)}
        />
        {text}
      </View>
      <Pressable
        style={[styles.circular, { backgroundColor: circularBgColor, borderWidth: circularBorderWidth }]}
        onPress={() => props.selectFunc(props.index)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 15,
  },
  taskText: {
    maxWidth: "77%",
    fontSize: 16,
  },
  circular: {
    width: 25,
    height: 25,
    borderColor: "#5865F2",
    borderRadius: 13,
  },
});

export default Task;
