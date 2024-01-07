import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '../../constants/Colors'
import { AntDesign } from "@expo/vector-icons";
import DriverModeSelect from '../components/driver/DriverModeSelect';
import { setMode } from '../../slices/modeSlice';
import { useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({navigation}) => {
    
    const dispatch = useDispatch();
    const imgSrc = require("../../assets/test_welcome.png")
    const textImgSrc = require("../../assets/Logo_text.png")
    const {mode} = useSelector(state=>state.mode)
    const {isLoggedIn} = useSelector(state=>state.token)
    
    useEffect(()=>{
      if(isLoggedIn){
        navigation.navigate(`${mode}Tabs`)
      }
    },[isLoggedIn])
  
  if(!isLoggedIn){
    return (
      <View style={styles.container}>
        <Image source={imgSrc} style={styles.image} />
        <Image
          source={textImgSrc}
          style={styles.logoText}
          resizeMode="contain"
        />
        {/* <Text style={styles.welcomeText} >
          Welcome to TransGo!
        </Text>
        <Text style={styles.welcomeText}>
          Moving made simple.
        </Text> */}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            dispatch(setMode("user"));
            navigation.navigate("EnterNumber");
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <View style={{ position:"absolute",right:10,}}>
            <AntDesign
              name="arrowright"
              size={30}
              color="white"
              style={{ paddingLeft: 10 }}
            />
          </View>
        </TouchableOpacity>
        <DriverModeSelect navigation={navigation} />
      </View>
    );
  }
  
}

export default Welcome

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        flex:1,
        justifyContent:"space-between",
        paddingBottom:10,
        
    },
    image:{
        height:"80%",
        width:"100%",
        marginBottom:-25,
    },
    logoText:{
      height:"7%",
      width:"100%"
    },
    welcomeText:{
        fontSize:25,
        fontWeight:"700",
        color:Colors.primary,
        textAlign:"center",
        

    },
    continueButton: {
    position:"relative",  
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    backgroundColor: Colors.primary, 
    marginHorizontal: 20, // Side margins
    marginBottom: 10,
    marginTop:15, // Bottom margin
    borderRadius: 25, // Makes the button corners rounded
    shadowColor: "#000", // Optional: Add a shadow for elevation
    shadowOffset: {
      width: 0,
      height: 2,
        }
    },
    buttonText:{
        color:"white",
        fontSize:25
    }

})