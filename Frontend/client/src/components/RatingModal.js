import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { AirbnbRating } from "react-native-ratings";  
import Colors from "../../constants/Colors";

const ReviewModal = ({ isVisible, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  
  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      propagateSwipe={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modalView}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalHeaderText}>Rate your experience</Text>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Excellent"]}
          defaultRating={rating}
          size={30}
          onFinishRating={(value) => setRating(value)}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            // onRate(rating); 
            onClose();
            
          }}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 300,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
