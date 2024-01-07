import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../../constants/Colors';
import { AntDesign } from "@expo/vector-icons";

//disabled logic tbd
const ContinueButton = ({text,onPress,disabled}) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.continueButton,
          { opacity: disabled ? 0.5 : 1 },
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{text}</Text>
        <View>
          <AntDesign
            name="arrowright"
            size={30}
            color="white"
            style={{ paddingLeft: 10 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ContinueButton

const styles = StyleSheet.create({
  
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: Colors.primary,
    marginHorizontal: 20, // Side margins
    marginBottom: 20, // Bottom margin
    borderRadius: 25, // Makes the button corners rounded
    shadowColor: "#000", // Optional: Add a shadow for elevation
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: "white",
    fontSize: 25,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 5,
  },
});