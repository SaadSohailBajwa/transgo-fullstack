import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";

import {
  setUserStartLocation,
  setUserDestinationLocation,
  setUserDistance,
} from "../../../../../slices/locationSlice";
import UserMap from "../../../../components/user/UserMap";
import ContinueButton from "../../../../components/buttons/ContinueButton";
import BackButton from "../../../../components/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../../../../constants/Colors";

const StartEndLocation = () => {
  const navigation = useNavigation();
  const {
    userStartLocation,
    userCurrentLocation,
    userDestinationLocation,
    userDistance,
  } = useSelector((state) => state.userLocation);
  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState(true);
  const [destinationState, setDestinationState] = useState(null);

  //sets user start&destination location to null every time this screen is rendered
  useEffect(() => {
    dispatch(setUserStartLocation(null));
    dispatch(setUserDestinationLocation(null));
    dispatch(setUserDistance(null));
  }, []);
  useEffect(()=>{
if(userStartLocation == null || userDestinationLocation == null){
    setDisabled(true)
  }else{
    setDisabled(false)
  }
  },[userStartLocation,userDestinationLocation])
  

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.navigate("UserTabs")} />

      <View style={styles.map}>
        <UserMap />
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <View style={styles.dot} />
          <View style={styles.verticalBar} />
          <View style={styles.square} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => navigation.navigate("StartLocation")}
          >
            <Text style={styles.locationButtonText} numberOfLines={2}>
              {userStartLocation ? (
                userStartLocation.description
              ) : (
                <View style={styles.locationButtonTextView}>
                  <MaterialIcons
                    name="search"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text style={styles.locationButtonText}>
                    Enter Start Location
                  </Text>
                </View>
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => navigation.navigate("DestinationLocation")}
          >
            
              {userDestinationLocation ? (
                <Text style={styles.locationButtonText} numberOfLines={2}>
                  {userDestinationLocation.description}
                </Text>
              ) : (
                <View style={styles.locationButtonTextView}>
                  <MaterialIcons
                    name="search"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text style={styles.locationButtonText}>
                    Enter Destination Location
                  </Text>
                </View>
              )}
           
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <ContinueButton
          text={"Select Ride"}
          onPress={() => navigation.navigate("RideType")}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 3 / 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    
  },
  locationIconContainer: {
    flexDirection: "column",
    marginRight: 12,
    alignItems: "center",
    padding: 10,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: "black",
    marginBottom: 4,
    marginTop: 15,
    backgroundColor: Colors.primary,
  },
  verticalBar: {
    width: 2,
    height: 80,
    backgroundColor: "black",
    marginBottom: 4,
    backgroundColor: Colors.primary,
  },
  square: {
    width: 15,
    height: 15,
    backgroundColor: "black",
    marginBottom: 15,
    backgroundColor: Colors.primary,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column", // Ensure buttons are stacked vertically
  },
  locationButton: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
    margin:10,
  },
  locationButtonText: {
    // Adjusted font size
    color: Colors.primary,
    fontSize: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  locationButtonTextView:{
    flexDirection:"row",
    paddingLeft:20,
    alignItems:"center"
  }
});

export default StartEndLocation;