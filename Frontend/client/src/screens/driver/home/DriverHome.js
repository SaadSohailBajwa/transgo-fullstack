import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";



import MapView, { Marker } from "react-native-maps";

import {
  setUserCurrentLocation,
  setUserDestinationLocation,
  setUserStartLocation,
} from "../../../../slices/locationSlice";
import DriverMap from "../../../components/driver/DriverMap";
import SwitchButton from "../../../components/driver/SwitchButton";
import RideRequestModal from "../../../components/driver/RideRequestModal";
import { setId } from "../../../../slices/jwtSlice";
import axios from "axios";
import Urls from "../../../../constants/Urls";
import { setRideData, setRideDriverId, setRidePhase, setRideShipmentId, setRideState } from "../../../../slices/dataSlice";




const DriverHome = ({ navigation }) => {
  
  const [showMap,setShowMap]=useState(false)
  const { token, firstName } = useSelector((state) => state.token);
  // console.log(token)
  const { userCurrentLocation, userStartLocation, userDestinationLocation } =
    useSelector((state) => state.userLocation);

    const{rideData}= useSelector(state=>state.data)
  const dispatch = useDispatch();

  const fetchRide = async () => {
    const id = await AsyncStorage.getItem("id");
    dispatch(setId(id));
    
    try{
      const response = await axios.get(
        `http://${Urls.driver}/driver/info/shipment/all/${id}`,
        {
          headers:{
            token:token,
          },
        }
      );
      const ongoingRide = response.data.find(
        (ride)=>
          ride.status !== "completed" && ride.status !=="cancelled"
        )
      console.log("ongoingRide inside DriverHome fetchRide func:",ongoingRide)

      if(ongoingRide){
        console.log("ongoing exists")
        
        if (ongoingRide.status == "loaded" || ongoingRide.status == "reached") {
          dispatch(setRidePhase("two"));
        }
        dispatch(setRideShipmentId(ongoingRide.id));
        dispatch(setRideDriverId(ongoingRide.driver_id))
        
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
        dispatch(setUserStartLocation(start_location))
        dispatch(setUserDestinationLocation(destination_location))
        // {"destinationLat": "31.5214752", "destinationLng": "74.3305956", "driverId": "0f57dffc-61f8-49fd-a49d-47add615a8a4", "shipmentId": "1c9998c0-d3a3-4aee-b487-bf80016f7ea1", "startLat": "31.5071461", "startLng": "74.3196071", "userId": "66fbb8e5-ccc6-4e32-8c8d-a44bd088401d"}
        const rideData = {
          destinationLat: destination_location.dest_lat,
          destinationLng: destination_location.dest_lng,
          driverId: ongoingRide.driver_id,
          shipmentId: ongoingRide.id,
          startLat: start_location.start_lat,
          startLng: start_location.start_lng,
          userId: ongoingRide.user_id,
        };
        dispatch(setRideData(rideData))
        dispatch(setRideState(ongoingRide.status));

      }

      setShowMap(true)
    }catch(err){
      console.log("error inside fetchRide in DriverHome screen")
    }
  };

  useEffect(()=>{
    fetchRide()
  },[])

  return (
    
      <View style={styles.container}>
      
      

      <View style={styles.map}>
       <DriverMap/>
        
      </View>
      <View style={styles.switch}>
        <SwitchButton/>
      </View>

      <RideRequestModal/>
      
    </View>
  
    
    
  );
};

export default DriverHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  switch: {
    position: "absolute",
    top: 20, // Adjust the bottom position as needed
    width:"100%",
    padding: 16,
    
  },
});
