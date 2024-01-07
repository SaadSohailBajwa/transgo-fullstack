import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserStartLocation,
  setUserDestinationLocation,
} from "../../../../../slices/locationSlice";
import BackButton from "../../../../components/buttons/BackButton";

const DestinationLocation = ({ navigation }) => {
  const { userStartLocation, userCurrentLocation, userDestinationLocation } =
    useSelector((state) => state.userLocation);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => {
          navigation.navigate("StartEndLocation");
        }}
        title={"Destination Location"}
      />
      <View style={styles.innerContainer}>
        <GooglePlacesAutocomplete
          placeholder="Enter Start Location"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          query={{
            key: process.env.GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          styles={{
            container: {
              flex: 0,
              marginBottom: 10,
            },
            listView: {
              backgroundColor: "#FFF", // Background color for the suggestions list
              borderRadius: 8,
              marginTop: 10,
            },
            separator: {
              height: 1,
              backgroundColor: "#E0E0E0", // Separator color
            },
            textInput: {
              fontSize: 26,
              backgroundColor: "#F4F4F4", // Text input background color
              borderRadius: 8,
            },
          }}
          onPress={(data, details = null) => {
            navigation.navigate("StartEndLocation");
            dispatch(setUserDestinationLocation(null));
            dispatch(
              setUserDestinationLocation({
                location: details?.geometry?.location,
                description: data.description,
              })
            );
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          onFail={(error) => console.error(error)}
        />
      </View>
    </View>
  );
};

export default DestinationLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFF", // Background color for the entire component
  },
  innerContainer: {
    paddingTop: 100,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    color: "#333333", // Header text color
    paddingBottom: 10,
  },
});
