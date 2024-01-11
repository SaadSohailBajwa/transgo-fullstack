import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapViewDirections from "react-native-maps-directions";

import MapView, { Marker } from "react-native-maps";

const DriverMap = ({ navigation }) => {
  const { token, firstName } = useSelector((state) => state.token);
  const { userCurrentLocation, userDestinationLocation } = useSelector(
    (state) => state.userLocation
  );

  const { rideData } = useSelector((state) => state.data);
  const startLocation = {
    description: "Start location",
    latitude: parseFloat(rideData?.startLat), // String representation of latitude
    longitude: parseFloat(rideData?.startLng), // String representation of longitude
  };
  const destinationLocation = {
    description: "Destination location",
    latitude: parseFloat(rideData?.destinationLat), // String representation of latitude
    longitude: parseFloat(rideData?.destinationLng), // String representation of longitude
  };

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          mapType="standard"
          maxZoomLevel={18}
          initialRegion={{
            latitude: userCurrentLocation?.location?.lat,
            longitude: userCurrentLocation?.location?.lng,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
          region={{
            latitude: userCurrentLocation?.location?.lat,
            longitude: userCurrentLocation?.location?.lng,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
        >
          {userCurrentLocation?.location && (
            <Marker
              coordinate={{
                latitude: userCurrentLocation?.location.lat,
                longitude: userCurrentLocation?.location.lng,
              }}
              title={"current location"}
              description={userCurrentLocation?.description}
              identifier="start"
            />
          )}

          {rideData && rideData.startLat && rideData.startLng && (
            <Marker
              coordinate={{
                latitude: parseFloat(rideData.startLat),
                longitude: parseFloat(rideData.startLng),
              }}
              title="Start location"
              identifier="start"
            />
          )}

          {rideData && rideData.destinationLat && rideData.destinationLng && (
            <Marker
              coordinate={{
                latitude: parseFloat(rideData.destinationLat),
                longitude: parseFloat(rideData.destinationLng),
              }}
              title="Destination location"
              identifier="destination"
            />
          )}

          {rideData && rideData.destinationLat && rideData.destinationLng && (
            <MapViewDirections
              origin={startLocation}
              destination={destinationLocation}
              apikey={"AIzaSyBO5Ejbe9ke00K0BVdD1prI24iDIu0klq4"}
              strokeWidth={5}
              strokeColor="#123b66"
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

export default DriverMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
});
