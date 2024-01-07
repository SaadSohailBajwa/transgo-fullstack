
import { StyleSheet, Text, View , StatusBar} from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import Navigation from './src/navigation/Navigation';
import store from './store';
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState,useCallback } from 'react';
import axios from 'axios';
import Urls from './constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';


SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [accessToken,setAccessToken] = useState("")
  const [id,setId] = useState("")
  const [mode,setMode] = useState(null)
  
  
  
    const setRefreshToken = async (refreshToken) => {
      await AsyncStorage.setItem("refresh", refreshToken);
      console.log("refresh token stored in async storage inside App component after api call is:", refreshToken);
    };
  
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        
        const refreshToken = await AsyncStorage.getItem("refresh");
        
        console.log("refresh token before auto login: ",refreshToken)

        const response = await axios.get(
          `http://${Urls.auth}/auth/token/refresh`,
          {
            headers:{
              refresh:refreshToken
            }
          }
        )

        setRefreshToken(response.data.refreshToken)
        setAccessToken(response.data.accessToken)
        console.log("response from /token/refresh: ",response.data)
        setId(response.data.id)
        setIsLoggedIn(true)
        setMode(response.data.mode.toString())
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render

        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
      
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }



  return (
      <Provider store={store}>
        {appIsReady && <Navigation isLoggedIn={isLoggedIn} mode={mode} accessToken={accessToken} id={id}/>}
        
      </Provider>
        
      
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
