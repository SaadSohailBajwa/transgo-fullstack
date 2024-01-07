import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../screens/Welcome";
import EnterNumber from "../screens/auth/EnterNumber";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import UserHome from "../screens/user/home/UserHome";
import DriverTabs from "./DriverTabs";
import UserTabs from "./UserTabs";
import StartEndLocation from "../screens/user/home/book-vehicle/StartEndLocation";
import StartLocation from "../screens/user/home/book-vehicle/StartLocation";
import DestinationLocation from "../screens/user/home/book-vehicle/DestinationLocation";
import RideType from "../screens/user/home/book-vehicle/RideType";
import SelectDriver from "../screens/user/home/book-vehicle/SelectDriver";
import DriverInfo from "../screens/auth/DriverInfo";
import StartQR from "../screens/user/home/book-vehicle/StartQR";
import EndQR from "../screens/user/home/book-vehicle/EndQR";
import DriverPending from "../screens/auth/DriverPending";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setMode } from "../../slices/modeSlice";
import { setIsLoggedIn } from "../../slices/jwtSlice";
import * as NavigationBar from "expo-navigation-bar";
import { setAccessToken } from "../../slices/jwtSlice";
import { setId } from "../../slices/jwtSlice";
import RideStartScreen from "../screens/user/activity/RideStartScreen";
import DriverLicense from "../screens/auth/DriverLicense";
import ProfilePicture from "../screens/auth/ProfilePicture";
import AIPicture from "../screens/auth/AIPicture";


const Navigation = ({isLoggedIn,mode,accessToken,id}) => {
  const Stack = createNativeStackNavigator();
  const [appMode,setAppMode] = useState("")
  const [loginStatus,setLoginStatus] = useState(false)
  const {token} = useSelector(state=>state.token)
  // const {mode} = useSelector(state=>state.mode)
  const dispatch = useDispatch()

  NavigationBar.setBackgroundColorAsync("#ffffff00");
  NavigationBar.setPositionAsync("absolute");
  
  useEffect(()=>{
    dispatch(setAccessToken(accessToken));
    dispatch(setId(id))
    console.log("access token in redux set to: ",accessToken)
  },[accessToken])

  useEffect(() => {
    console.log("isLoggedIn: ",isLoggedIn,"mode: ",mode)
    let modeCapital
    if (mode == "driver") {
      modeCapital = "Driver"
      
      console.log(modeCapital);
    } else if (mode == "user") {
      modeCapital = "User"
      
    }
    dispatch(setIsLoggedIn(isLoggedIn))
    dispatch(setMode(modeCapital))
    
    
    
  }, []);
  
        

  // const isLoggedIn = true
        //isLoggedIn should be asyncStorage

  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EnterNumber"
          component={EnterNumber}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserHome"
          component={UserHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DriverTabs"
          component={DriverTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserTabs"
          component={UserTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="StartEndLocation"
          component={StartEndLocation}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="StartLocation"
          component={StartLocation}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="DestinationLocation"
          component={DestinationLocation}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="RideType"
          component={RideType}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="SelectDriver"
          component={SelectDriver}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="DriverInfo"
          component={DriverInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DriverPending"
          component={DriverPending}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="StartQR"
          component={StartQR}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="EndQR"
          component={EndQR}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="RideStartScreen"
          component={RideStartScreen}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="DriverLicense"
          component={DriverLicense}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="ProfilePicture"
          component={ProfilePicture}
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="AIPicture"
          component={AIPicture}
          options={{
            headerShown: false,
            title: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
