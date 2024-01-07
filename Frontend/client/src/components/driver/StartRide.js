import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRideState,
  setRidePhase,
  setRideData,
} from "../../../slices/dataSlice";
import { setRideResponse,setShowChat,setChatNotification } from "../../../slices/modalSlice";
import { notInitialized } from "react-redux/es/utils/useSyncExternalStore";
import { BarCodeScanner } from "expo-barcode-scanner";
import Colors from "../../../constants/Colors";
import call from "react-native-phone-call";
import {
  Feather,
  MaterialIcons,
  SimpleLineIcons,
  Ionicons,
  Entypo
} from "@expo/vector-icons";
import Chat from "./Chat";
import BackButton from "../buttons/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StartRide = ({socket}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanned, setIsScanned] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showOptions,setShowOptions] = useState(false)
  
  
  
  const { rideState, ridePhase,rideData,rideShipmentId } = useSelector((state) => state.data);
  const {showChat,chatNotification} = useSelector((state) => state.modal)
  const dispatch = useDispatch();

  const askCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    //if status === 'granted then it returns true
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanned(true);
    setScanData(data);

    console.log("the QRcode scan is complete ");
  };





  useEffect(() => {
    askCameraPermission();
  }, []);

  useEffect(() => {
    if (scanData == rideShipmentId) {
      console.log(`qr code matches ${rideShipmentId}`);
      dispatch(setRideState("loaded"));
      dispatch(setRidePhase("two"));
      if (ridePhase == "two") {
        alert("ride complete");
        dispatch(setRidePhase("one"));
        dispatch(setRideState("completed"));
        // dispatch(setRideData(null));
      }
    } else if (scanData) {
      console.log("qr does not match");
      alert("qr code does not match");
      // setScanData(null)
    }
  }, [scanData]);

  if (!hasPermission) {
    // alert("please grant permission")
  }

  const triggerCall = ()=>{
    

    const args = {
      number: "9093900003", // String value with the number to call
      prompt: true, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args).catch(console.error);
  }
  
  
  
    return (







      <View style={styles.container}>
        <Chat socket={socket} from={rideData?.driverId} to={rideData?.userId} />
        <View style={styles.innerContainer}>
          {rideState == "started" || rideState == "reached" ? (
            <TouchableOpacity
              style={styles.rectangleButton}
              onPress={() => {
                console.log("scanning QR code...");
                setIsScanned(false);
                setScanData(null);

                setShowScanner(true);
              }}
            >
              <Text style={styles.text}>scan QR code</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.rectangleButton}
              onPress={() => {
                if (ridePhase == "two") {
                  dispatch(setRideState("reached"));
                }else if (ridePhase == "one") {
                  
                  dispatch(setRideState("started"));
                }

                console.log("reached start location");
                if (!hasPermission) {
                  askCameraPermission();
                }
              }}
            >
              {ridePhase == "one" ? (
                <Text style={styles.text}>reached start location</Text>
              ) : (
                <Text style={styles.text}>reached destination location</Text>
              )}
            </TouchableOpacity>
          )}
          
          {showScanner && (
            
              <BarCodeScanner
                style={{
                  position: "absolute",
                  height: 900,
                  width: 900,
                  top: -100,
                  left: -200,
                }}
                onBarCodeScanned={
                  isScanned ? setShowScanner(false) : handleBarCodeScanned
                }
              />
            
          )}

















          <TouchableOpacity
            style={styles.squareButton}
            onPress={() => {
              dispatch(setShowChat(true));
              console.log("show chat button was clicked");
              console.log("showChat right now is: ", showChat);
              dispatch(setChatNotification(false));
            }}
          >
            <View style={styles.container}>
              <Ionicons name="chatbubbles-outline" size={24} color="black" />
              {chatNotification && <View style={styles.dot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={triggerCall}>
            <MaterialIcons name="call" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowOptions(!showOptions);
            }}
            style={styles.squareButton}
          >
            {showOptions ? (
              <Entypo name="cross" size={24} color="black" />
            ) : (
              <Feather name="x" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={async () => {
                dispatch(setRideState("online"));
                dispatch(setRideResponse(null));
                dispatch(setRideResponse("reject"));
                dispatch(setRidePhase("one"));
                console.log("ride response is now set to reject");
                await AsyncStorage.setItem("rideState","")
              }}
            >
              <Text>cancel ride?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  

  
};

export default StartRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    
    
  },
  innerContainer: {
    width: "90%",
    height: 60,
    borderWidth: 0.5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    backgroundColor:"white"
  },
  rectangleButton: {
    width: "50%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  squareButton: {
    width: "25%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "normal",
  },
  optionsContainer: {
    backgroundColor: "white",
    width: "90%",
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

//"100%"