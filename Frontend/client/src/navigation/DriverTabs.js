import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import  DriverHome  from "../screens/driver/home/DriverHome";
import DriverProfile from "../screens/driver/profile/DriverProfile";


import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const Tab = createBottomTabNavigator();

const DriverTabs = ({ navigation }) => (
  <Tab.Navigator
    initialRouteName="DriverHome"
    screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: "#A5A5A5",
      tabBarStyle: {
        backgroundColor: "white",
      },
      tabBarLabelStyle: {
        fontSize: 12, // Adjust the size as you prefer
        fontWeight: "bold", // Optional: if you want the text to be bold
        // You can add other styles as needed
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="DriverHome"
      component={DriverHome}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={"home"}
            size={34}
            color={focused ? Colors.primary : "#A5A5A5"}
          />
        ),
      }}
    />
    <Tab.Screen
      name="DriverProfile"
      component={DriverProfile}
      options={{
        headerShown: false,
        tabBarLabel: "Profile",
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={"account"}
            size={34}
            color={focused ? Colors.primary : "#A5A5A5"}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default DriverTabs;
