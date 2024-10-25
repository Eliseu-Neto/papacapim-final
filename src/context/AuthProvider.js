import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native';
import { colorPrimay } from '../constants/colorPalety';
export const ContextAuth = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);


    useEffect(() => {
        async function recovereUser() {
            try {
                setLoading(true)
                const recovereUser = await AsyncStorage.getItem("user");
                const data = JSON.parse(recovereUser)
                if (data !== null) {
                    setUser(data)
                }
                setLoading(false)
            } catch (error) {
                alert("Ocorreu um erro ao recumperar o usuario")
                setLoading(false)
            }
        }

        recovereUser();
    }, []);

    async function logout() {
        await AsyncStorage.clear();
        setUser(null)
    }

    if (loading) {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                <ActivityIndicator size={50} color={colorPrimay} />
            </View>
        )
    }
    return (
        <ContextAuth.Provider value={{ logout, user, setUser }}>
            {children}
          {false &&  <Text>{"Usuario é " + JSON.stringify(user, null, 2)}</Text>}
        </ContextAuth.Provider>
    )
}
