import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector,useDispatch } from "react-redux";
import { setMode } from "../../../slices/modeSlice";
import * as Location from "expo-location";

import { setUserCurrentLocation,setUserStartLocation } from "../../../slices/locationSlice";

const DriverModeSelect = ({navigation}) => {

  const {mode} = useSelector((state)=>state.mode)
  
  const { userCurrentLocation, userStartLocation, userDestinationLocation } =
    useSelector((state) => state.userLocation);
const dispatch = useDispatch();

    const askLocation = async ()=>{
      try {
        dispatch(setMode("driver"));
        navigation.navigate("EnterNumber");
        let { status } = await Location.requestForegroundPermissionsAsync(
          status
        );
        if (status !== "granted") {
          setError("permission to access location denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        //setLocation(location)
        if (location.coords.latitude){
          console.log("user current location now acquired")
        }
          //separated lat and long of location
          dispatch(
            setUserCurrentLocation({
              location: {
                lat: location?.coords.latitude,
                lng: location?.coords.longitude,
              },
            })
          );

        dispatch(
          setUserStartLocation({
            location: {
              lat: location?.coords.latitude,
              lng: location?.coords.longitude,
            },
          })
        );
        
      } catch (err) {
        console.log(err);
      }
    }

  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={askLocation}>
        <Text style={styles.driverText}>Or, Drive with TransGo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 1,
    paddingBottom: 10,
  },
  driverText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default DriverModeSelect;
