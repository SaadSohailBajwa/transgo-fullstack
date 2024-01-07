import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import UserHome from "../screens/user/home/UserHome";
import UserProfile from "../screens/user/profile/UserProfile";
import UserActivity from "../screens/user/activity/UserActivity";

import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const UserTabs = ({ navigation }) => (
  <Tab.Navigator
    initialRouteName="UserHome"
    screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: "#A5A5A5", //"#A5A5A5"
      tabBarStyle: {
        backgroundColor: "white",
        paddingBottom:25,
        height:75,
        
        
      },
      tabBarLabelStyle: {
        fontSize: 12, 
        fontWeight: "bold", 
        
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="UserHome"
      component={UserHome}
      navigation={navigation}
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
      name="UserActivity"
      component={UserActivity}
      options={{
        headerShown: false,
        tabBarLabel: "Activity",
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={"history"}
            size={34}
            color={focused ? Colors.primary : "#A5A5A5"}
          />
        ),
      }}
    />
    <Tab.Screen
      navigation={navigation}
      name="UserProfile"
      component={UserProfile}
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

export default UserTabs;
