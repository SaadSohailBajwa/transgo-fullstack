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

const AIPicture = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.token);
  const [image, setImage] = useState();
  const [result, setResult] = useState(null);

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
      const AIText = await AIResult.text();
      console.log(AIText, "lllllllllllll");

      setResult(AIText);
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
          <TouchableOpacity style={styles.confirmButton}>
            <MaterialCommunityIcons name="check" size={24} color="white" />
            <Text style={styles.confirmButtonText}>Confirm Picture</Text>
          </TouchableOpacity>
        )}
        {result && <Text>{result}</Text>}
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
