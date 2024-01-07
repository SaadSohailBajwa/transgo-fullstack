import { StyleSheet, Text, View,Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Urls from "../../../constants/Urls";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/buttons/BackButton";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";


const DriverPending = () => {

    const { mode } = useSelector((state) => state.mode);
    const { phoneNumber } = useSelector((state) => state.phoneNumber);
    const { token,id } = useSelector((state) => state.token);
    const [status,setStatus] = useState(false)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const imageUrl =
      "https://transgo.s3.me-south-1.amazonaws.com/8b1e21b1-a703-4bbf-b71d-a023110a013a";

    useEffect(()=>{
      const getVerificationStatus = async ()=>{
        try{

          const response = await axios.get(`http://${Urls.driver}/driver/status`,
          {
            id,
          },
          {
            headers: {
              token, // Include the JWT token in the Authorization header
            },
          })

          console.log("response form getVerificationStatus is: ",response)
          setStatus(response)
        }catch(err){
                console.log("error in getVerificationStatus: " ,err)
        }
      }
        getVerificationStatus()
    },[])

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <BackButton
        onPress={() => {
          navigation.navigate("Welcome");
        }}
      />

      <View style={styles.container}>
        {status ? (
          <Text style={styles.messageText}>
            Congrats! You have been verified
          </Text>
        ) : (
          <Text style={styles.messageText}>
            Your information is being processed. We will get back to you
            shortly...
          </Text>
        )}
        <AntDesign name="clockcircle" size={184} color={Colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 28,
    textAlign: "center",
    marginBottom:50
  },
  image: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    borderRadius: 10, // Optional: Add border radius for a rounded appearance
  },
});

export default DriverPending;
