import React,{useState,useMemo, useEffect} from 'react'
import { View, Text } from 'react-native'


import AddPhoto from './Components/Screens/Pods/AddPhoto'
import {PodContext} from './Components/Constant/Context/PodContext'

import MainStack from './Components/RootNavigation/MainStack'
import messaging from '@react-native-firebase/messaging';
import Maptest from './Components/Screens/MainApp/Pods/maptest'
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {

 async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    // console.log(authStatus,'requestUserPermission')
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      Token()
      console.log('Authorization status:', authStatus);
      
    }
  }

  const Token=async()=>{
    try{
      const token = await messaging().getToken()
      console.log(token,'ttttttttttttttttttttttttttttttt')
      AsyncStorage.setItem('DivecToken', token)
    }catch(err){console.log(err,'errrrrrrrrrrrrrrrrrrrrrrrr')}
  }

  const NotificationListner=()=>{
    
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    messaging().onMessage(async remoteMessage=>{
      console.log('forground services',remoteMessage)
    })
    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
       
      }
   
    });
  }

  const [PodValue, setPodValue] = useState({});

  const value = useMemo(
    () => ({PodValue, setPodValue}),
    [PodValue, setPodValue],
  );

  useEffect(() => {
    NotificationListner()
    requestUserPermission()

    
  }, []);
  
  return (
  // <Maptest />
  <PodContext.Provider value={value}>

    <MainStack/>
  </PodContext.Provider>
  
  )
}

export default App
