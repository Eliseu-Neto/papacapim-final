import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen';


const Stack = createStackNavigator();

export default function PublicRoutes() {
    return (
        <Stack.Navigator screenOptions={{
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "blue",
            },
            
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>

            <Stack.Screen name="LoginScreen" options={{ headerTitle: "", headerShown:false }} component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" options={{ headerTitle: "", headerShown:false  }} component={SignUpScreen} />
            


        </Stack.Navigator>
    )
}
