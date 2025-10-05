// components/CustomActions.js //

import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userId }) => {
  const actionSheet = useActionSheet();

  // Generate unique reference string for uploaded images
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userId}-${timeStamp}-${imageName}`;
  };

  
  // Upload image to Firebase Storage and send as message
  const uploadAndSendImage = async (imageURI) => {
    try {
      console.log("Starting upload for:", imageURI);

      const uniqueRefString = generateReference(imageURI);
      console.log("Firebase ref:", uniqueRefString);

      const newUploadRef = ref(storage, uniqueRefString);

      const response = await fetch(imageURI);
      const blob = await response.blob();
      console.log("Blob size:", blob.size);

      const snapshot = await uploadBytes(newUploadRef, blob);
      console.log("Upload snapshot:", snapshot.metadata);

      const imageURL = await getDownloadURL(snapshot.ref);
      console.log("Image URL:", imageURL);

      const imageMessage = {
        _id: new Date().getTime().toString(),
        createdAt: new Date(),
        text: "",
        user: { _id: userId },
        image: imageURL,
      };

      onSend([imageMessage]); // ✅ wrap in array!
    } catch (error) {
      console.error("Full upload error object:", JSON.stringify(error, null, 2));

      if (error.code && error.code.includes("storage/")) {
        Alert.alert(
          "Upload Error",
          `Firebase Storage error: ${error.code}`
        );
      } else {
        Alert.alert(
          "Error uploading or sending image",
          error.message || "Unknown failure"
        );
      }
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

  // Get user's location
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
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      },
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