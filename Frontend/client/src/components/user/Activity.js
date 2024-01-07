import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React from "react";
import moment from "moment";
import Colors from "../../../constants/Colors";

// const DATA = [
//   {
//     firstname: "All",
//     lastname: "Three",
//     profile_picture_url: null,
//     license_plate: "Three333",
//     type: "bike",
//     start_time: "2023-12-16T11:45:18.000Z",
//     end_time: "2023-12-16T11:45:49.000Z",
//     fare: null,
//     start_location: "0101000020E6100000718456717494524040CBA953D4813F40",
//     destination_location: "0101000020E6100000E58C727A28955240D1AC11667F853F40",
//   },
//   // ... (other items)
// ];

const formatTime = (dateTime) => {


    const dateString = "2024-01-06 21:27:53";
    const utcDateTime = new Date(dateString);

    // Add GMT+5 offset (5 * 60 minutes)
    const localTimeWithOffset = new Date(
      utcDateTime.getTime() + 5 * 60 * 60000
    );




    // return utcTime.toLocaleDateString() + ", " + utcTime.toLocaleTimeString()
    return moment(localTimeWithOffset).format("MMMM Do YYYY, h:mm a");
  };

const Activity = ({data,fetchRides}) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      
      <Text style={styles.dateText}>{`${formatTime(
        item.start_time
      )}`}</Text>
      <Text>{`${item.firstname} ${item.lastname}`}</Text>
      <Text
        style={styles.rideText}
      >{`License Plate: ${item.license_plate}`}</Text>
      <Text style={styles.rideText}>{`Vehicle Type: ${item.type}`}</Text>
      {/* Add other details as needed */}
    </View>
  );

  

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.listContainer}
      refreshControl={<RefreshControl onRefresh={fetchRides} refreshing={false}/>}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: Colors.input,
    marginVertical: 8,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color:Colors.primary
  },
  rideText: {
    fontSize: 14,
    color: "grey",
  },
});

export default Activity;
