import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setRideRequestModal,
  setRideResponse,
} from "../../../slices/modalSlice";
import { setRideState, setRideData } from "../../../slices/dataSlice";
import Modal from "react-native-modal";
import Colors from "../../../constants/Colors";

const RideRequestModal = () => {
  const { rideRequestModal } = useSelector((state) => state.modal);
  const { rideData } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  return (
    <Modal
      isVisible={rideRequestModal}
      onSwipeComplete={() => dispatch(setRideRequestModal(false))}
      swipeDirection={["down"]}
      propagateSwipe={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modalView}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalHeaderText}>Ride Request</Text>
        <Text style={styles.userIdText}>
          Received request from user with id {rideData?.userId}
        </Text>
        <Text style={styles.startLatText}>
          for start lat {rideData?.startLat}
        </Text>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => {
            dispatch(setRideRequestModal(false));
            dispatch(setRideResponse("accept"));
            dispatch(setRideState("accept"));
          }}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => {
            dispatch(setRideRequestModal(false));
            dispatch(setRideResponse("reject"));
          }}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RideRequestModal;

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF", // 60% white
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 500,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333", // Slightly off-black for better readability
  },
  userIdText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666", // Dark gray for secondary text
  },
  startLatText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666666", // Dark gray for secondary text
  },
  acceptButton: {
    backgroundColor: Colors.primary, // 30% light blue
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "#FFFFFF", // White text for better visibility on the green button
    fontSize: 18,
  },
  rejectButton: {
    backgroundColor: Colors.secondary, // 10% dark blue
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: "#FFFFFF", // White text for better visibility on the red button
    fontSize: 18,
  },
});
