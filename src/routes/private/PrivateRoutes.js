import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import TabNavigator from './TabNavigator';
import UserProfileScreen from '../../screens/UserProfileScreen';
import PostScreen from '../../screens/PostScreen';
import Comments from '../../screens/Comments';
import SearchPosts from '../../screens/SearchPosts';


const Stack = createStackNavigator();

export default function PrivateRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TabNavigator" options={{
                headerShown:false
            }} component={TabNavigator} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="PostScreen" component={PostScreen} />
            <Stack.Screen name="SearchPosts" component={SearchPosts} />
            
            <Stack.Screen name="Comments" component={Comments} />

        </Stack.Navigator>
    )
}
