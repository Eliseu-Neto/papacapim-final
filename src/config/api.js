import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

const api = axios.create({
    baseURL: "https://api.papacapim.just.pro.br",
});

let isSessionExpiredToastShown = false; 



api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token !== null) {
            config.headers["x-session-token"] = `${token}`;
        }
        return config;
    } catch (error) {
        console.error("Error getting user from AsyncStorage:", error);

        return config;
    }
});

async function setInterceptors(setUser, logOut) {
    api.interceptors.response.use(

        (response) => {
            return response;
        },
        async (error) => {
            if (!error.response && !isSessionExpiredToastShown) {
                isSessionExpiredToastShown = true;
                Alert.alert("error", "Voçê perdeu a coneção com a internet Verifique sua conexãot")
            }

            if (error.response && error.response.status === 401) {
                try {
                    await logOut();
                } catch (asyncStorageError) {
                    console.error("Error removing user from AsyncStorage:", asyncStorageError);
                }
            }

            return Promise.reject(error);
        }
    );
}

export { api, setInterceptors };
