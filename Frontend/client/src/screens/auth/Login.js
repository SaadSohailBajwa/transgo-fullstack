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

import { setIsLoggedIn } from "../../../slices/jwtSlice";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage"

const Login = () => {
  const { phoneNumber } = useSelector((state) => state.phoneNumber);
  const { mode } = useSelector((state) => state.mode);
  const navigation = useNavigation();
  
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
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

  const setRefreshToken = async (refreshToken) => {
    await AsyncStorage.setItem("refresh",refreshToken)
    console.log("refresh token stored in async storage is:", refreshToken);
  }
  const setMode = async(mode) =>{
    await AsyncStorage.setItem("mode",mode)
  }
  const setId = async(id)=>{
    await AsyncStorage.setItem("id",id)
  }
  const getRefreshToken = async ()=>{
    const refreshToken = await AsyncStorage.getItem("refresh")
    console.log("refresh token got from async storage is:",refreshToken)
  }

  const loginRequest = async () => {
    try {
      const response = await axios.post(
        `http://${Urls.auth}/auth/user/login`,
        {
          phoneNumber: phoneNumber,
          password: formData.password,
          type:mode
        }
      );
      setMode(mode)
      //dispatch(setPhoneNumberExist(response.data));
      console.log("status:", response.status);
      if (response.status === 200) {
        dispatch(setToken(response.data));
        setRefreshToken(response.data.refreshToken)
        setId(response.data.id)
        getRefreshToken()
        let modeCapital = "";
        if (mode == "driver") {
          modeCapital = "Driver";
          console.log(modeCapital);
          
          response.data.verified?
          // navigation.navigate(`${modeCapital}Tabs`)
          navigation.reset({
            index: 0,
            routes: [{ name: `${modeCapital}Tabs` }],
          })
          :
          navigation.navigate("DriverPending")

        } else {
          modeCapital = "User";
          // navigation.navigate(`${modeCapital}Tabs`);
          navigation.reset({
            index: 0,
            routes: [{ name: `${modeCapital}Tabs` }],
          });
          dispatch(setIsLoggedIn(true))
        }
        
        
      }
      //

      console.log("Data:", response.data);
      console.log("verified:", response.data.verified);
    } catch (error) {
      console.error("Error posting data:", error);

      if (error.response.status === 401) {
        //if wrong pass then logic here
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
          Login
        </Text>
        <Text style={{ color: "grey", fontSize: 20, marginVertical: 10 }}>
          Enter Your Password to Login
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Input
            placeholderText="Enter your password"
            label="Password"
            iconName="lock"
            value={formData.email}
            onChange={(text) => handleInputChange("password", text)}
            password={true}
            error={error}
            errorMessage={"Incorrect Password"}
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            loginRequest();
            //navigation.navigate(phoneNumberExist? "Login" : "Register");
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Login;

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
