// components/Start.js //

import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// Predefined background color options for chat screen
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

// Start screen component where user enters name and picks chat background color
const Start = ({ navigation }) => {
  const [name, setName] = useState('');  // user name input state
  const [selectedColor, setSelectedColor] = useState(colors[0]);  // selected background color state

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
    {/* Background image with dark overlay */}
    <ImageBackground
      source={require('../assets/frank-leuderalbert-PfUw6vlPc3M-unsplash.jpg')} // your background image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Chat App!</Text>
          {/* Text input for user to enter their name */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Type your username here'
            placeholderTextColor="#137aa3ff"
          />
          <Text style={styles.colorText}>Choose Background Color:</Text>
          {/* Color picker buttons */}
            <View style={styles.colorOptions}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

          {/* Button to navigate to Chat screen with name and color params */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Chat', { name, color: selectedColor })}
            disabled={!name.trim()}  // disable if name is empty
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