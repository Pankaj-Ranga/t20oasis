import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Image, TouchableOpacity, StatusBar, Alert, Linking, ActivityIndicator } from 'react-native'
import OnBoarding from './OnBoarding'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FirstSplash = ({ navigation }) => {
  const [loader, setLoader] = useState(true)

  let res =  {"errors": [], "httpStatusCode": "OK", "isSuccess": true, "response": "{\"UserId\":25,\"LegalName\":\"dd\",\"ProfileName\":null,\"Email\":\"aa@gmail.com\",\"PhoneNumber\":\"4569807563\",\"CountryMobileCode\":\"+91\",\"UserType\":1,\"Data\":null,\"Token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMjUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZGQiLCJleHAiOjE2NzI0MDUwNjgsImlzcyI6IkdpbmdlcmJveE1vYmlsaXR5IiwiYXVkIjoiR2luZ2VyYm94U09TTW9iaWxlQXBwVXNlciJ9.GHGgWNPCiv2LFgYO2ofc_JPxjhRXkt5XJLhF8eVAGbI\"}"}

  const dd = JSON.parse(res.response)

  console.log(dd,'ddd')
  // const requestLocationPermission = async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

  //       );
  //       if (granted == PermissionsAndroid.RESULTS.GRANTED) {
  //         if (Platform.OS === 'android') {
  //           getPermissions();
  //           function getPermissions() {
  //             RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  //               interval: 10000,
  //               fastInterval: 5000,
  //             }).then((data) => {

  //               console.log('location enabled');
  //             });
  //           }
  //         }
  //       } else {
  //         console.log('you cant');
  //       }
  //       const grantedCamera = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //         {
  //           title: "Photo App Camera Permission",
  //           message:
  //             "Photo App needs access to your camera " +
  //             "so you can share your camera.",

  //           buttonNegative: "Cancel",
  //           buttonPositive: "OK"
  //         }
  //       );
  //       if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log("You can use the camera");
  //       } else {
  //         console.log("Camera permission denied");
  //       }

  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };
  const appWokeUp = (event) => {
    // this handles the use case where the app is running in the background and is activated by the listener...
    // Alert.alert('Linking Listener', 'url  ' + event.url);
    resetStackToProperRoute(event.url);
  };

  const resetStackToProperRoute = (url) => {
    // console.log(url, this.props, 'URLs');

    let _url = url;
    let split_url = _url.split('/');
    let id = split_url[split_url.length - 1];
    // console.log(split_url, 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
    let dd = id.split('=')
    let code = dd[1].split("&")
    console.log(dd[2], '__-SPLIT URL');

    navigation.navigate('InvitationCode', { "code": code[0], "id": dd[2] });

  };

  const GetStarted = () => {
    navigation.replace('PhoneNo')
  }
  const GetData = async () => {
    const userData = await AsyncStorage.getItem('UserData')
console.log(userData,'userdata')
    if (userData !=null) {
      navigation.replace('CreateOrJoinPod')
    }

    // requestLocationPermission()
    Linking.getInitialURL()
      .then((url) => {
        console.log(url, 'jjj')
        setLoader(false)
        if (url) {
          // Alert.alert('GET INIT URL', 'initial url  ' + url);
          resetStackToProperRoute(url);
        }
      })
      .catch((e) => { console.log(e, 'eeeee') });

    // This listener handles the case where the app is woken up from the Universal or Deep Linking
    Linking.addEventListener('url', appWokeUp);
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetData();
    });
    return unsubscribe;
    // GetData()
  }, [])

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
      </View>
    )
  } else {

    return (
      <View style={{ height: '100%', alignItems: 'center', backgroundColor: 'rgb(255, 255, 255)' }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Image style={{ marginTop: '10%' }} source={require('../../Images/CircleLogo.jpg')} />



        <View style={{ width: '100%', height: "50%", backgroundColor: 'gray' }}>
          <OnBoarding />

        </View>

        <TouchableOpacity style={{ backgroundColor: '#3D09A2', width: '70%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={GetStarted} >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Get Started</Text>
        </TouchableOpacity>
        <View style={{ marginTop: '5%', flexDirection: 'row' }}>

          <Text style={{ color: 'gray', fontSize: 16, }}>Already have a T2Oasis account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>

            <Text style={{ color: 'rgb(255, 163, 151)', fontSize: 16, marginLeft: 3 }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

    )
  }
}

export default FirstSplash
