// Chat.js: Displays chat messages and syncs them with Firestore in real-time

import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, Text, Alert } from 'react-native';
import { GiftedChat, Bubble, Actions, SystemMessage, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Chat screen — all users see and write in this one room
const Chat = ({ route, navigation, isConnected }) => {
  
  // Route params (set in Start.js)
  const { userId= "unknown", name = "Anonymous", color = "#fff" } = route.params || {};

  // State: all messages loaded from Firestore
  const [messages, setMessages] = useState([]);

  // Set the screen title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });
  }, [name, navigation]);

  // Load cached messages first
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Error loading cached messages: ", error);
    }
  };

  // Save messages locally whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("messages", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages: ", error);
      }
    };
    if (messages.length > 0) saveMessages();
  }, [messages]);

  // Subscribe in real-time to messages collection
    useEffect(() => {
      let unsubscribe;

      if (isConnected) {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const newMessages = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
              user: data.user,
            };
          });
          setMessages(newMessages);
          try {
            await AsyncStorage.setItem("messages", JSON.stringify(newMessages));
          } catch (e) {
            console.log("Failed to save messages", e);
          }
        });
      } else {
        loadCachedMessages();
      }

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [isConnected]);

  // Called when user sends a new message → save to Firestore
  const onSend = useCallback(async (newMessages = []) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...newMessages[0], // take the first message
        createdAt: serverTimestamp(), // force consistent server time
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      Alert.alert("Failed to send message. Please try again.");
    }
  }, []);

  // Customize bubbles: use background color per-user or side
  const renderBubble = (props) => {
    const { key, ...rest } = props; // strip key
    const { currentMessage } = rest;
    const bubbleColor = currentMessage?.user?.color || (rest.position === 'right' ? '#137aa3' : '#f0f0f0');
    const textColor = currentMessage?.user?.color ? '#fff' : (rest.position === 'right' ? '#fff' : '#000');

    return (
      <Bubble
        {...rest}  // no key here anymore
        wrapperStyle={{
          right: { backgroundColor: bubbleColor },
          left: { backgroundColor: bubbleColor },
        }}
        textStyle={{
          right: { color: textColor },
          left: { color: textColor },
        }}
      />
    );
  };

  // Custom action button (placeholder for future features e.g. send image)
  const renderActions = (props) => {
    const { key, ...rest } = props; // strip key
    return (
      <Actions
        {...rest}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        icon={() => <Text style={styles.actionText}>+</Text>}
        options={{
          'Send Image': () => console.log('Send Image pressed'),
          Cancel: () => {},
        }}
      />
    );
  };

  // Custom system message style
  const renderSystemMessage = (props) => {
    const { key, ...rest } = props; // strip key
    return (
      <SystemMessage
        {...rest}
        wrapperStyle={{ backgroundColor: 'transparent' }}
        textStyle={{ color: '#fff', fontWeight: 'bold' }}
      />
    );
  };

  // Custom input toolbar with Android-specific spacing
  const renderInputToolbar = (props) => {
    const { key, ...rest } = props; // strip key
    if (isConnected) return <InputToolbar {...rest} />;
    return null;
  };

  // Main render
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color || '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: userId, name }} // identify logged-in user
          renderBubble={renderBubble}
          renderActions={renderActions}
          renderSystemMessage={renderSystemMessage}
          renderInputToolbar={renderInputToolbar}
          alwaysShowSend={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionText: {
    color: '#137aa3',
    fontSize: 20,
    lineHeight: 20,
  },
});

export default Chat;