// Chat.js: Displays chat messages and syncs them with Firestore in real-time

import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, Text, Alert } from 'react-native';
import { GiftedChat, Bubble, Actions, SystemMessage, InputToolbar } from 'react-native-gifted-chat';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// Chat screen — all users see and write in this one room
const Chat = ({ route, navigation, db }) => {
  // Route params (set in Start.js)
  const { userId, name = "Anonymous", color = "#fff" } = route.params || {};
  const insets = useSafeAreaInsets();

  // State: all messages loaded from Firestore
  const [messages, setMessages] = useState([]);

  // Set the screen title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });
  }, [name, navigation]);

  // Subscribe in real-time to messages collection
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesFirestore = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesFirestore.push({
            _id: doc.id,
            text: data.text,
            // Firestore Timestamp → JS Date for GiftedChat
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            user: data.user,
          });
        });
        setMessages(messagesFirestore);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
        Alert.alert("Failed to load messages. Please check your connection.");
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

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
  }, [name, color]);

  // Customize bubbles: use background color per-user or side
  const renderBubble = (props) => {
    const { currentMessage } = props;
    const bubbleColor = currentMessage.user.color || (props.position === 'right' ? '#137aa3' : '#f0f0f0');
    const textColor = currentMessage.user.color ? '#fff' : (props.position === 'right' ? '#fff' : '#000');

    return (
      <Bubble
        {...props}
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
  const renderActions = (props) => (
    <Actions
      {...props}
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

  // Custom system message style
  const renderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      wrapperStyle={{ backgroundColor: 'transparent' }}
      textStyle={{ color: '#fff', fontWeight: 'bold' }}
    />
  );

  // Custom input toolbar with Android-specific spacing
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        paddingBottom: Platform.OS === 'android' ? 10 : 0,
        marginBottom: Platform.OS === 'android' ? 0 : 0,
      }}
    />
  );

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