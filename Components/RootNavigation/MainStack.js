
import React,{useEffect,useState,useMemo} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FirstSplash from '../Screens/SplashScreen/FirstSplash'
import Email from '../Screens/UserDetails/Email'
import PhoneNo from '../Screens/UserDetails/PhoneNo'
import Name from '../Screens/UserDetails/Name'
import CreateOrJoinPod from '../Screens/Pods/CreateOrJoinPod'
import PodName from '../Screens/Pods/PodName'
import InviteCode from '../Screens/Pods/InviteCode'
import AddPhoto from '../Screens/Pods/AddPhoto'
import ChangePhoto from '../Screens/Pods/ChangePhoto'
import Notification from '../Screens/Pods/Notification'
import ReadyToGo from '../Screens/Pods/ReadyToGo'
import InvitationCode from '../Screens/Pods/InvitationCode'
import MapLocation from '../Screens/MainApp/Pods/MapLocation'
import Timeline from '../Screens/MainApp/Pods/Timeline'
import Tapping from '../Screens/MainApp/Tapping'

import Settings from '../Screens/MainApp/Settings/Settings'
import NotificationMain from '../Screens/MainApp/Settings/Notification'
import LocationSharing from '../Screens/MainApp/Settings/LocationSharing'
import PodManage from '../Screens/MainApp/Settings/PodManage'
import MyAccount from '../Screens/MainApp/Settings/MyAccount'
import Privacy from '../Screens/MainApp/Settings/Privacy'
import PrivacyPolicy from '../Screens/MainApp/Settings/PrivacyPolicy'
import DateTime from '../Screens/MainApp/Clander/Date&Time'


import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CameraSharing from '../Screens/MainApp/Settings/CameraSharing';
import Login from '../Screens/UserDetails/Login';

import PodContext from '../Constant/Context/PodContext'
import LegalName from '../Screens/UserDetails/LegalName';
import VicinitySharing from '../Screens/MainApp/Settings/VicinitySharing';


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MainStack() {
  // const [PodValue, setPodValue] = useState(0);

  // const value = useMemo(
  //   () => ({PodValue, setPodValue}),
  //   [PodValue, setPodValue],
  // );
 

  return (
    <NavigationContainer >
 {/* <PodContext.Provider value={value}> */}
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="FirstSplash" component={FirstSplash} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="PhoneNo" component={PhoneNo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LegalName" component={LegalName} />
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="CreateOrJoinPod" component={CreateOrJoinPod} />
        <Stack.Screen name="PodName" component={PodName} />
        <Stack.Screen name="InviteCode" component={InviteCode} />
        <Stack.Screen name="AddPhoto" component={AddPhoto} />
        <Stack.Screen name="ChangePhoto" component={ChangePhoto} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="ReadyToGo" component={ReadyToGo} />
        <Stack.Screen name="InvitationCode" component={InvitationCode} />
        <Stack.Screen name="VicinitySharing" component={VicinitySharing} />
        <Stack.Screen name="MyTabs" component={MyTabs} />

      </Stack.Navigator>
      {/* </PodContext.Provider> */}
    </NavigationContainer>
  );
}


function PodsStack() {
  return (


    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="MapLocation" component={MapLocation} />
      <Stack.Screen name="Timeline" component={Timeline} />


    </Stack.Navigator>

  );
}
function ClanderStack() {
  return (


    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="DateTime" component={DateTime} />
     


    </Stack.Navigator>

  );
}
function SettingsStack() {
  return (


    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="NotificationMain" component={NotificationMain} />
      <Stack.Screen name="PodManage" component={PodManage} />
      <Stack.Screen name="LocationSharing" component={LocationSharing} />
      <Stack.Screen name="CameraSharing" component={CameraSharing} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />



    </Stack.Navigator>

  );
}



function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="rgb(255, 168, 157)"
      inactiveColor="rgb(204, 204, 209)"
      barStyle={{ backgroundColor: 'white' }}

    >
      <Tab.Screen name="Pods" component={PodsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="users" color={color} size={24} />
          ),
        }}
        />
      <Tab.Screen name="ClanderStack" component={ClanderStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" color={color} size={24} />
            ),
          }}
          />
      <Tab.Screen name="Tap if Alarmed" component={Tapping} 
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="shield" color={color} size={24} />
            ),
          }}
          />
      <Tab.Screen name="Settings" component={SettingsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="settings" color={color} size={24} />
            ),
          }}
      />
    </Tab.Navigator>
  );
}

export default MainStack