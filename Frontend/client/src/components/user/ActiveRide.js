import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import React from "react";
import moment from "moment";
import Colors from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";



const formatTime = (dateTime) => {
  return moment(dateTime).format("MMMM Do YYYY, h:mm a");
};

const ActiveRide = ({ data, fetchRides }) => {

    const navigation = useNavigation()

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("RideStartScreen");
      }}
    >
      <View style={styles.itemContainer}>
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <Text style={styles.driverName}>
            {`${item.firstname} ${item.lastname}`}
          </Text>
          <Octicons name="dot-fill" size={44} color="green" />
        </View>

        <Text
          style={styles.rideText}
        >{`License Plate: ${item.license_plate}`}</Text>
        <Text style={styles.rideText}>{`Vehicle Type: ${item.type}`}</Text>
        {/* Add other details as needed */}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.listContainer}
      refreshControl={
        <RefreshControl onRefresh={fetchRides} refreshing={false} />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: Colors.primary,
    marginVertical: 8,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.primary,
  },
  rideText: {
    fontSize: 18,
    color: Colors.input,
  },
  driverName: {
    fontSize: 24,
    color: Colors.input,
    fontWeight:"600"
  },
});

export default ActiveRide;
