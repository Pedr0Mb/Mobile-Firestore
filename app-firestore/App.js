import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const PROJECT_ID = "atividademobile-2a7e2";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/tasks`;

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  async function fetchFirestore(method = 'GET', body = null, id = '') {
      const res = await fetch(id ? `${FIRESTORE_URL}/${id}` : FIRESTORE_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
      });
      return method === 'GET' ? await res.json() : true; 
  }

  async function loadTasks() {
    const data = await fetchFirestore();
    if (data?.documents) {
      setTasks(data.documents.map(doc => ({
        id: doc.name.split('/').pop(),
        text: doc.fields.text.stringValue
      })));
    } else {
      setTasks([]);
    }
  }

  async function addTask() {
    if (!task.trim()) return Alert.alert('Erro', 'Digite uma tarefa');
    const newTask = { fields: { text: { stringValue: task } } };
    await fetchFirestore('POST', newTask) 
    setTask('');
    await loadTasks();
  }

  async function deleteTask(id) {
    await fetchFirestore('DELETE', null, id)
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
              <FontAwesome name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma tarefa</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffde7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFA000', textAlign: 'center' },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#FFA000', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#FFA000', borderRadius: 8, paddingHorizontal: 15, justifyContent: 'center', marginLeft: 10 },
  buttonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white', borderRadius: 8, marginBottom: 10 },
  deleteButton: { backgroundColor: '#E53935', padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
