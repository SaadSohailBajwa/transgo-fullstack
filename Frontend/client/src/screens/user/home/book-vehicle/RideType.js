import { FlatList, StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../../../constants/Colors';
import { AntDesign,Feather } from "@expo/vector-icons";
import ContinueButton from '../../../../components/buttons/ContinueButton';
import BackButton from '../../../../components/buttons/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Urls from '../../../../../constants/Urls';
import { setNearestDrivers } from '../../../../../slices/dataSlice';
import { setIsLoggedIn } from '../../../../../slices/jwtSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
  {
    id: "123",
    type: "bike",
    multiplier: 22,
    image:
      "https://media.discordapp.net/attachments/1175347370016391263/1193277802926051410/Screenshot_2024-01-06_at_11.38.16_AM-removebg-preview.png?ex=65ac218e&is=6599ac8e&hm=861f3677354e2cd0153b23969ff792150a6b2099f1fb89b0a1b5c5478cde114f&=&format=webp&quality=lossless",
    name: "Bike"  
  },
  {
    id: "456",
    type: "rikshaw",
    multiplier: 32,
    image:
      "https://transgo.s3.me-south-1.amazonaws.com/Screenshot_2024-01-06_at_11.34.23_AM-removebg-preview.png",
    name: "Auto"
  },
  {
    id: "789",
    type: "small",
    multiplier: 48,
    image:
      "https://media.discordapp.net/attachments/1175347370016391263/1193277803374837770/Screenshot_2024-01-06_at_11.39.34_AM-removebg-preview.png?ex=65ac218e&is=6599ac8e&hm=e366343bae7c655f500a5fc6a584ed2cf8d111da9b5f9949200807ddd3ef1935&=&format=webp&quality=lossless",
    name: "Small Truck"  
  },
  {
    id: "101112",
    type: "large",
    multiplier: 75,
    image:
      "https://media.discordapp.net/attachments/1175347370016391263/1193279032368828426/Screenshot_2024-01-06_at_11.44.32_AM-removebg-preview.png?ex=65ac22b3&is=6599adb3&hm=94a7dddeb740c8189cf2bcf18a78202159949bb8e4870c7c7396e298d2e3cfbe&=&format=webp&quality=lossless",
    name: "Big Truck"
  },
];


const RideType = () => {
  const {userDistance,userStartLocation} = useSelector((state)=>state.userLocation)
  const {nearestDrivers} = useSelector((state)=>state.data)
  const { token } = useSelector((state) => state.token);
  const dispatch = useDispatch()

  const [selected,setSelected] = useState(null)
  const [rideType,setRideType] = useState(null)

  const navigation = useNavigation()

  const calculatePrice = (distance, duration, multiplier) => {
    // Assuming distance is in meters, duration is in seconds, and multiplier is a numeric value
    const distanceInKilometers = distance / 1000; // Convert distance to kilometers
    const durationInMinutes = duration / 60; // Convert duration to minutes

    // Example pricing formula: price = (distance in km * price per km) + (duration in min * price per min) * multiplier
    const price = Math.floor(
      (distanceInKilometers) * multiplier
    );

    return price;
  };

  const searchDriver = async ()=>{
    try{
      console.log(token)
      const response = await axios.get(
        `http://${Urls.nearest}/nearest/search`,
        {
          params: {
            lat: userStartLocation?.location?.lat,
            lng: userStartLocation?.location?.lng,
            radius: "1000",
            type: rideType,
          },
          headers: {
            token: token, // Include the JWT token in the Authorization header
          },
        }
      );
      if(response.status === 200){
        dispatch(setNearestDrivers(response.data))
        navigation.navigate("SelectDriver");
      }else if(response.status === 403){
        
      }
      
      console.log("he;o",nearestDrivers)
    }catch(err){
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with error status:",
          err?.response?.status
        );
        console.error("Error response data:", err.response.data);
        dispatch(setIsLoggedIn(false))
        await AsyncStorage.setItem("refresh", "");
        navigation.navigate("Welcome");
        alert("session timed out");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", err.message);
      }
      console.log("error is:", err);
    }
  }


  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelected(item);
          setRideType(item.type);
          console.log("ride type: " + rideType);
        }}
        style={[
          styles.itemContainer,
          selected?.id === item.id && styles.selectedItem,
        ]}
      >
        <View>
          <Text
            style={[
              styles.priceText,
              selected?.id === item.id && {
                color: Colors.primary,
                fontSize: 40,
              },
            ]}
          >
            Rs.
            {calculatePrice(
              userDistance?.distance?.value,
              userDistance?.duration?.value,
              item.multiplier
            )}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 100, height: 100, resizeMode: "contain" }}
            source={{ uri: item.image }}
          />
          <Text
            style={[
              styles.rideText,
              selected?.id === item.id && { color: Colors.primary },
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={{
        backgroundColor: "white",
        flex: 1,
      }}><BackButton
        onPress={() => {
          navigation.navigate("StartEndLocation");
        }}
        title={"Select Ride Type"}
        bar={true}
      />
<View
      style={{
        backgroundColor: "white",
        flex: 1,
        borderColor: "black",
        padding: 10,
        paddingTop: 80,
      }}
    >
      

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <ContinueButton
        text={"search driver"}
        onPress={searchDriver}
        disabled={!selected}
      />
    </View>
    </View>
    
  );
}

export default RideType


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
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
    // backgroundColor: Colors.primary,
    borderColor:Colors.primary,
    borderWidth:5,
    //"#60c6c2"
    // Change the background color to black when selected
  },
  rideText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  priceText: {
    fontSize: 30,
    fontWeight: "bold",

    color: Colors.primary,
  },
});