import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useEffect, useMemo, useState} from 'react'
import UserMap from './UserMap'
import { useDispatch, useSelector } from 'react-redux'
import { io } from "socket.io-client";
import Urls from '../../../constants/Urls';
import BackButton from '../buttons/BackButton';
import { useNavigation } from "@react-navigation/native";
import { setDriverCurrentLocation, setUserDestinationLocation, setUserStartLocation } from '../../../slices/locationSlice';
import RideMap from './RideMap';
import { setRideResponse,setShowChat,setChatNotification, setReviewModal } from '../../../slices/modalSlice';
import { setNearestDrivers, setRideData, setRideDriverId, setRideShipmentId,setRideState } from '../../../slices/dataSlice';
import RideProgressBar from './RideProgressBar';
import Chat from '../driver/Chat';
import Colors from '../../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideStart = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [eventState, setEventState] = useState("accept");
  const { rideDriverId, rideData, rideShipmentId } = useSelector(
    (state) => state.data
  );
  const { driverCurrentLocation } = useSelector((state) => state.userLocation);

  const {id} = useSelector(state=>state.token)
  const {chatNotification} = useSelector(state => state.modal)
  
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

  useEffect(() => {
    socket.connect();
    socket.on("connect", async () => {
      console.log("connect to user backend with driverid: ", rideDriverId);
      await AsyncStorage.setItem("rideStatus","active")
    });

    socket.on("driverLocation", (data) => {
      // console.log("driverLocation event: ", data);
      setLocation(data);
      dispatch(setDriverCurrentLocation(data));
    //   console.log("driver lat", driverCurrentLocation?.lat);
    });
    socket.on("response", async (response) => {
      console.log("response after connecting with driver is: ", response);
      if (response == "reject") {
        navigation.navigate("UserTabs");
        alert("driver cancelled the ride");
        socket.disconnect()
        await AsyncStorage.setItem("rideStatus","")
      }
    });

    socket.on("event", (event) => {
      console.log(
        "user app got event which was triggered by driverAPP: ",
        event
      );
      setEventState(event);
      dispatch(setRideState(event))
      if (event == "completed") {
        alert("ride completed");
        dispatch(setRideData(null));
        // dispatch(setRideDriverId(null));
        dispatch(setRideShipmentId("0"));
        dispatch(setNearestDrivers(null));
        dispatch(setUserStartLocation(null));
        dispatch(setUserDestinationLocation(null));
        dispatch(setReviewModal(true))
        navigation.navigate("UserTabs");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("driverLocation");
      socket.off("response");
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

      <RideProgressBar event={eventState} />

      <Text style={styles.eventStateText}>{eventState}</Text>

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
            dispatch(setChatNotification(false))
          }}
        >
          <Chat socket={socket} from={id} to={rideDriverId} />
          <View>
            {chatNotification && <View style={styles.dot} />}
            
            <Text style={styles.buttonText}>Chat</Text>
          </View>
        </TouchableOpacity>
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

export default RideStart;