import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

const RideProgressBar = ({ event }) => {
  const getProgressBarColor = (currentEvent, targetEvent) => {
    const eventOrder = {
      accept:0,
      started: 1,
      loaded: 2,
      reached: 3,
      completed: 4,
    };

    return eventOrder[currentEvent] >= eventOrder[targetEvent]
      ? Colors.primary 
      : Colors.input   
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: getProgressBarColor(event, "accept") },
        ]}
      />
      <View
        style={[
          styles.progressBar,
          { backgroundColor: getProgressBarColor(event, "started") },
        ]}
      />
      <View
        style={[
          styles.progressBar,
          { backgroundColor: getProgressBarColor(event, "loaded") },
        ]}
      />
      <View
        style={[
          styles.progressBar,
          { backgroundColor: getProgressBarColor(event, "reached") },
        ]}
      />
      <View
        style={[
          styles.progressBar,
          { backgroundColor: getProgressBarColor(event, "completed") },
        ]}
      />
    </View>
  );
};

// Rest of the component...


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 20,
    borderColor: Colors.primary, // Set border color to red
    borderWidth: 1, // Set border width to create the border effect
    marginHorizontal: 2,
    borderRadius:50,
  },
  label: {
    textAlign: "center",
    marginTop: 4,
  },
});

export default RideProgressBar;

