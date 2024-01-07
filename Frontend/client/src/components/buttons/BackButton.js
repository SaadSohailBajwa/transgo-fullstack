import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

const BackButton = ({ onPress, icon, title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <TouchableOpacity onPress={onPress} >
        <AntDesign
          name={icon || "arrowleft"}
          size={30}
          color={Colors.primary}
        />
      </TouchableOpacity>
      </View>
      
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  button: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "white",
    position: "absolute",
    top: 30,
    left: 10,
    zIndex:1,
  },
  titleContainer: {
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor:"white",
    height:50,
    paddingTop:3
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default BackButton;
