import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // State management
  const [todos, setTodos] = useState([
    { id: '1', text: 'Welcome to React Native!', completed: true },
    { id: '2', text: 'Edit this todo item', completed: false },
    { id: '3', text: 'Add your own tasks', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editText, setEditText] = useState('');

  // Add new todo
  const addTodo = () => {
    if (newTodo.trim() === '') {
      Alert.alert('Oops!', 'Please enter a task');
      return;
    }
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };
    
    setTodos([todo, ...todos]);
    setNewTodo('');
    Alert.alert('Success!', 'Task added successfully');
  };

  // Toggle completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Edit todo
  const editTodo = (todo) => {
    setTaskToEdit(todo);
    setEditText(todo.text);
    setShowModal(true);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editText.trim() === '') {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }
    
    setTodos(
      todos.map(todo =>
        todo.id === taskToEdit.id ? { ...todo, text: editText } : todo
      )
    );
    setShowModal(false);
    setTaskToEdit(null);
    Alert.alert('Updated!', 'Task edited successfully');
  };

  // Delete todo
  const deleteTodo = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setTodos(todos.filter(todo => todo.id !== id));
            Alert.alert('Deleted', 'Task removed successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Clear all completed
  const clearCompleted = () => {
    Alert.alert(
      'Clear Completed',
      'Remove all completed tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            setTodos(todos.filter(todo => !todo.completed));
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Stats
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  // Render each todo item
  const renderTodo = ({ item }) => (
    <View style={[styles.todoItem, darkMode && styles.darkTodoItem]}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
        onLongPress={() => editTodo(item)}
      >
        <View style={styles.checkboxContainer}>
          <View style={[
            styles.checkbox,
            item.completed && styles.checkboxChecked,
            darkMode && styles.darkCheckbox,
          ]}>
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </View>
        
        <View style={styles.todoTextContainer}>
          <Text
            style={[
              styles.todoText,
              item.completed && styles.todoTextCompleted,
              darkMode && styles.darkTodoText,
            ]}
            numberOfLines={2}
          >
            {item.text}
          </Text>
          <Text style={styles.todoDate}>
            {item.createdAt}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.todoActions}>
        <TouchableOpacity
          onPress={() => editTodo(item)}
          style={styles.actionButton}
        >
          <Ionicons
            name="pencil"
            size={22}
            color={darkMode ? '#64b5f6' : '#2196f3'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => deleteTodo(item.id)}
          style={styles.actionButton}
        >
          <Ionicons
            name="trash"
            size={22}
            color={darkMode ? '#ef5350' : '#f44336'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, darkMode && styles.darkTitle]}>
            📱 Phone Todo App
          </Text>
          <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
            Made 100% on mobile!
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.themeToggle}>
            <Ionicons
              name={darkMode ? 'moon' : 'sunny'}
              size={20}
              color={darkMode ? '#bb86fc' : '#ff9800'}
            />
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#bb86fc' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.stats, darkMode && styles.darkStats]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todos.length}</Text>
          <Text style={[styles.statLabel, darkMode && styles.darkStatLabel]}>
            Total
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.pendingNumber]}>
            {pendingCount}
          </Text>
          <Text style={[styles.statLabel, darkMode && styles.darkStatLabel]}>
            Pending
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.completedNumber]}>
            {completedCount}
          </Text>
          <Text style={[styles.statLabel, darkMode && styles.darkStatLabel]}>
            Done
          </Text>
        </View>
      </View>

      {/* Input Section */}
      <View style={[styles.inputSection, darkMode && styles.darkInputSection]}>
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="What needs to be done?"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={addTodo}
        />
        
        <TouchableOpacity
          style={[styles.addButton, darkMode && styles.darkAddButton]}
          onPress={addTodo}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBarButton, darkMode && styles.darkActionButton]}
          onPress={() => setTodos([])}
        >
          <Ionicons name="refresh" size={18} color={darkMode ? '#fff' : '#333'} />
          <Text style={[styles.actionBarText, darkMode && styles.darkActionBarText]}>
            Clear All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionBarButton, darkMode && styles.darkActionButton]}
          onPress={clearCompleted}
        >
          <Ionicons name="checkmark-done" size={18} color={darkMode ? '#fff' : '#333'} />
          <Text style={[styles.actionBarText, darkMode && styles.darkActionBarText]}>
            Clear Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      {todos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="checkmark-circle-outline"
            size={80}
            color={darkMode ? '#666' : '#ccc'}
          />
          <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>
            No tasks yet!{'\n'}
            Add your first task above.
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, darkMode && styles.darkFooterText]}>
          Built with ❤️ using React Native & Snack Expo
        </Text>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, darkMode && styles.darkModal]}>
            <Text style={[styles.modalTitle, darkMode && styles.darkModalTitle]}>
              Edit Task
            </Text>
            
            <TextInput
              style={[styles.modalInput, darkMode && styles.darkModalInput]}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  darkTitle: {
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  darkSubtitle: {
    color: '#aaaaaa',
  },
  headerRight: {
    alignItems: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkStats: {
    backgroundColor: '#1e1e1e',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  pendingNumber: {
    color: '#e74c3c',
  },
  completedNumber: {
    color: '#2ecc71',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  darkStatLabel: {
    color: '#aaaaaa',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    height: '100%',
  },
  inputSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  darkInputSection: {
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkInput: {
    backgroundColor: '#1e1e1e',
    color: 'white',
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#3498db',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  darkAddButton: {
    backgroundColor: '#2980b9',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  actionBarButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkActionButton: {
    backgroundColor: '#1e1e1e',
  },
  actionBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  darkActionBarText: {
    color: 'white',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkTodoItem: {
    backgroundColor: '#1e1e1e',
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCheckbox: {
    borderColor: '#444',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  darkTodoText: {
    color: 'white',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  todoDate: {
    fontSize: 11,
    color: '#95a5a6',
  },
  todoActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 26,
  },
  darkEmptyText: {
    color: '#666',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  darkFooterText: {
    color: '#666',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  darkModal: {
    backgroundColor: '#1e1e1e',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  darkModalTitle: {
    color: 'white',
  },
  modalInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  darkModalInput: {
    backgroundColor: '#2d2d2d',
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});