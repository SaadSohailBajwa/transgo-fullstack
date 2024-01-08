import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import axios from "axios";

import RideOption from "../../../components/user/RideOption";

import {
  setUserCurrentLocation,
  setUserStartLocation,
} from "../../../../slices/locationSlice";
import ReviewModal from "../../../components/RatingModal";
import { setReviewModal } from "../../../../slices/modalSlice";

const UserHome = ({ navigation }) => {
  const { token, firstName } = useSelector((state) => state.token);
  const { userCurrentLocation, userStartLocation, userDestinationLocation } =
    useSelector((state) => state.userLocation);

  const { reviewModal } = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  useEffect(() => {
    const updateLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        console.log("status granted", status);
        // const location = await Location.getCurrentPositionAsync({});
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          maximumAge: 10000,
        });
        console.log("pop-up displayed", status);
        const { latitude, longitude } = location.coords;

        // Update the driver's location in Redux
        dispatch(
          setUserCurrentLocation({
            location: {
              lat: latitude,
              lng: longitude,
            },
          })
        );
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };

    // Update the location every 10 seconds (adjust the interval as needed)
    // const intervalId = setInterval(updateLocation, 2000);

    // // Clean up the interval on component unmount
    // return () => {
    //   clearInterval(intervalId);
    // };

    // for (let index = 0; index < 1; index++) {
    //

    // }
    //
    updateLocation();
  }, []);
  // }, [dispatch]);

  // useEffect(() => {
  //   console.log("userCurrentLocationnnnnnnnnnnn:", userCurrentLocation);
  // }, [userCurrentLocation]);

  return (
    <View style={styles.container}>
      <Text>Welcome {firstName} to Home</Text>

      <RideOption
        text1="Book Ride"
        text2="book a vehicle of your need"
        navigation={navigation}
        navigateTo="StartEndLocation"
      />

      <RideOption
        text1="Object Estimation"
        text2="book a vehicle of your need"
        navigation={navigation}
        navigateTo="AIPicture"
      />

      <ReviewModal
        isVisible={reviewModal}
        onClose={() => dispatch(setReviewModal(false))}
      />
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
    paddingTop: 50,
  },
});
