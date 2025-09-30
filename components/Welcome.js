// components/Welcome.js

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chat App</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Start")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 40 },
  button: {
    backgroundColor: "#137aa3ff",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

export default Welcome;