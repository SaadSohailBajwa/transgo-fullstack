import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import RideMap from "../../../components/user/RideMap";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Urls from "../../../../constants/Urls";
import BackButton from "../../../components/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { setId } from "../../../../slices/jwtSlice";
import {
  setDriverCurrentLocation,
  setUserDestinationLocation,
  setUserStartLocation,
} from "../../../../slices/locationSlice";

import {
  setRideResponse,
  setShowChat,
  setChatNotification,
  setReviewModal,
} from "../../../../slices/modalSlice";
import {
  setNearestDrivers,
  setRideData,
  setRideDriverId,
  setRideShipmentId,
  setRideState
} from "../../../../slices/dataSlice";

import RideProgressBar from "../../../components/user/RideProgressBar";
import Chat from "../../../components/driver/Chat";
import Colors from "../../../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ReviewModal from "../../../components/RatingModal";

const RideStartScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [eventState, setEventState] = useState("started");
  const [showReview,setShowReview] = useState(false)
  const { rideDriverId, rideData, rideShipmentId,rideState } = useSelector((state) => state.data);
  const { token } = useSelector((state) => state.token);

  const { driverCurrentLocation } = useSelector((state) => state.userLocation);

  const { id } = useSelector((state) => state.token);
  const { chatNotification } = useSelector((state) => state.modal);

  // console.log("rideDriverId: ", rideDriverId);
  const dispatch = useDispatch();

  const socket = useMemo(() => {
    return io(`http://${Urls.user}`, {
      autoConnect: false,
      query: {
        userId: rideDriverId || "",
        destinationLat: "",
        destinationLng: "userDestinationLocation.location.lng",
        startLat: "userStartLocation.location.lat",
        startLng: "userStartLocation.location.lng",
        driverId: null,
      },
    });
  }, [rideDriverId]);









  const fetchRides = async () => {
    const id = await AsyncStorage.getItem("id");
    dispatch(setId(id));
    console.log("id and token:", id);
    console.log(`http://${Urls.user}/user/info/shipment/all/${id}`);

    try {
      const response = await axios.get(
        `http://${Urls.user}/user/info/shipment/all/${id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      const filteredRides = response.data.filter(
        (ride) =>
          ride.status !== "offline" &&
          ride.status !== "accept" &&
          ride.status !== "cancelled"
      );
      // setData(filteredRides);
      console.log("response from fetch rides is:", response.data[0]);

      const ongoingRide = response.data.find(
        (ride) =>
          ride.status !== "completed" &&
          ride.status !== "cancelled" &&
          ride.status !== "offline" 
          
      );
console.log("ongoing inside rideStartScreen",ongoingRide);
      if (ongoingRide) {
        // Found an ongoing ride
        
        dispatch(setId(id));
        dispatch(setRideShipmentId(ongoingRide.id));
        dispatch(setRideDriverId(ongoingRide.driver_id));
        const start_location = {
          location: {
            lat: ongoingRide?.start_lat,
            lng: ongoingRide?.start_lng,
          },
        };
        const destination_location = {
          location: {
            lat: ongoingRide?.dest_lat,
            lng: ongoingRide?.dest_lng,
          },
        };
        dispatch(setUserStartLocation(start_location));
        dispatch(setUserDestinationLocation(destination_location));
        if (ongoingRide.status == "enroute") {
          dispatch(setRideState("accept"));
        }
        dispatch(setRideState(ongoingRide.status));
        console.log("Ongoing ride details:", ongoingRide);
        // setActiveRide(ongoingRide);
      } else {
        // No ongoing ride found
        console.log("No ongoing rides");
        // setActiveRide(null);
      }
    } catch (err) {
      console.log("error inside fetchRides RideStartScreen: ", err);
    }
  };





  useEffect(() => {
    console.log("use effect inside ridestartscreen triggered ..............")
    fetchRides()
    socket.connect();
    socket.on("connect", async () => {
      console.log("connect to user backend with driverId: ", rideDriverId);
      await AsyncStorage.setItem("rideStatus", "active");
    });

    socket.on("driverLocation", (data) => {
      // console.log("driverLocation event on client side: ", data);
      setLocation(data);
      dispatch(setDriverCurrentLocation(data));
      // console.log("driver lat", driverCurrentLocation?.lat);
    });
    socket.on("response", async (response) => {
      console.log("response after connecting with driver is: ", response);
      if (response == "reject") {
        dispatch(setRideData(null));
        dispatch(setRideDriverId(null));
        dispatch(setRideShipmentId("0"));
        dispatch(setNearestDrivers(null));
        dispatch(setUserStartLocation(null));
        dispatch(setUserDestinationLocation(null));
        dispatch(setReviewModal(true))
        navigation.navigate("UserTabs");
        alert("driver cancelled the ride");
        socket.disconnect();
        await AsyncStorage.setItem("rideStatus", "");
      }
    });

    socket.on("event", (event) => {
      console.log(
        "uuuuser app got event which was triggered by driverAPP: ",
        event
      );
      

      setEventState(event);
      
      
      if(event){
        dispatch(setRideState(event))
      }
      
      
      if (event == "completed") {
        alert("ride completed");
        dispatch(setRideData(null));
        dispatch(setRideDriverId(null));
        dispatch(setRideShipmentId("0"));
        dispatch(setNearestDrivers(null));
        dispatch(setUserStartLocation(null));
        dispatch(setUserDestinationLocation(null));
        setShowReview(true)
        navigation.navigate("UserTabs");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("driverLocation");
      socket.off("response");
      socket.off("event")
    };
  }, []);

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => {
          // ... your existing code
          socket.disconnect()
          navigation.navigate("UserTabs");
        }}
      />

      <View style={styles.mapContainer}>
        <RideMap />
      </View>

      <RideProgressBar event={rideState} />

      <Text style={styles.eventStateText}>{rideState}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("StartQR");
          }}
        >
          <Text style={styles.buttonText}>Start QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("EndQR");
          }}
        >
          <Text style={styles.buttonText}>End QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch(setShowChat(true));
            dispatch(setChatNotification(false));
          }}
        >
          <Chat socket={socket} from={id} to={rideDriverId} />
          <View>
            {chatNotification && <View style={styles.dot} />}

            <Text style={styles.buttonText}>Chattt</Text>
          </View>
        </TouchableOpacity>
        <Text>{eventState}</Text>
        {/* <ReviewModal isVisible={showReview} onClose={()=>setShowReview(false)}/> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 3 / 4,
  },
  eventStateText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  rideStartText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
  },
  chatContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: "black",
    marginBottom: 4,
    marginTop: 15,
    backgroundColor: Colors.primary,
    top: -5,
    right: -5,
    position: "absolute",
  },
});

export default RideStartScreen;
