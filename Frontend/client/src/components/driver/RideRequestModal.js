import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setRideRequestModal,
  setRideResponse,
} from "../../../slices/modalSlice";
import { setRideState, setRideData } from "../../../slices/dataSlice";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "react-native-progress/Bar";
import Colors from "../../../constants/Colors";

const RideRequestModal = () => {
  const { rideRequestModal } = useSelector((state) => state.modal);
  const { rideData,rideState } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (rideRequestModal) {
      // Start a timer to update the progress bar
      timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 0.0167); // 1 minute in percentage (1/60)
      }, 1000);

      // Set a timeout to automatically reject after 1 minute
      setTimeout(() => {
        dispatch(setRideRequestModal(false));
        

        clearInterval(timer); // Clear the interval when the timer is complete
      }, 60000);
    }
    if (rideState === "online" && rideRequestModal == false) {
          console.log("entered reject statement in timeout", rideState);
          dispatch(setRideResponse("reject"));
        }

    // Cleanup on component unmount or when modal is closed
    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [rideRequestModal, dispatch, rideState]);

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
        <ProgressBar progress={progress} width={300} color={Colors.primary} />
        <Text style={styles.modalHeaderText}>Ride Request</Text>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>{rideData?.startDescription}</Text>
        </View>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-off" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>
            {rideData?.destinationDescription}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Duration:</Text>
            <Text>{rideData?.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Distance:</Text>
            <Text>{rideData?.distance}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => {
            dispatch(setRideRequestModal(false));
            dispatch(setRideResponse("accept"));
            dispatch(setRideState("accept"));
            // dispatch(setRideState("accept"));
            console.log("Ride state after accepting:", rideState);
          }}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => {
            dispatch(setRideRequestModal(false));
            dispatch(setRideResponse("reject"));
          }}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.input,
    padding: 22,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    borderColor: Colors.primary,
    height: 500,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    color: Colors.primary,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  labelText: {
    color: Colors.primary,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  rejectButton: {
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 8,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  buttonText: {
    color: Colors.input,
    fontSize: 18,
  },
  rejectText: {
    color: Colors.primary,
    fontSize: 18,
  },
});

export default RideRequestModal;
