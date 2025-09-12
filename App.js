// App.js //

import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

// Main App component that sets up navigation between Start and Chat screens
const App = () =>{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        {/* Start screen where user enters name and picks color */}
        <Stack.Screen name="Start" component={Start} />
        {/* Chat screen showing messages; header title shows user's name */}
        <Stack.Screen 
        name="Chat" 
        component={Chat} 
        options={({ route }) => ({title: route.params.name, // show user name in header
        })}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: '88%',
    borderWidth: 1,
    height: 50,
    padding: 10
  },
  textDisplay: {
    height: 50,
    lineHeight: 50
  }
});

export default App;