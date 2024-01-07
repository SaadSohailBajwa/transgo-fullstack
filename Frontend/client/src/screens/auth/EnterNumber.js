import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import PhoneNumberInput from "../../components/auth/PhoneNumberInput";
import { useSelector, useDispatch } from "react-redux";
import { setPhoneNumberExist } from "../../../slices/phoneNumberSlice";
import axios from "axios";
import { useState } from "react";

//constants
import Colors from "../../../constants/Colors";
import Urls from "../../../constants/Urls";
import BackButton from "../../components/buttons/BackButton";


const EnterNumber = ({ navigation }) => {
  const dispatch = useDispatch();
  const { phoneNumber, phoneNumberExist, phoneNumberValid } = useSelector(
    (state) => state.phoneNumber
  );
  const {mode} = useSelector((state)=>state.mode);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateNumber = async () => {
    try {
      const response = await axios.post(
        `http://${Urls.auth}/auth/user/validateNumber`,
        { phoneNumber: phoneNumber,
          type:mode}
      );
      dispatch(setPhoneNumberExist(response.data));

      if (response.data && isValidPhoneNumber(phoneNumber)) {
        navigation.navigate("Login");
      } else {
        navigation.navigate("Register");
      }

      console.log("Data:", response.data);
      console.log("phoneNumberExist", phoneNumberExist);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const isValidPhoneNumber = (num) => {
    const regex = /^03[0-9]{9}$/;
    return regex.test(num);
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}

    >
      <BackButton/>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ color: "black", fontSize: 40, fontWeight: "bold",marginTop:40 }}>
          Enter Your Phone Number
        </Text>
        <Text style={{ color: "grey", fontSize: 20, marginVertical: 20 }}>
          You will receive an OTP on this number shortly
        </Text>

        <View>
          <PhoneNumberInput attemptedSubmit={attemptedSubmit} />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            { opacity: !phoneNumberValid ? 0.5 : 1 },
          ]}
          disabled={!phoneNumberValid}
          onPress={() => {
            validateNumber();
            // console.log(phoneNumberExist);
            //navigation.navigate(phoneNumberExist? "Login" : "Register");
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </View>
  );
};

export default EnterNumber;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    
    backgroundColor: Colors.primary,
    marginHorizontal: 0, // Side margins
    marginBottom: 20, // Bottom margin
    borderRadius: 15, // Makes the button corners rounded
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
});

// const styles = StyleSheet.create({
//   continueButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     height: 50,
//     backgroundColor: Colors.primary,
//     marginHorizontal: 0, // Side margins
//     marginBottom: 20, // Bottom margin
//     borderRadius: 15, // Makes the button corners rounded
//     shadowColor: "#000", // Optional: Add a shadow for elevation
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 25,
//   },
// });
