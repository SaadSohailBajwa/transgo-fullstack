import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/buttons/BackButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../constants/Colors";
import { useDispatch } from "react-redux";
import { setProfilePicture } from "../../../slices/dataSlice";
import * as FileSystem from "expo-file-system";

const ProfilePicture = ({ handleImage }) => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const dispatch = useDispatch()

  // const saveImage = async (image) => {
  //   try {
  //     
  //     dispatch(setProfilePicture(image));
  //   } catch (err) {
  //     console.log("Error inside saveImage in ProfilePicture", err);
  //   }
  // };

  const saveImage = async (image) => {
    if (handleImage) return handleImage(image);
    try {
      setImage(image.assets[0].uri);
      const base64Content = await FileSystem.readAsStringAsync(
        image.assets[0].uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      dispatch(setProfilePicture({ uri: image.assets[0].uri, base64Content }));
    } catch (err) {
      console.log("Error inside saveImage in ProfilePicture", err);
    }
  };

  const handleTakePicture = async () => {
    console.log("Taking a picture...");
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64:true,
      });
      if (!result.canceled) {
        await saveImage(result);
        console.log("result:",result.assets[0].uri)
      }
    } catch (err) {
      console.log("Error inside handleTakePicture in ProfilePicture", err);
    }
  };

  const handleUploadImage = async () => {
    try{
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:1
        })
        if(!result.canceled){
            await saveImage(result)
        }
    }catch(err){
        console.log("error inside image handleUploadImage in ProfilePicture",err)
    }
    console.log("Uploading an image...");
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.navigate("DriverInfo")}
        title={"Profile Picture"}
      />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Profile Picture</Text>
        {image && <Image style={styles.image} source={{ uri: image }} />}
        {image && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("DriverInfo")}
          >
            <MaterialCommunityIcons name="check" size={24} color="white" />
            <Text style={styles.confirmButtonText}>Confirm Picture</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
          <MaterialCommunityIcons name="camera" size={24} color={Colors.primary} />
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
          <MaterialCommunityIcons name="image" size={24} color={Colors.primary} />
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilePicture;

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
    borderWidth:1,
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
    borderRadius: 100,
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
