import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { GiftedChat, Bubble, Actions, SystemMessage } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

// Chat screen component: paste/replace this file at components/Chat.js
const Chat = ({ route }) => {
  const { name, color } = route.params || {}; // get name and selected color from Start screen
  const [messages, setMessages] = useState([]);

  // Preload two messages: a normal user message and a system message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello Developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'You have entered the chat',
        createdAt: new Date(),
        system: true, // system message (appears centered, no bubble)
      },
    ]);
  }, []);

  // onSend: append new messages to state using GiftedChat.append
  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const renderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      wrapperStyle={{ backgroundColor: 'transparent' }}
      textStyle={{ color: '#fff', fontWeight: 'bold' }}
    />
  );

  // Customize the message bubbles: sender = right, others = left
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000', // your sent messages (black)
        },
        left: {
          backgroundColor: '#fff', // received messages (white)
        },
      }}
      textStyle={{
        right: { color: '#fff' },
        left: { color: '#000' },
      }}
    />
  );

  // Optional: custom action button (small example) — add accessibility props here
  // GiftedChat will show this button left of the input; you can add file/image actions later.
  const renderActions = (props) => (
    <Actions
      {...props}
      accessibilityLabel="More options"
      accessibilityHint="Lets you choose to send an image or your geolocation."
      accessibilityRole="button"
      icon={() => (
        <Text style={styles.actionText}>+</Text>  // Just the icon, no TouchableOpacity here
      )}
      options={{
        'Send Image': () => console.log('Send Image pressed'),
        Cancel: () => {},
      }}
      optionTintColor="#222"
    />
  );

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: color || '#fff' }}>
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: 1, name }}
        renderBubble={renderBubble}
        renderActions={renderActions}
        keyboardShouldPersistTaps="handled"
        renderSystemMessage={renderSystemMessage}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  </SafeAreaView>
)};

const styles = StyleSheet.create({
  container: { flex: 1 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#137aa3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },
});

export default Chat;