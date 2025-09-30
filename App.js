// App.js //

import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler } from "react-native";

// Import app screens/components
import Welcome from "./components/Welcome";
import Start from "./components/Start";
import Chat from "./components/Chat";
   
// Firestore db instance (initialized in firebase.js)
import { db } from "./firebase"; 

// Patch BackHandler to support old removeEventListener calls
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (type, handler) => {
    return BackHandler.removeListener?.(type, handler);
  };
}

const Stack = createStackNavigator();

// Root App component manages navigation between screens
const App = () => {
  return (
    <NavigationContainer>
      {/* Define available screens */}
      <Stack.Navigator initialRouteName="Welcome">

        {/* Intro splash screen */}
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>

        {/* Start screen - user enters name & picks color */}
        <Stack.Screen name="Start" component={Start} options={{ title: "Start Chat" }} />

        {/* Chat screen - receives user info via route params */}
        <Stack.Screen 
          name="Chat"
          options={{
            windowSoftInputMode: 'adjustPan',
            title: 'Chat'
          }}
        >
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
 );
};

export default App;