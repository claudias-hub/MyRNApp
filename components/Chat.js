// /components/Chat.js //

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';

const Chat = ({ route }) => {
  const { name, color } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  // Add a new message
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: name,
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Render each message
  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === name ? styles.myMessage : styles.otherMessage]}>
      <Text style={[styles.messageText, item.sender !== name && styles.otherMessageText]}>{item.text}</Text>
      <Text style={styles.messageSender}>{item.sender}</Text>
      <Text style={styles.messageTimestamp}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color || '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messagesList: { padding: 10 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#137aa3ff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  otherMessageText: {
  color: '#000', // black text for otherMessage
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageSender: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
    textAlign: 'right',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 2,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#137aa3ff',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#137aa3ff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Chat;