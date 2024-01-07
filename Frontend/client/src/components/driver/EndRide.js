import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const EndRide = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>reached destination button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EndRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    height: 55,
    borderWidth: 0.5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    backgroundColor: "white",
  },
  button: {
    width: "50%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
