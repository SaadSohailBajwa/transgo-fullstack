// import React, { useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
// import { useDispatch } from "react-redux";
// import { setUserCurrentLocation } from "../../../slices/locationSlice";

// const LOCATION_TRACKING = "location-tracking";

// const locationDispatchRef = React.createRef();

// function UserLocation({ isOnline }) {
//   const [locationStarted, setLocationStarted] = React.useState(false);
//   const dispatch = useDispatch();

//   // Set the ref value when the component mounts
//   React.useEffect(() => {
//     locationDispatchRef.current = dispatch;
//   }, [dispatch]);

//   const startLocationTracking = async () => {
//     try {
//       await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
//         accuracy: Location.Accuracy.Highest,
//         timeInterval: 1000,
//         distanceInterval: 0,
//       });
//       const hasStarted = await Location.hasStartedLocationUpdatesAsync(
//         LOCATION_TRACKING
//       );
//       setLocationStarted(hasStarted);
//       console.log("tracking started?", hasStarted);
//     } catch (error) {
//       console.error("Error starting location tracking:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (isOnline) {
//           await startLocationTracking();
//         } else {
//           stopLocation();
//         }
//       } catch (error) {
//         console.error("Error in useEffect:", error);
//       }
//     };

//     fetchData();

//     return () => {
//       stopLocation();
//     };
//   }, [isOnline]);

//   const startLocation = () => {
//     startLocationTracking();
//   };

//   const stopLocation = () => {
//     setLocationStarted(false);
//     TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
//       if (tracking) {
//         Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
//       }
//     });
//   };

//   useEffect(() => {
//     if (isOnline) {
//       startLocation();
//     } else {
//       stopLocation();
//     }

//     return () => {
//       stopLocation();
//     };
//   }, [isOnline]);

//   return <View>{/* Your UI components here */}</View>;
// }

// TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
//   const dispatch = locationDispatchRef.current;
//   if (error) {
//     console.log("LOCATION_TRACKING task ERROR:", error);
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     let lat = locations[0]?.coords.latitude;
//     let long = locations[0]?.coords.longitude;

//     // Dispatch the action to update user's current location in Redux
//     dispatch(
//       setUserCurrentLocation({
//         location: {
//           lat: lat,
//           lng: long,
//         },
//       })
//     );

//     console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
//   }
// });

// export default UserLocation;