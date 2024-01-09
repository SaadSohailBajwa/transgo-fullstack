import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../../../components/buttons/BackButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { setProfilePicture } from "../../../../../slices/dataSlice";
import * as FileSystem from "expo-file-system";
import Urls from "../../../../../constants/Urls";
import { decode } from "base64-arraybuffer";
import axios from "axios";
import { setNearestDrivers } from "../../../../../slices/dataSlice";



const determineRideType = (jsonString) => {
  try {
    // Remove triple backticks from the string
    const cleanedString = jsonString.replace(/```json|```|json/g, "");
    console.log("cleaned ",cleanedString)
    const data = JSON.parse(cleanedString);
    console.log("Parsed JSON:", data);
    const dimensions = data.dimensions;
    const weight = data.weight;
    
    if (dimensions && weight) {
      const { length, width, height } = dimensions;
      // Assuming dimensions are in inches, convert them to cubic centimeters
      const totalDimensions = length * 2.54 * width * 2.54 * height * 2.54;
      

      if (totalDimensions <= 457200 && weight <= 2) {
        
        return "bike";
      } else if (totalDimensions <= 785400 && weight <= 3.5) {
        
        return "rikshaw";
      } else if (totalDimensions <= 1135200 && weight <= 7) {
        
        return "small";
      } else {
        
        return "large";
      }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
  }

  return "Unable to determine ride type";
};












const AIPicture = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.token);
  const { userDistance, userStartLocation } = useSelector(
    (state) => state.userLocation
  );
  const [image, setImage] = useState();
  const [result, setResult] = useState(null);
  const [rideType, setRideType] = useState(null);
  const { nearestDrivers, rideObject } = useSelector((state) => state.data);

  const saveImage = async (image) => {
    console.log("SAVING IMAGE!");
    setImage(image.assets[0].uri);
    try {
      const base64Content = await FileSystem.readAsStringAsync(
        image.assets[0].uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      const imageArrayBuffer = decode(base64Content);

      const signedURL = await axios.get(
        `http://${Urls.driver}/driver/aws/get/signedurl/AI-picture`,
        {
          headers: {
            token,
          },
        }
      );

      const AIPictureUrl = await axios.put(
        signedURL.data.url,
        imageArrayBuffer,
        {
          headers: {
            "Content-Type": "image/jpeg",
          },
        }
      );

      // result
      console.log(AIPictureUrl.config.url.split("?")[0], "aaaa");
      const AIResult = await fetch(
        `http://${Urls.driver}/driver/AI?url=${
          AIPictureUrl.config.url.split("?")[0]
        }`
      );
      // http://20.118.211.142:3002/driver/AI?url=https://transgo.s3.me-south-1.amazonaws.com/AI-picture/2b28c012-35b5-4e6c-9bea-4b8bb3703b08
      const AIText = await AIResult.text();
      console.log(AIText, "lllllllllllll");

      setResult(AIText);
      setRideType(determineRideType(AIText))
    } catch (err) {
      console.log("Error inside saveImage in AIPicture", err);
    }
  };

  const handleTakePicture = async () => {
    console.log("Taking a picture...");
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });
      if (!result.canceled) {
        await saveImage(result);
        console.log("result:", result.assets[0].uri);
      }
    } catch (err) {
      console.log("Error inside handleTakePicture in AIPicture", err);
    }
  };

  const handleUploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });
      if (!result.canceled) {
        await saveImage(result);
      }
    } catch (err) {
      console.log("error inside image handleUploadImage in AI Pciture", err);
    }
    console.log("Uploading an image...");
  };












  const searchDriver = async () => {
    try {
      console.log(token);
      const response = await axios.get(
        `http://${Urls.nearest}/nearest/search`,
        {
          params: {
            lat: userStartLocation?.location?.lat,
            lng: userStartLocation?.location?.lng,
            radius: "1000",
            type: rideType,
          },
          headers: {
            token: token, // Include the JWT token in the Authorization header
          },
        }
      );
      if (response.status === 200) {
        dispatch(setNearestDrivers([response.data?.[0]]));
        console.log(response.data?.[0])
        navigation.navigate("SelectDriver");
      } else if (response.status === 403) {
      }

      console.log("he;o", nearestDrivers);
    } catch (err) {
      console.log("error is:", err);
    }
  };












  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.navigate("UserTabs")}
        title={"AI Picture"}
      />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>AI Picture</Text>
        {image && <Image style={styles.image} source={{ uri: image }} />}
        {image && (
          <TouchableOpacity style={styles.confirmButton} onPress={searchDriver}>
            <MaterialCommunityIcons name="check" size={24} color="white" />
            <Text style={styles.confirmButtonText}>Confirm Picture</Text>
          </TouchableOpacity>
        )}
        {result && <Text>{result} ride type: {determineRideType(result)} rideType state: {rideType}</Text>}
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
          <MaterialCommunityIcons
            name="camera"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
          <MaterialCommunityIcons
            name="image"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AIPicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  bottomButtonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
