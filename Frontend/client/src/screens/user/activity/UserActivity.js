import { StyleSheet, Text, View, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import Activity from "../../../components/user/Activity";
import axios from "axios";
import Urls from "../../../../constants/Urls";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActiveRide from "../../../components/user/ActiveRide";
import { setRideDriverId,setRideShipmentId,setRideState } from "../../../../slices/dataSlice";
import { setId } from "../../../../slices/jwtSlice";
import { setUserStartLocation,setUserDestinationLocation } from "../../../../slices/locationSlice";


const UserActivity = () => {
  
  // const id = getId = async()=>{
  //   await AsyncStorage.getItem("id")
  // }
  const dispatch = useDispatch()
  const {token} = useSelector(state=>state.token)
  const {rideShipmentId} = useSelector(state=>state.data)
  const [data,setData] = useState("")
  const [activeRide,setActiveRide] = useState(null)
  const [refresh,setRefresh] = useState(false)
  
  const fetchRides = async ()=>{
      const id = await AsyncStorage.getItem("id");
      dispatch(setId(id))
      console.log("id and token:",id,token)
      console.log(`http://${Urls.user}/user/info/shipment/all/${id}`);

      
      try{
        const response = await axios.get(
          `http://${Urls.user}/user/info/shipment/all/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        const filteredRides = response.data.filter(
          (ride) => ride.status !== "offline" && ride.status !== "accept" && ride.status !== "cancelled"
        );
        setData(filteredRides);
        console.log("response from fetch rides is:",response.data[0])
        
const ongoingRide = response.data.find(
  (ride) => ride.status !== "completed" && ride.status !== "cancelled" && ride.status !== "offline" 
);

if (ongoingRide) {
  // Found an ongoing ride
  
  dispatch(setId(id))
  dispatch(setRideShipmentId(ongoingRide.id))
  dispatch(setRideDriverId(ongoingRide.driver_id))
  const start_location = {
    location:{
      lat:ongoingRide?.start_lat,
      lng:ongoingRide?.start_lng
    }
  }
  const destination_location = {
    location:{
      lat:ongoingRide?.dest_lat,
      lng:ongoingRide?.dest_lng
    }
  }
  dispatch(setUserStartLocation(start_location))
  dispatch(setUserDestinationLocation(destination_location))
  if(ongoingRide.status =="enroute"){
    dispatch(setRideState("accept"))
  }
  dispatch(setRideState(ongoingRide.status))
  console.log("Ongoing ride details:", ongoingRide);
  setActiveRide(ongoingRide)
} else {
  // No ongoing ride found
  console.log("No ongoing rides");
  setActiveRide(null)
}
      }catch(err){
        console.log("error inside user activity fetchRides: ",err)
      }
  }






  useEffect(()=>{
    
    fetchRides()
  },[rideShipmentId])



  return (
    <View
      style={{ backgroundColor: "white", flex: 1, paddingTop: 50, padding: 10 }}
    >
      <Text
        style={{
          color: Colors.primary,
          fontSize: 40,
          fontWeight: "bold",
          padding: 10,
        }}
      >
        Your Activity
      </Text>
      <Text
        style={{
          color: Colors.primary,
          fontSize: 30,
          fontWeight: "bold",
          padding: 10,
        }}
      >
        Active
      </Text>
      <View>
        {activeRide ? (
          <ActiveRide data={[activeRide]} />
        ) : (
          <Text
            style={{
              color: "grey",
              fontSize: 20,
              marginVertical: 10,
              padding: 10,
            }}
          >
            no current active ride{" "}
          </Text>
        )}
      </View>
      <Text
        style={{
          color: Colors.primary,
          fontSize: 30,
          fontWeight: "bold",
          padding: 10,
        }}
      >
        History
      </Text>
      <Activity data={data} fetchRides={fetchRides} />
    </View>
  );
};

export default UserActivity;

const styles = StyleSheet.create({});
