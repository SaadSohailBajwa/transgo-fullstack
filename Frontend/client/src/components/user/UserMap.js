import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import {
  setUserDistance,
  setUserDuration,
} from "../../../slices/locationSlice";

const UserMap = () => {
  const {
    userCurrentLocation,
    userStartLocation,
    userDestinationLocation,
    userDistance,
    userDuration,
  } = useSelector((state) => state.userLocation);
  const dispatch = useDispatch();

  const mapRef = useRef(null);

  //changes map view when start and/or destination entered so both points can be view on screen
  useEffect(() => {
    if (!userStartLocation) {
      return;
    }
    if (!userDestinationLocation) {
      mapRef.current.fitToSuppliedMarkers(["start", "destination"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
      return;
    }

    console.log("value of location changed");
    mapRef.current.fitToSuppliedMarkers(["start", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [userStartLocation, userDestinationLocation?.location?.lat]);

  useEffect(() => {
    if (!userStartLocation || !userDestinationLocation) {
      return;
    }
    const getTravelTime = async () => {
      try {
        const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${userStartLocation.description}&destinations=${userDestinationLocation.description}&key=${process.env.GOOGLE_MAPS_APIKEY}`;
        const response = await axios.get(URL);

        console.log("response", response?.data?.rows[0].elements[0]);
        dispatch(setUserDistance(response?.data.rows[0].elements[0]));

        console.log(userDistance?.distance.text);
        console.log(userDistance?.duration.text);
      } catch (err) {
        console.log("error get Travel time inside userMap: ", err);
      }
    };
    getTravelTime();
  }, [userStartLocation, userDestinationLocation]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapType="standard"
        maxZoomLevel={18}
        initialRegion={{
          latitude: userCurrentLocation?.location.lat || "31.4806",
          longitude: userCurrentLocation?.location.lng || "74.3198",
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        region={{
          latitude: userCurrentLocation?.location.lat || "31.4806",
          longitude: userCurrentLocation?.location.lng || "74.3198",
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        {userStartLocation && userDestinationLocation && (
          <MapViewDirections
            origin={userStartLocation.description}
            destination={userDestinationLocation.description}
            apikey={process.env.GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#123b66"
          />
        )}

        {userCurrentLocation?.location && (
          <Marker
            coordinate={{
              latitude:
                userStartLocation?.location.lat ||
                userCurrentLocation?.location.lat,
              longitude:
                userStartLocation?.location.lng ||
                userCurrentLocation?.location.lng,
            }}
            title={userStartLocation ? "start location" : "current location"}
            description={
              userStartLocation?.description || userCurrentLocation?.description
            }
            identifier="start"
          />
        )}

        {userDestinationLocation && (
          <Marker
            coordinate={{
              latitude: userDestinationLocation?.location.lat,
              longitude: userDestinationLocation?.location.lng,
            }}
            title={userDestinationLocation && "destination"}
            description={userDestinationLocation?.description}
            identifier="destination"
          />
        )}
      </MapView>
    </View>
  );
};

export default UserMap;

const styles = StyleSheet.create({});
