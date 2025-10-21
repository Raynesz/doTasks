import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "./themes";
import { colors, TaskItem } from "./constants";

interface Props {
  id: string;
  item: TaskItem;
  isEditing: boolean;
  onChangeStatus: () => void;
  onChangeText: (text: string) => void;
  onPressSelect: () => void;
  onEndEditing: () => void;
  selectMode: boolean;
  onStartEditing: () => void;
  onLongPress: () => void;
}

const Task: FunctionComponent<Props> = (props) => {
  const { theme } = useTheme();

  const text = props.isEditing ? (
    <TextInput
      style={[styles.text, { color: theme.text }]}
      onEndEditing={() => {
        props.onEndEditing();
      }}
      onChangeText={(text: string) => {
        props.onChangeText(text);
      }}
      defaultValue={props.item.text}
      maxLength={100}
      multiline
      autoFocus={true}
    />
  ) : (
    <Text style={[styles.text, { color: theme.text }]}>{props.item.text}</Text>
  );

  return (
    <Pressable
      style={[
        styles.task,
        { backgroundColor: theme.surface, borderColor: props.item.selected ? theme.accent : theme.surface },
      ]}
    >
      <Pressable
        style={[styles.square, { backgroundColor: colors[props.item.status] }]}
        onPress={() => props.onChangeStatus()}
      />
      <Pressable
        style={[styles.textSection, { backgroundColor: theme.surface }]}
        onPress={() => props.onStartEditing()}
        disabled={props.isEditing}
        onLongPress={() => props.onLongPress()}
      >
        {text}
      </Pressable>
      {props.selectMode && (
        <Pressable
          style={[
            styles.circular,
            { backgroundColor: props.item.selected ? theme.accent : theme.surface, borderColor: theme.accent },
          ]}
          onPress={() => props.onPressSelect()}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  task: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  square: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 15,
  },
  textSection: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  circular: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    marginLeft: 5,
  },
});

export default Task;
