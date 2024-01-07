import { StyleSheet, Text, View, Button,Image } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../../../../slices/jwtSlice";
import { setPhoneNumber } from "../../../../slices/phoneNumberSlice";
import { useNavigation } from "@react-navigation/native";
import { setIsLoggedIn } from "../../../../slices/jwtSlice";
import RideRequestModal from "../../../components/driver/RideRequestModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Urls from "../../../../constants/Urls";

const DriverProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const { firstName, email, phoneNumber,id } = useSelector((state) => state.token);
  // const user = {
  //   name: firstName,
  //   email: email,
  //   phoneNumber: phoneNumber,
  // };

  const logout = async() => {
    // Logout logic here
    dispatch(setToken(""));
    dispatch(setPhoneNumber(""));
    dispatch(setIsLoggedIn(false))
    await AsyncStorage.setItem("refresh", "");
    alert("Logged out successfully!");
    navigation.navigate("Welcome");
  };

  const openTermsAndConditions = () => {
    // Logic to open the terms and conditions link
    alert("Opening terms and conditions...");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: `${Urls.s3}/profile-picture/${id}` } } style={styles.image}/>
      
      {/* <MaterialCommunityIcons name={"account"} size={94} color="#A5A5A5" /> */}
      <Text>{phoneNumber}</Text>

      <Button title="Logout" onPress={logout} />
      <Text style={styles.link} onPress={openTermsAndConditions}>
        Terms and Conditions
      </Text>
    </View>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  link: {
    fontSize: 16,
    marginVertical: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
  image: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    borderRadius: 100, // Optional: Add border radius for a rounded appearance
  },
});
