//MainTabs
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./screens/Home";
import ProfileScreen from "./screens/ProfileScreen";
import CalendarScreen from "./screens/CalendarScreen"; // pode ser temporária
import FavoritesScreen from "./screens/FavoritesScreen"; // ajuste o caminho se necessário
import SearchServices from "./screens/SearchServices";


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === "Home") icon = "home";
          else if (route.name === "Profile") icon = "person";
          else if (route.name === "Calendar") icon = "calendar";
          else if (route.name === "Favorites") icon = "star";
          else if (route.name === "Search") icon = "search";

          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4eaf52",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Search" component={SearchServices} /> 
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      
     

    </Tab.Navigator>
  );
}


