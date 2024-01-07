import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '../../../constants/Colors';


const RideOption = ({text1,text2,logo,navigateTo,navigation, props={} }) => {
  return (
    <TouchableOpacity style={styles.container}
    onPress={()=>navigation.navigate(navigateTo, props)}
    >
      <Text style={styles.text}>{text1}</Text>
      <Text>{text2}</Text>
    </TouchableOpacity>

  );
}

export default RideOption

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.input, //"#f9f9f9" light-grey
    marginVertical: 8,
    borderRadius: 5,
  },
  text: {
    fontSize: 25,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});