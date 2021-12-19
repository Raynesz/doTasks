import React, { FunctionComponent} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TaskItem } from '../App';

interface Props {
  item: TaskItem, index: number, selectFunc: (index: number)=>void
}

export const Task: FunctionComponent<Props> = (props) => {
  return (
    <View style={[styles.task,  {borderColor: props.item.selected? '#5865F2' : '#FFF'}]}>
      <View style={styles.taskLeft}>
        <View style={styles.square}></View>
        <Text style={styles.taskText}>{props.item.text}</Text>
      </View>
      <Pressable style={[styles.circular, {backgroundColor: props.item.selected? '#5865F2' : '#FFF'}]} onPress={()=>props.selectFunc(props.index)}></Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
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
    backgroundColor: '#5865F2',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  taskText: {
    maxWidth: '80%',
  },
  circular: {
    width: 15,
    height: 15,
    borderColor: '#5865F2',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
