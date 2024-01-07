import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState,useMemo,useEffect } from "react";
import Colors from "../../../../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import ContinueButton from "../../../../components/buttons/ContinueButton";
import RideStart from "../../../../components/user/RideStart";

import { useSelector,useDispatch } from "react-redux";
import { setRideDriverId,setRideShipmentId,setRideState } from "../../../../../slices/dataSlice";

import { useNavigation } from "@react-navigation/native";
import Urls from "../../../../../constants/Urls";
import { io } from "socket.io-client";
import BackButton from "../../../../components/buttons/BackButton";




const DATA = [
  {
    license_plate: "123",
    firstname: "john",
    multiplier: 1,
    vehicle_picture_url: "https://links.papareact.com/7pf",
  },
  {
    license_plate: "456",
    firstname: "smith",
    multiplier: 1.15,
    vehicle_picture_url: "https://links.papareact.com/7pf",
  },
  {
    license_plate: "789",
    firstname: "smallings",
    multiplier: 5,
    vehicle_picture_url: "https://links.papareact.com/7pf",
  },
  {
    license_plate: "101112",
    firstname: "bigshow",
    multiplier: 1.75,
    vehicle_picture_url: "https://links.papareact.com/7pf",
  },
];



const SelectDriver = () => {
  const { userDistance,userStartLocation,userDestinationLocation } = useSelector((state) => state.userLocation);
  const {firstName,id} = useSelector((state)=>state.token)
  const { nearestDrivers,rideDriverId,rideShipmentId } = useSelector((state) => state.data);
  const [selected, setSelected] = useState(null);
  const [rideType, setRideType] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(false);
  const [driverResponse,setDriverResponse] = useState("");
  const dispatch = useDispatch()


  const navigation = useNavigation();


  const profilePictureBaseUrl = (id) => `https://transgo.s3.me-south-1.amazonaws.com/profile-picture/${id}`;


  const socket = useMemo(() => {
    return io(`http://${Urls.user}`, {
      autoConnect: false,
      query: {
        userId: id||"",
        destinationLat: userDestinationLocation.location.lat,
        destinationLng: userDestinationLocation.location.lng,
        startLat: userStartLocation.location.lat,
        startLng: userStartLocation.location.lng,
        driverId: selected?.driver_id,
      },
    });
  }, [selected?.driver_id]);

  useEffect(() => {
    console.log("selected driver id changed: ", selected?.driver_id);
    dispatch(setRideDriverId(selected?.driver_id));
    console.log(rideDriverId);
  }, [selected]);


  useEffect(()=>{
    // socket.connect();
    socket.on("connect", () => {
      console.log("user connected to user backend");
      
    });
    if(cancelRequest){
      socket.on("response",(response,shipmentId)=>{
        dispatch(setRideShipmentId(shipmentId))
        if(response=="accept"){
          dispatch(setRideState("accept"))
        }
        console.log("response from driver is: ",response,"of shipment id: ",rideShipmentId)
        alert(`rider ${response}ed`)
        setDriverResponse(response)
        
        if (response == "reject" || response == "busy") {
          socket.disconnect();
          navigation.navigate("RideType");
        }
      })
    }

    return ()=>{
      socket.off('connect')
      socket.off('disconnect')
      socket.off('response')
    }
  },[cancelRequest])

  

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelected((selected) => item);
          setRideType(item.firstname);
          console.log("ride firstname: " + rideType);
          console.log("selected driver id: ", selected?.driver_id);
        }}
        style={[
          styles.itemContainer,
          selected?.license_plate === item.license_plate && styles.selectedItem,
        ]}
      >
        <View>
          <Text
            style={[
              selected?.license_plate === item.license_plate && {
                color: Colors.primary,
              },
            ]}
          >
            license plate :{" "}
          </Text>
          <Text
            style={[
              styles.cardText,
              selected?.license_plate === item.license_plate && {
                color: Colors.primary,
              },
            ]}
          >
            {item.license_plate}
          </Text>
          <Text
            style={[
              selected?.license_plate === item.license_plate && {
                color: Colors.primary,
              },
            ]}
          >
            first name:{" "}
          </Text>
          <Text
            style={[
              styles.cardText,
              selected?.license_plate === item.license_plate && {
                color: Colors.primary,
              },
            ]}
          >
             {item.firstname}
          </Text>
        </View>
        <View>
          <Image
            style={{ width: 100, height: 100, resizeMode: "contain" }}
            source={{ uri: profilePictureBaseUrl(item?.driver_id) }}
          />
          <Text>Rating</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  if(driverResponse === 'accept'){
    socket.disconnect()
    return <RideStart/>
    // navigation.navigate("RideStartScreen")
  }else{
    return (
      <View style={{
          backgroundColor: "white",
          flex: 1,
         
          
        }}>
        <BackButton onPress={
          ()=>{
            socket.disconnect()
            navigation.navigate("RideType")
          }
      }
      title={"Select Driver"}/>

      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          borderColor: "black",
          padding: 10,
          paddingTop:80,
          
        }}
      >
        
        <FlatList
          data={nearestDrivers}
          keyExtractor={(item) => item.license_plate}
          renderItem={renderItem}
        />

        {cancelRequest ? (
          <ContinueButton
            text={"cancel request"}
            onPress={() => {
              socket.disconnect();
              socket.on("disconnect", () => {
                console.log("user disconnected from backend");
              });
              navigation.navigate("RideType");
            }}
          />
        ) : (
          <ContinueButton
            text={"request driver"}
            onPress={() => {
              socket.connect();
              
              console.log(
                firstName,
                userStartLocation.location,
                userStartLocation.description,
                userDestinationLocation.location,
                userDistance,
                rideType
              );
              setCancelRequest(!cancelRequest);
            }}
            disabled={!selected}
          />
        )}
      </View>
      </View>
      
    );
  }

  
};

export default SelectDriver;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "space-between",
  },
  vehicle_picture_url: {
    height: "70%",
    width: "100%",
  },
  welcomeText: {
    fontSize: 25,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: Colors.primary,
    marginHorizontal: 20, // Side margins
    marginBottom: 20, // Bottom margin
    borderRadius: 15, // Makes the button corners rounded
    shadowColor: "#000", // Optional: Add a shadow for elevation
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: "white",
    fontSize: 25,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: Colors.input,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: Colors.primary,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedItem: {
    borderColor: Colors.primary,
    borderWidth: 5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",

    color: Colors.primary,
  },
});
