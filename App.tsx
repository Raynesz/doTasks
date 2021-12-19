import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import Task from './components/Task';

export interface TaskItem {
  text: string;
  status: string;
  selected: boolean;
}

export default function App() {
  let newTask1: TaskItem = {
    text: 'Task1',
    status: 'default',
    selected: false
  }
  let newTask2: TaskItem = {
    text: 'Task2',
    status: 'default',
    selected: false
  }
  let newTask3: TaskItem = {
    text: 'Task3',
    status: 'default',
    selected: false
  }

  const [taskItems, setTaskItems] = useState<TaskItem[]>([newTask1, newTask2, newTask3]);

  /*const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask(null);
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }*/

  const deleteSelected = () => {

  }

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
                  <Task item={item} /> 
                </TouchableOpacity>
              )
            })
          }
      </View>
      </ScrollView>
      <Button
        onPress={()=>deleteSelected()}
        title="Delete"
        color="#ED4245"
        accessibilityLabel="Delete Selected Tasks"
      />
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
});
