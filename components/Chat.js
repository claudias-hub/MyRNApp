// /components/Chat.js //

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import 'react-native-reanimated';

// Chat screen component displaying messages and input box
const Chat = ({ route }) => {
  const { name, color } = route.params;  // get user name and chosen background color from navigation params
  const [messages, setMessages] = useState([]); // array of chat messages
  
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: { _id: 2, name: 'React Native', avatar: 'https://placeimg.com/140/140/any' }
      },
      {
        _id: 2,
        text: 'You have entered the chat',
        createdAt: new Date(),
        system: true
      }
    ]);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
  };

  const renderBubble = (props) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#000' }, // your messages
          left: { backgroundColor: '#FFF' }   // others
        }}
        textStyle={{ right: { color: '#fff' }, left: { color: '#000' } }}
      />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color || '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1, name }}
        renderBubble={renderBubble}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Chat;