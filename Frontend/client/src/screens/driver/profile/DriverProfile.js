import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons,Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../../../../slices/jwtSlice";
import { setPhoneNumber } from "../../../../slices/phoneNumberSlice";
import { useNavigation } from "@react-navigation/native";
import { setIsLoggedIn } from "../../../../slices/jwtSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Urls from "../../../../constants/Urls";
import Colors from "../../../../constants/Colors";

const DriverProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { firstName, email, phoneNumber, id } = useSelector(
    (state) => state.token
  );

  const logout = async () => {
    dispatch(setToken(""));
    dispatch(setPhoneNumber(""));
    dispatch(setIsLoggedIn(false));
    await AsyncStorage.setItem("refresh", "");
    alert("Logged out successfully!");
    navigation.navigate("Welcome");
  };

  const openTermsAndConditions = () => {
    alert("Opening terms and conditions...");
  };

  const renderEditableField = (label, value, iconName, onPress) => {
    return (
      <TouchableOpacity style={styles.editableField} onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
      <Image
        source={{ uri: `${Urls.s3}/profile-picture/${id}` }}
        style={styles.image}
      />

      <Text style={styles.header}>{firstName}</Text>

      <View style={styles.bottomContainer}>
        <Text style={{ alignSelf: "flex-start" }}>Personal Info</Text>
        <View style={styles.bottomInnerContainer}>
          {renderEditableField(" Email:", email, "mail", () => {
            alert("Editing Email...");
          })}

          {renderEditableField(" Phone Number:", phoneNumber, "phone", () => {
            alert("Editing Phone Number...");
          })}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={{ alignSelf: "flex-start" }}>Actions</Text>
        <View style={styles.bottomInnerContainer}>
          {renderEditableField(" Terms and Conditions", "", "file-text", () => {
            alert("Editing Terms and Conditions...");
          })}
          {renderEditableField(" LOGOUT", "", "log-out", logout)}
        </View>
      </View>
    </View>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 80,
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  topContainer: {
    width: "100%",
    height: "auto",
    borderRadius: 20,
    marginBottom: 100,
    padding: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  bottomInnerContainer: {
    width: "100%",
    height: "auto",
    borderRadius: 30,
    padding: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  bottomContainer: {
    bottom: 30,
    width: "100%",
    height: "auto",
  },
});
