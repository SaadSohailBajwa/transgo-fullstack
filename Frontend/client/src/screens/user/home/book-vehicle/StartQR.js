import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GenerateQR from "../../../../components/user/GenerateQR";
import { useSelector } from "react-redux";
import BackButton from "../../../../components/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";

const StartQR = () => {
  const { rideShipmentId } = useSelector((state) => state.data);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => {
          navigation.navigate("RideStartScreen");
        }}
      />

      <GenerateQR data={rideShipmentId} />
    </View>
  );
};

export default StartQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
