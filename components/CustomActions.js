// components/CustomActions.js //
// Renders the "+" button in Gifted Chat to send images or location.
// Handles image picking, camera capture, upload to Firebase Storage,
// and sending a message with the resulting image URL.

import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRef } from 'react';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userId }) => {
  const actionSheet = useActionSheet();
  const isUploadingRef = useRef(false);

  // Generate unique reference string for uploaded images// Avoid filename collisions; tie uploads to user + timestamp
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userId}-${timeStamp}-${imageName}`;
  };

  
  // Upload a local image file to Cloud Storage and send its URL as a message
  const uploadAndSendImage = async (imageURI) => {
    if (isUploadingRef.current)return; // Prevent double-taps
    isUploadingRef.current = true;
    try {
      console.log("Starting upload for:", imageURI);
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);

      const response = await fetch(imageURI);
      const blob = await response.blob();

      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);

      const imageMessage = {
        _id: new Date().getTime().toString(),
        createdAt: new Date(),
        text: "",
        user: { _id: userId },
        image: imageURL,
      };

      onSend([imageMessage]);
    } catch (error) {
      console.error("Full upload error object:", JSON.stringify(error, null, 2));
      Alert.alert("Upload Error", error.code || error.message || "Unknown");
    } finally {
      isUploadingRef.current = false;
    }
  };
  
  // Pick an image from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Take a photo with camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Send current location; Gifted Chat renders with renderCustomView
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Show ActionSheet when "+" button pressed
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        try {
          if (buttonIndex === 0) {
            await pickImage();
            return;
          }
          if (buttonIndex === 1) {
            await takePhoto();
            return;
          }
          if (buttonIndex === 2) {
            await getLocation();
            return;
          }
        } catch (e) {
          console.log("Action error:", e);
        }
      }
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Lets you choose to send an image or your geolocation"
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;