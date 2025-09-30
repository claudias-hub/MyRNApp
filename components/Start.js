// components/Start.js //

import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { signInAnonymously } from "firebase/auth";
import { auth } from '../firebase';   // pre-initialized getAuth() from firebase.js

// Predefined color swatches for chat background
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

// Start screen component where user enters name and picks chat background color
const Start = ({ navigation }) => {
  // Controlled state: username text input
  const [name, setName] = useState('');  
  // Controlled state: selected chat background color
  const [selectedColor, setSelectedColor] = useState(colors[0]); 

  // Called when "Go to Chat" is pressed
  const onStartChatting = () => {
    if (!name.trim()) return; // Prevent empty usernames
    
    // Log user in anonymously with Firebase Auth
    // "auth" here was created using getAuth(app) in firebase.js
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', {
          userId: result.user.uid,
          name,
          color: selectedColor,
        });
      })
      .catch(() => {
        Alert.alert("Unable to sign in anonymously. Please try again later.");
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
    {/* Background image */}
    <ImageBackground
      source={require('../assets/frank-leuderalbert-PfUw6vlPc3M-unsplash.jpg')} // your background image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* App title */}
          <Text style={styles.title} accessibilityRole="header">
            Welcome to Chat App!
          </Text>

          {/* Input field - user types their display name */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Type your username here'
            placeholderTextColor="#137aa3ff"
            accessible={true}
            accessibilityLabel="Username input"
            accessibilityHint="Enter your username here to join the chat"
            accessibilityRole="text"
            accessibilityState={{ invalid: !name.trim() }}
          />

          {/* Let user choose background color */}
          <Text style={styles.colorText}>Choose Background Color:</Text>
          {/* Color picker buttons */}
            <View style={styles.colorOptions}
            accessible={true}
            accessibilityRole="radiogroup"
            accessibilityLiveRegion="polite"
         >
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityLabel={`Select background color ${color}`}
                  accessibilityState={{ selected: selectedColor === color }}
                  accessibilityHint="Select this color as your chat background"
                />
              ))}
            </View>

          {/* Action button → proceeds to Chat */}
          <TouchableOpacity
            style={styles.button}
            onPress={onStartChatting}
            disabled={!name.trim()}  // disable if name is empty
            accessibilityState={{ disabled: !name.trim() }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go to Chat Room"
            accessibilityHint="Joins chat with chosen username and background"
          >
            <Text style={styles.buttonText}>Go to Chat-Room</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // dark overlay for readability
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // semi-transparent white background for readability
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#137aa3ff',
    marginBottom: 20,
    textAlign: 'center',
  },

  textInput: {
    height: 50,
    borderColor: '#137aa3ff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#137aa3ff',
    marginBottom: 20,
  },

  colorText: { 
    fontSize: 16, 
    color: '#137aa3ff', 
    marginBottom: 10 },

  colorOptions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 },

  colorCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: 'transparent' },

  colorCircleSelected: { 
    borderColor: '#000' },

  button: {
    backgroundColor: '#137aa3ff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#137aa380', // lighter with opacity
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Start;