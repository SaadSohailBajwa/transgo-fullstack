import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Input from "../../components/auth/Input";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setToken } from "../../../slices/jwtSlice";

//constants
import Colors from "../../../constants/Colors";
import Urls from "../../../constants/Urls";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = ({ navigation }) => {
  const { phoneNumber } = useSelector((state) => state.phoneNumber);
  const { mode } = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [validEmailError, setValidEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  //states for forms
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function isValidEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  const registerRequest = async () => {

    let allFieldsValid = true;

    if (!formData.firstName) {
      setFirstNameError(true);
      allFieldsValid = false;
    } else {
      setFirstNameError(false);
    }

    if (!formData.lastName) {
      setLastNameError(true);
      allFieldsValid = false;
    } else {
      setLastNameError(false);
    }

    if (!formData.email) {
      setEmailError(true);

      allFieldsValid = false;
    } else {
      setEmailError(false);
      
    }

    if (!formData.password) {
      setPasswordError(true);
      allFieldsValid = false;
    } else {
      setPasswordError(false);
    }

    if(!isValidEmail(formData.email)){
      setValidEmailError(true)
      allFieldsValid = false
    }else{
      setValidEmailError(false)
    }

    // If any field is invalid, return early
    if (!allFieldsValid) {
      return;
    }

    try {
      const response = await axios.post(
        `http://${Urls.auth}/auth/user/register`,
        {
          phoneNumber: phoneNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          type:mode
        }
      );
      //dispatch(setPhoneNumberExist(response.data));

      if (response.status === 200) {
        console.log("user registered successfully");
        dispatch(setToken(response.data));
        let modeCapital = ""
        if(mode==="driver"){
          modeCapital="Driver"
          console.log(modeCapital)
          navigation.navigate(`${modeCapital}Info`);
        }else{
          modeCapital="User"
          navigation.navigate(`${modeCapital}Tabs`);
        }
        
      }

      console.log("Data:", response.data);
    } catch (error) {
      //navigation.navigate("EnterNumber");

      console.error("Error posting data:", error);

      if (error.response.status === 401) {
        //if wrong email then logic here
        setError(true);
      }

      
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ color: "black", fontSize: 40, fontWeight: "bold" }}>
          Register
        </Text>
        <Text style={{ color: "grey", fontSize: 20, marginVertical: 10 }}>
          Enter Your Details to Register
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Input
            placeholderText="Enter your First Name"
            label="First Name"
            iconName="account"
            value={formData.email}
            onChange={(text) => handleInputChange("firstName", text)}
            error={firstNameError}
            errorMessage={"first name cannot be empty"}
          />

          <Input
            placeholderText="Enter your Last Name"
            label="Last Name"
            iconName="account"
            value={formData.email}
            onChange={(text) => handleInputChange("lastName", text)}
            error={lastNameError}
            errorMessage={"last name cannot be empty"}
          />

          <Input
            placeholderText="Enter your email"
            label="Email"
            iconName="email"
            value={formData.email}
            onChange={(text) => handleInputChange("email", text)}
            error={emailError ? emailError : error}
            errorMessage={
              error ? "Email already in use" : "email cannot be empty"
            }
          />
          {validEmailError && (
            <Text style={{ color: "red",marginTop:0 }}>
              Invalid Email
            </Text>
          )}

          <Input
            placeholderText="Enter your password"
            label="Password"
            iconName="lock"
            value={formData.email}
            onChange={(text) => handleInputChange("password", text)}
            password={true}
            error={passwordError}
            errorMessage={"password cannot be empty"}
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            registerRequest();

            //navigation.navigate(phoneNumberExist? "Login" : "Register");
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        {/* <Text style={{ color: "red", textAlign: "center" }}>
          {emailError ? "Email already exists" : ""}
        </Text> */}
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
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
