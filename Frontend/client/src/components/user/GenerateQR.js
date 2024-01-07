import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"; 


const GenerateQR = ({ data }) => {
  const qrCodeRef = useRef();
  const navigation = useNavigation()

  const handleShare = async () => {
    try {
      if (qrCodeRef.current) {
        const uri = await captureRef(qrCodeRef, {
          format: "png",
          quality: 0.8,
        });

        await Sharing.shareAsync(uri);
        
      } else {
        console.error("QR code ref is null");
      }
    } catch (error) {
      console.error("Error sharing QR code", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.qrCodeContainer]}>
        <QRCode value={data} getRef={qrCodeRef} size={300} quietZone={10} />
      </View>
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share QR Code</Text>
          <MaterialCommunityIcons name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodeContainer: {
    marginBottom: 20, // Adjust as needed
    
  },
  shareButtonContainer: {
    marginTop: 20, // Adjust as needed
    borderWidth:2,
    borderRadius:25,

  },
  shareButton: {
    padding: 10,
    flexDirection:"row",
    borderRadius: 5,
    alignItems:"center"
  },
  shareButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize:25,
    padding:5,
  },
});



export default GenerateQR;
