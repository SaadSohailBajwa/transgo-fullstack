import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../../../../slices/jwtSlice";
import { setPhoneNumber } from "../../../../slices/phoneNumberSlice";
import { setIsLoggedIn } from "../../../../slices/jwtSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../../../constants/Colors";

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { firstName, email, phoneNumber } = useSelector((state) => state.token);
  const user = {
    name: firstName,
    email: email,
    phoneNumber: phoneNumber,
  };

  

  const logout = async () => {
    // Logout logic here
    dispatch(setToken(""));
    dispatch(setPhoneNumber(""));
    dispatch(setIsLoggedIn(false))
    await AsyncStorage.setItem("refresh","")
    alert("Logged out successfully!");
    navigation.navigate("Welcome");
  };

  const openTermsAndConditions = () => {
    // Logic to open the terms and conditions link
    console.log(firstName);
    alert("Opening terms and conditions...");
  };

  const renderEditableField = (label, value, iconName, onPress) => {
    return (
      <TouchableOpacity style={styles.editableField} onPress={onPress}>
        <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
          <Feather name={iconName} size={24} color="black" />
          <Text style={styles.label}>{label}</Text>
        </View>
        
        <View style={styles.fieldContainer}>
          
          <Text style={styles.value}>{value}</Text>
          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <MaterialCommunityIcons name={"account"} size={94} color="#A5A5A5" />
      <Text style={styles.header}>{user.name}</Text>
      </View>
      

      {/* {renderEditableField("Name:", user.name, "edit", () => {
        // Logic for editing name
        alert("Editing Name...");
      })} */}

      <View style={styles.bottomContainer}>
        <Text style={{ alignSelf: "flex-start" }}>Personal Info</Text>
        <View style={styles.bottomInnerContainer}>
          
        {renderEditableField(" Email:", user.email, "mail", () => {
          // Logic for editing email
          alert("Editing Email...");
        })}

        {renderEditableField(
          " Phone Number:",
          user.phoneNumber,
          "phone",
          () => {
            // Logic for editing phone number
            alert("Editing Phone Number...");
          }
        )}
        </View>
        
      </View>

      <View style={styles.bottomContainer}>
        <Text style={{ alignSelf: "flex-start" }}>Personal Info</Text>
        <View style={styles.bottomInnerContainer}>
          {renderEditableField(" Terms and Conditions", "", "file-text", () => {
            // Logic for editing email
            alert("Editing Email...");
          })}
          {renderEditableField(" HELP", "", "help-circle", () => {
            // Logic for editing email
            alert("Editing Email...");
          })}

          {renderEditableField(" LOGOUT", "", "log-out", logout)}
        </View>

        {/* <Button title="Logout" onPress={logout} />
      <Text style={styles.link} onPress={openTermsAndConditions}>
        Terms and Conditions
      </Text> */}
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop:80,
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
  value: {
    fontSize: 18,
    marginRight: 10,
  },
  editableField: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: Colors.input,
    height: 50,
    padding: 10,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    fontSize: 16,
    marginVertical: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
  topContainer: {
    width: "100%",
    height: "auto",
    borderRadius: 20,
    marginBottom: 100,
    padding: 1,
    justifyContent: "center",
    overflow: "hidden", // Add this line to hide overflowing content
  },
  bottomInnerContainer: {
    width: "100%",
    height: "auto",
    borderRadius: 30,
    padding: 1,
    justifyContent: "center",
    overflow: "hidden", // Add this line to hide overflowing content
  },
  bottomContainer: {
    
    bottom: 30,
    width: "100%",
    height: "auto",
  },
});
