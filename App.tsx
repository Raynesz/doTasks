import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import Task from './components/Task';

export interface TaskItem {
  text: string;
  status: string;
  selected: boolean;
}

export default function App() {
  let newTasks: TaskItem[] = [];
  for (let i=0; i<15; i++) {
    let newTask: TaskItem = {
      text: 'Task'+i,
      status: 'default',
      selected: false
    }
    newTasks.push(newTask);
  }

  const [taskItems, setTaskItems] = useState<TaskItem[]>(newTasks);

  const handleAddTask = () => {
    //Keyboard.dismiss();
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
  style={[styles.button, {backgroundColor: '#5865F2'}]}
  onPress={()=>handleAddTask()}
  accessibilityLabel="Add a new task"
>
  <Text style={styles.buttonText}>
    Add Task
  </Text>
  </Pressable>;

  const deleteButton = <Pressable
  style={[styles.button, {backgroundColor: '#ED4245'}]}
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
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index}  
                //onPress={() => completeTask(index)}
                >
                  <Task item={item} index={index} selectFunc={handleSelectTask} /> 
                </TouchableOpacity>
              )
            })
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
    fontSize: 24,
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
