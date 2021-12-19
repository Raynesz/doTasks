import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import { colors, TaskItem } from './src/constants'
import Task from './src/Task';

export default function App() {
  let newTasks: TaskItem[] = [];
  for (let i=0; i<15; i++) {
    let newTask: TaskItem = {
      text: 'Task'+i,
      status: 0,
      selected: false
    }
    newTasks.push(newTask);
  }

  const [taskItems, setTaskItems] = useState<TaskItem[]>(newTasks);

  const handleAddTask = () => {
    //setTaskItems([...taskItems, task])
    //setTask(null);
  }

  /*const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }*/

  const handleSelectTask = (index: number): void => {
    const newTasks = taskItems.slice();
    newTasks[index].selected = !newTasks[index].selected;
    setTaskItems(newTasks);
  }

  const handleChangeStatus = (index:number): void => {
    const newTasks = taskItems.slice();
    if (newTasks[index].status < colors.length - 1) newTasks[index].status++;
    else newTasks[index].status = 0;
    setTaskItems(newTasks);
  }

  const handleDeleteSelected = () => {
    setTaskItems(taskItems.filter(taskItem => !taskItem.selected));
  }

  const selectedTasksExist = (): boolean => {
    for (let taskItem of taskItems) {
      if (taskItem.selected) return true;
    }
    return false;
  }

  const addTaskButton = <Pressable
  style={({ pressed }) =>[styles.button, {backgroundColor: pressed ? '#5057E9' : '#5865F2'}]}
  onPress={()=>handleAddTask()}
  accessibilityLabel="Add a new task"
>
  <Text style={styles.buttonText}>
    Add Task
  </Text>
  </Pressable>;

  const deleteButton = <Pressable
  style={({ pressed }) =>[styles.button, {backgroundColor: pressed ? '#E53437' : '#ED4245'}]}
  onPress={()=>handleDeleteSelected()}
  accessibilityLabel="Delete selected tasks"
>
  <Text style={styles.buttonText}>
    Delete
  </Text>
  </Pressable>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >
      <View style={styles.tasksList}>
          {
            taskItems.map((item, index) => <Task key={index} item={item} index={index} selectFunc={handleSelectTask} changeStatusFunc={handleChangeStatus} />)
          }
      </View>
      </ScrollView>
      {selectedTasksExist() ? deleteButton : addTaskButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebebeb',
    flex: 1,
  },
  title: {
    paddingTop: 50,
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: 'bold'
  },
  tasksList: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ED4245',
    width: '90%',
    paddingVertical: 15,
    marginVertical: 25,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textTransform: 'uppercase',
  }
});
