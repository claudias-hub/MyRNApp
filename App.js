// App.js //

import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler, Alert, StatusBar } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import SystemNavigationBar from "react-native-system-navigation-bar";

// Import app screens/components
import Welcome from "./components/Welcome";
import Start from "./components/Start";
import Chat from "./components/Chat";
   
// Firestore db instance (initialized in firebase.js)
import { db, storage, auth } from "./firebase"; 

// Patch BackHandler to support old removeEventListener calls
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (type, handler) => {
    return BackHandler.removeListener?.(type, handler);
  };
}

const Stack = createStackNavigator();

// Root App component manages navigation between screens
const App = () => {
  const connectionStatus = useNetInfo();

  // Set light status bar and navigation bar colors
  useEffect(() => {
    StatusBar.setBarStyle('dark-content'); // or 'light-content'
    SystemNavigationBar.setNavigationColor('#ffffff', 'dark'); 
  }, []);

  // Monitor connection status and enable/disable Firestore network accordingly
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.log("Anonymous sign-in failed:", e);
        }
      }
    });
    return () => sub();
  }, []);

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
          options={({ route }) => ({
            windowSoftInputMode: 'adjustPan',
            title: route.params?.name || 'Chat',
          })}
        >
          {props => (
            <Chat 
              {...props} 
              isConnected={connectionStatus.isConnected} 
              storage={storage}   
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
 );
};

export default App;