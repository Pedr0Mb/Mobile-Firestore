import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBXmj40VHDZB3THaJ9ZMPTiHSAJeJ3KhWc',
  authDomain: 'atividademobile-2a7e2.firebaseapp.com',
  projectId: 'atividademobile-2a7e2',
  storageBucket: 'atividademobile-2a7e2.firebasestorage.app',
  messagingSenderId: '221102771202',
  appId: '1:221102771202:web:da27f30f00ab40aa7f6b1b',
  measurementId: 'G-DWT2BL633H',
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'tasks'));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        text: d.data().text,
      }));
      setTasks(list);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    }
  };

  const addTask = async () => {
    if (!task.trim()) return Alert.alert('Erro', 'Digite uma tarefa');
    try {
      await addDoc(collection(db, 'tasks'), { text: task });
      setTask('');
      fetchTasks();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar tarefa');
    }
  };

  const deleteTaskById = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      fetchTasks();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir tarefa');
    }
  };

  useEffect(() => {
    fetchTasks();
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTaskById(item.id)}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA000',
    textAlign: 'center',
  },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFA000',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FFA000',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
