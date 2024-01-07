import React, { useState,useEffect } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { setPhoneNumber, setPhoneNumberValid } from "../../../slices/phoneNumberSlice";

import Colors from "../../../constants/Colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const PhoneNumberInput = ({ attemptedSubmit }) => {
  const dispatch = useDispatch();
  const { phoneNumber } = useSelector((state) => state.phoneNumber);

  // This is a basic validation for phone numbers
  const isValidPhoneNumber = (num) => {
    const regex = /^03[0-9]{9}$/;
    return regex.test(num);
  };

  const handleTextChange = (text) => {
    // Remove non-numeric characters
    const formattedText = text.replace(/[^0-9]/g, "");
    dispatch(setPhoneNumber(formattedText));
  };

  useEffect(() => {
    //sets redux state phoneNumberValid
    //false if not valid
    //true if valid
    if (!isValidPhoneNumber(phoneNumber) && phoneNumber.length < 11) {
      dispatch(setPhoneNumberValid(false));
      
    } else {
      dispatch(setPhoneNumberValid(true));
    }
  }, [phoneNumber]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>Phone Number</Text>
      <View style={[styles.inputContainer]}>
        {/* Assuming you have MaterialCommunityIcons imported */}
        <MaterialCommunityIcons name="phone" size={24} />
        <TextInput
          autoCorrect={false}
          onFocus={() => {}}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          style={{ flex: 1, fontSize: 25, marginLeft: 10 }}
          placeholder="03"
          maxLength={11}
        />
      </View>
      {attemptedSubmit&&!isValidPhoneNumber(phoneNumber) && phoneNumber.length < 11 && (
        <Text style={styles.errorText}>Please enter a valid phone number.</Text>
      )}
    </View>
  );
};








const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  inputContainer: {
    height: 50,
    backgroundColor: Colors.input,
    flexDirection: "row",
    paddingHorizontal: 15,
    borderWidth: 1,
    alignItems: "center",
  },
});

export default PhoneNumberInput;