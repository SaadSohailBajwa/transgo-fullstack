import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import Input from "../../../../components/auth/Input";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../../../constants/Colors";
import BackButton from "../../../../components/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { setRideObject } from "../../../../../slices/dataSlice";
import ContinueButton from "../../../../components/buttons/ContinueButton";


const Dimensions = () => {
    const [weightError,setWeightError] = useState(false)
    const [lengthError, setLengthError] = useState(false);
    const [heightError, setHeightError] = useState(false);
    const [widthError, setWidthError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [formData, setFormData] = useState({
      weight:"",
      length: "",
      width: "",
      height: "",
    });
    const dispatch = useDispatch()
    const {rideObject} = useSelector(state=>state.data)
    const handleInputChange = (name, value) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      console.log(formData);
    };
    const navigation = useNavigation()

    const checkError = async () => {
      let allFieldsValid = true;

     

      if (!formData.weight) {
        setWeightError(true);
        allFieldsValid = false;
      } else {
        setWeightError(false);
      }

      

      if (!formData.length) {
        setLengthError(true);
        allFieldsValid = false;
      } else {
        setLengthError(false);
      }

      if (!formData.width) {
        setWidthError(true);
        allFieldsValid = false;
      } else {
        setWidthError(false);
      }

      if (!formData.height) {
        setHeightError(true);
        allFieldsValid = false;
      } else {
        setHeightError(false);
      }

      // If any field is invalid, return early
      if (!allFieldsValid) {
        return;
      }

      dispatch(setRideObject(formData))
      setDisabled(false)

      
    };

    useEffect(() => {
      const hasErrors = weightError || heightError || lengthError || widthError;
      setDisabled(
        hasErrors ||
          !formData.weight ||
          !formData.length ||
          !formData.width ||
          !formData.height
      );
    }, [formData, weightError, heightError, lengthError, widthError]);

  return (
    
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
        <BackButton
          title={"Object Info"}
          onPress={() => navigation.navigate("StartEndLocation")}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 80,
            paddingHorizontal: 20,
            backgroundColor: "white",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "grey", fontSize: 20, marginVertical: 10 }}>
            Enter details about the Object you want to transfer
          </Text>

          <View style={{ marginVertical: 20 }}>
            <ScrollView>
              <Text style={{ color: "grey", fontSize: 20, marginVertical: 10 }}>
                Object Dimensions
              </Text>
              <Input
                placeholderText="Enter your Object Length"
                label="Weight(KG)"
                iconName="weight-kilogram"
                value={formData.weight}
                onChange={(text) => handleInputChange("weight", text)}
                error={weightError}
                errorMessage={"*"}
              />
              <Input
                placeholderText="Enter your Object Length"
                label="Length/Depth(Inches)"
                iconName="arrow-expand"
                value={formData.length}
                onChange={(text) => handleInputChange("length", text)}
                error={lengthError}
                errorMessage={"*"}
              />
              <Input
                placeholderText="Enter your Object Height"
                label="Height(Inches)"
                iconName="arrow-expand-vertical"
                value={formData.height}
                onChange={(text) => handleInputChange("height", text)}
                error={heightError}
                errorMessage={"*"}
              />
              <Input
                placeholderText="Enter your Object Width"
                label="Width(Inches)"
                iconName="arrow-expand-horizontal"
                value={formData.width}
                onChange={(text) => handleInputChange("width", text)}
                error={widthError}
                errorMessage={"*"}
              />
            </ScrollView>
          </View>

          {/* <Text style={{ color: "red", textAlign: "center" }}>
          {licensePlate ? "Email already exists" : ""}
        </Text> */}
        </ScrollView>
        
        </KeyboardAvoidingView><View style={styles.bottomContainer}>
          <ContinueButton
            text={"Select Ride"}
            onPress={() => navigation.navigate("RideType")}
            disabled={disabled}
          />
        </View>
      </View>
    
  );
};

export default Dimensions;

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
    // backgroundColor: Colors.primary,
    borderWidth: 5,
    borderColor: Colors.primary,
  },
  selectedItemText: {
    color: Colors.primary,
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
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
});
