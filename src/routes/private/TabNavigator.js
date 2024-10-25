import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import FeedScreen from '../../screens/FeedScren';
import EditProfileScreen from '../../screens/EditProfileScreen';
import { colorPrimay } from '../../constants/colorPalety';
import SearchUsersScreen from '../../screens/SeachUSer';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <>
      <StatusBar animated hideTransitionAnimation='fade' style='dark' />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

            if (route.name === 'FeedScreen') {
              iconName = 'home';
            } else if (route.name === 'EditProfileScreen') {
              iconName = 'user';
            } else if (route.name === 'SearchUsersScreen') {
              iconName = 'search1';
            }


            return <AntDesign name={iconName} size={30} color={color} />;
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: colorPrimay,
          tabBarInactiveTintColor: 'gray',

        })}
      >
        <Tab.Screen name="FeedScreen" component={FeedScreen} options={{
          headerShown: true,
          headerTitle:"Postagem do papacapim"

        }} />
        <Tab.Screen name="SearchUsersScreen" component={SearchUsersScreen}options={{
          headerShown: true,
          headerTitle:"Tela de Busca"

        }}  />



        <Tab.Screen name="EditProfileScreen" component={EditProfileScreen} options={{
          headerStyle: {
            backgroundColor: "#fff2",
          },
          headerTitle: "Minha conta",
          headerTitleAlign: "center",
        }} />



      </Tab.Navigator>
    </>

  );
}
