import React, { FunctionComponent} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskItem } from '../App';

export const Task: FunctionComponent<{ item: TaskItem }> = (props) => {
  return (
    <View style={styles.task}>
      <View style={styles.taskLeft}>
        <View style={styles.square}></View>
        <Text style={styles.taskText}>{props.item.text}</Text>
      </View>
      <View style={styles.circular}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  taskText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
