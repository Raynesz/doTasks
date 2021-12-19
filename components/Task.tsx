import React, { FunctionComponent} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TaskItem } from '../App';

interface Props {
  item: TaskItem, index: number, selectFunc: (index: number)=>void, changeStatusFunc: (index: number)=>void
}

export const Task: FunctionComponent<Props> = (props) => {
  let circularBgColor: string;
  let circularBorderWidth: number;
  if (props.item.selected) {
    circularBgColor = '#5865F2';
    circularBorderWidth = 0;
  } else {
    circularBgColor = '#FFF';
    circularBorderWidth = 2;
  }

  let statusColor: string;
  let statusOpacity: number = 1;
  switch(props.item.status) {
    case 'green':
      statusColor = '#57F287';
      break;
    case 'yellow':
      statusColor = '#FEE75C';
      break;
    case 'red':
      statusColor = '#ED4245';
      break;
    case 'fuchsia':
      statusColor = '#EB459E';
      break;
    default:
      statusColor = '#5865F2';
      statusOpacity = 0.4;
  }

  return (
    <View style={[styles.task,  {borderColor: props.item.selected? '#5865F2' : '#FFF'}]}>
      <View style={styles.taskLeft}>
        <Pressable style={[styles.square, {backgroundColor: statusColor, opacity: statusOpacity}]} 
        onPress={()=>props.changeStatusFunc(props.index)} />
        <Text style={styles.taskText}>{props.item.text}</Text>
      </View>
      <Pressable style={[styles.circular, {backgroundColor: circularBgColor, borderWidth: circularBorderWidth}]} 
      onPress={()=>props.selectFunc(props.index)} />
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
    borderRadius: 5,
    marginRight: 15,
  },
  taskText: {
    maxWidth: '80%',
  },
  circular: {
    width: 20,
    height: 20,
    borderColor: '#5865F2',
    borderRadius: 10,
  },
});

export default Task;
