import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import {
  setRideRequestModal,
  setRideResponse,
} from "../../../slices/modalSlice";
import {
  setRideData,
  setRideShipmentId,
  setRideState,
} from "../../../slices/dataSlice";
import { setUserCurrentLocation } from "../../../slices/locationSlice";
import Urls from "../../../constants/Urls";

import { io } from "socket.io-client";
import StartRide from "./StartRide";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserLocation from "./UserLocation";


//this makes/starts the connection

const SwitchButton = () => {
  const [isOnline, setIsOnline] = useState(false);

  const dispatch = useDispatch();
  const { userCurrentLocation } = useSelector((state) => state.userLocation);
  const { rideResponse } = useSelector((state) => state.modal);
  const { id } = useSelector((state) => state.token);
  const { rideData, rideState, rideShipmentId } = useSelector(
    (state) => state.data
  );

  
  const socket = useMemo(() => {
    
    return io(`http://${Urls.driver}`, {
      autoConnect: false,
      query: { driverId: id },
    });
  }, [id]);

  //change location interval here
  useEffect(() => {
    let locationUpdateInterval;

    const startLocationUpdates = async () => {
      locationUpdateInterval = setInterval(async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // Update the current location in Redux
          dispatch(
            setUserCurrentLocation({
              location: {
                lat: latitude,
                lng: longitude,
              },
            })
          );

          // console.log("state is online: ", isOnline);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      }, 1000); // Update location every 10 seconds (adjust as needed)
    };

    const stopLocationUpdates = () => {
      clearInterval(locationUpdateInterval);
    };

    if (isOnline) {
      startLocationUpdates();
    } else {
      stopLocationUpdates();
    }

    // Cleanup interval when the component is unmounted or online status changes
    return () => {
      stopLocationUpdates();
    };
  }, [isOnline, dispatch]);

  useEffect(() => {
    // console.log("userCurrentLocationnnnnnnnnnnn:", userCurrentLocation, id);
    socket.emit("current_location", userCurrentLocation, id);
  }, [userCurrentLocation]);

  useEffect(() => {
    if (rideResponse) {
      socket.emit("response", rideResponse, rideData);
      console.log("driver response sent to backend: ", rideResponse);
      dispatch(setRideResponse(null));
      // dispatch(setRideData(null));
    }
    return () => {
      socket.off("response");
    };
  }, [rideResponse]);

  useEffect(()=>{
    if(rideState!=="offline"){
      setIsOnline(true)
    }
  },[rideState])

  useEffect(() => {
    
    
    if (isOnline) {
      socket.connect();

      //this runs whenever connection is made
      //this itself does not make connection
      socket.on("connect", () => {
        console.log("connected to backend socket");
        console.log(id);
      });

      socket.on("request", (data) => {
        // set data to redux and display modal
        console.log(
          "weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee just goooot request for a ride :",
          data
        );
        dispatch(setRideRequestModal(true));
        dispatch(setRideData(data));
        dispatch(setRideShipmentId(data.shipmentId));
      });

      socket.on("cancel", (data) => {
        console.log("driver app cancel data:", data);
        if (data.response == "reject") {
          dispatch(setRideState("online"));
          dispatch(setRideData(null));
          alert("the ride has been cancelled");
        }
      });

      // socket.emit("join_room",id)
    } else {
      socket.disconnect();
      console.log("disconnect from backend socket");
    }
  

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("join_room");
      socket.off("request");
      socket.off("response");
      socket.off("cancel");
    };
  }, [isOnline]);

  useEffect(() => {
    if (rideState !== "online") {
      // alert("rideState: ",rideState)
      socket.emit("event", rideState, rideShipmentId, rideData?.driverId);
      console.log("message sent to event event of socket");
      if (rideState == "completed") {
        dispatch(setRideState("online"));
        dispatch(setRideData(null));
      }
    }
  }, [rideState]);

  if (rideState == "online" || rideState === "offline") {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                isOnline
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "red" },
              ]}
              onPress={() => {
                setIsOnline(false);
                dispatch(setRideState("offline"));
              }}
            >
              <Text
                style={[
                  isOnline ? { color: "black" } : { color: "white" },
                  { fontSize: 20, fontWeight: 500 },
                ]}
              >
                Offline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                isOnline
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "white" },
              ]}
              onPress={() => {
                setIsOnline(true);
                dispatch(setRideState("online"));
              }}
            >
              <Text
                style={[
                  isOnline ? { color: "white" } : { color: "black" },
                  { fontSize: 20, fontWeight: 500 },
                ]}
              >
                Online
              </Text>
            </TouchableOpacity>
          </View>
          {/* <UserLocation isOnline={isOnline}/> */}
        </View>
      </>
    );
  } else {
    return (
      <View>
        <StartRide socket={socket} />
        {/* <UserLocation isOnline={isOnline} /> */}
      </View>
    );
  }
};

export default SwitchButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    height: 55,
    borderWidth: 0.5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    backgroundColor: "white",
  },
  button: {
    width: "50%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
