import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import Colors from "../../../constants/Colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const Input = ({value,onChange,placeholderText,label,iconName,error,errorMessage,password,onFocus=()=>{},
...props}) => {
  return (
    <View style={{marginBottom:20}}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer]}>
        <MaterialCommunityIcons name={iconName} size={24}/>
        <TextInput 
            autoCorrect={false}
            onFocus={()=>onFocus()}
            onChangeText={onChange}
            style={{flex:1,fontSize:15,marginLeft:10}} 
            placeholder={placeholderText}
            secureTextEntry={password}/>
      </View>
      {error&& <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    label:{
        marginVertical:5,
        fontSize: 14,
        color: "grey"
    },
    inputContainer:{
        height:50,
        backgroundColor: Colors.input,
        flexDirection:"row",
        paddingHorizontal:15,
        borderWidth:1,
        alignItems:"center"
    },
    errorText:{
        color:'red'
    }
})