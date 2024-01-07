import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import Input from "../../components/auth/Input";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setToken } from "../../../slices/jwtSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//constants
import Colors from "../../../constants/Colors";
import Urls from "../../../constants/Urls";
// import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";

const DATA = [
  {
    id: "123",
    type: "bike",
    multiplier: 1,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "456",
    type: "rikshaw",
    multiplier: 2.15,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "789",
    type: "small",
    multiplier: 5,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "101112",
    type: "large",
    multiplier: 7.5,
    image: "https://links.papareact.com/7pf",
  },
];

const DriverInfo = ({ navigation }) => {
  const { token } = useSelector((state) => state.token);
  const { mode } = useSelector((state) => state.mode);
  const { profilePicture, licensePicture } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [cnicError, setCnicError] = useState(false);
  const [licenseNumber, setLicenseNumberError] = useState(false);
  const [licensePlate, setLicensePlateError] = useState(false);
  const [rideTypeError, setRideTypeError] = useState(false);

  const [selected, setSelected] = useState(null);
  const [rideType, setRideType] = useState(null);

  //states for forms
  const [formData, setFormData] = useState({
    cnic: "",
    licenseNumber: "",
    licensePlate: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(formData);
  };

  function isValidEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  const registerRequest = async () => {
    let allFieldsValid = true;

    if (!formData.cnic) {
      setCnicError(true);
      allFieldsValid = false;
    } else {
      setCnicError(false);
    }

    if (!formData.licenseNumber) {
      setLicenseNumberError(true);
      allFieldsValid = false;
    } else {
      setLicenseNumberError(false);
    }

    if (!formData.licensePlate) {
      setLicensePlateError(true);

      allFieldsValid = false;
    } else {
      setLicensePlateError(false);
    }

    // If any field is invalid, return early
    if (!allFieldsValid) {
      return;
    }

    const profilePictureBase64 = profilePicture?.base64Content;
    const profilePictureArrayBuffer = decode(profilePictureBase64);

    const licensePictureBase64 = licensePicture?.base64Content;
    const licensePictureArrayBuffer = decode(licensePictureBase64);

    try {
      console.log(Urls.driver);
      // const imageFormData = new FormData();
      // if (profilePicture.uri) {
      //   // Ensure the file extension is "jpg"
      //   const fileName = "profilePicture.jpeg";

      //   // Append the file with the correct content type and name
      //   imageFormData.append("profilePicture", {
      //     uri: profilePicture.uri,
      //     name: fileName,
      //     type: "image/jpeg",
      //   });
      // }

      // Append license picture if available
      // if (licensePicture.uri) {
      //   imageFormData.append("licensePicture", {
      //     uri: licensePicture,
      //     type: "image/jpeg",
      //     name: "licensePicture.jpg",
      //   });
      // }

      const response = await axios.post(
        `http://${Urls.driver}/driver/info/add`,
        {
          cnic: formData.cnic,
          licenseNumber: formData.licenseNumber,
          licensePlate: formData.licensePlate,
          type: rideType,
        },
        {
          headers: {
            token, // Include the JWT token in the Authorization header
          },
        }
      );
      console.log(response.data);
      //dispatch(setPhoneNumberExist(response.data));

      if (response.status === 200) {
        console.log("user registered successfully");
        dispatch(setToken(response.data));
        let modeCapital = "";
        if (mode === "driver") {
          modeCapital = "Driver";
          console.log(modeCapital);
        } else {
          modeCapital = "User";
        }
        // navigation.navigate(`${modeCapital}Tabs`);
        navigation.navigate(`DriverPending`);
      }

      const profilePictureSignedURL = await axios.get(
        `http://${Urls.driver}/driver/aws/get/signedurl/profile-picture`,
        {
          headers: {
            token,
          },
        }
      );
      console.log("got the signed url", profilePictureSignedURL.data.url);

      const licensePictureSignedUrl = await axios.get(
        `http://${Urls.driver}/driver/aws/get/signedurl/license-picture`,
        {
          headers:{
            token,
          },
        }
      );

      if (profilePictureSignedURL) {
        const profilePictureUrl = await axios.put(
          profilePictureSignedURL.data.url,
          profilePictureArrayBuffer,
          {
            headers: {
              "Content-Type": "image/jpeg",
            },
          }
        );
        console.log("profilePictureUrl: ", profilePictureUrl);
      }

      if(licensePictureSignedUrl){
        const licensePictureUrl = await axios.put(
          licensePictureSignedUrl.data.url,
          licensePictureArrayBuffer,
          {
            headers:{
              "Content-Type":"image/jpeg",
            }
          }
        )
        console.log("licensePictureUrl: ", licensePictureUrl);
      }

      console.log("Data:", response.data);
    } catch (error) {
      //navigation.navigate("EnterNumber");
      console.log("in err");
      console.error("Error posting data:", error);

      if (error.response.status === 500) {
        //if wrong licensePlate then logic here
        setError(true);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        selected?.id === item.id && styles.selectedItem,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setSelected(item);
          setRideType(item.type);
          console.log("ride type: " + rideType);
        }}
      >
        <Text
          style={[
            styles.rideText,
            selected?.id === item.id && styles.selectedItemText,
          ]}
        >
          Type: {item.type}
        </Text>

        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{ uri: item.image }}
        />
      </TouchableOpacity>
    </View>
  );

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
          DriverInfo
        </Text>
        <Text style={{ color: "grey", fontSize: 20, marginVertical: 10 }}>
          Enter Your Details to DriverInfo
        </Text>

        <View style={{ marginVertical: 20 }}>
          <ScrollView>
            <Input
              placeholderText="Enter your CNIC Number"
              label="CNIC"
              iconName="identifier"
              value={formData.licensePlate}
              onChange={(text) => handleInputChange("cnic", text)}
              error={cnicError}
              errorMessage={"CNIC cannot be empty"}
            />

            <Input
              placeholderText="Enter your License Number"
              label="License Number"
              iconName="card-account-details"
              value={formData.licensePlate}
              onChange={(text) => handleInputChange("licenseNumber", text)}
              error={licenseNumber}
              errorMessage={"License Number cannot be empty"}
            />

            <Input
              placeholderText="Enter your License Plate Number"
              label="License Plate Number"
              iconName="car"
              value={formData.licensePlate}
              onChange={(text) => handleInputChange("licensePlate", text)}
              error={licensePlate}
              errorMessage={"License Plate Number cannot be empty"}
            />

            <FlatList
              data={DATA}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              horizontal={true}
            />
            <Text>{rideTypeError && "please select ride type"}</Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.uploadImage}
          onPress={() => navigation.navigate("DriverLicense")}
        >
          {licensePicture ? (
            <Image
              style={styles.licensePicture}
              source={{ uri: licensePicture.uri }}
            />
          ) : (
            <Text>Driving License Photo</Text>
          )}

          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadImage}
          onPress={() => navigation.navigate("ProfilePicture")}
        >
          {profilePicture ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: profilePicture.uri }}
            />
          ) : (
            <Text>Profile Picture</Text>
          )}
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            registerRequest();
            console.log(rideType);
            rideType ? setRideTypeError(false) : setRideTypeError(true);
            //navigation.navigate(phoneNumberExist? "Login" : "DriverInfo");
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        {/* <Text style={{ color: "red", textAlign: "center" }}>
          {licensePlate ? "Email already exists" : ""}
        </Text> */}
      </ScrollView>
    </View>
  );
};

export default DriverInfo;

const styles = StyleSheet.create({
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: Colors.primary,
    marginHorizontal: 0, // Side margins
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
    backgroundColor: Colors.input,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: "row",
    marginHorizontal: 5,
  },
  selectedItem: {
    backgroundColor: Colors.primary, // Change the background color to black when selected
  },
  selectedItemText: {
    color: "white",
    fontWeight: "800",
  },
  uploadImage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  licensePicture: {
    height: 60,
    width: 80,
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
});

// cnic, licenseNumber, license_plate;
