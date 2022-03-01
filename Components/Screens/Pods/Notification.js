import React, { useState,useEffect } from 'react'
import { View, Text, Switch, StatusBar,ScrollView, TouchableOpacity, Image, ImageBackground ,PermissionsAndroid} from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import API from '../../Constant/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Notification = (props) => {
    

    const [load, setLoad] = useState(false);
    const [isEnabledNotification, setIsEnabledNotification] = useState(false);
    const [isEnabledLocation, setIsEnabledLocation] = useState(false);
    const [isEnabledCamera, setIsEnabledCamera] = useState(false);
    const [podName, setPodName] = useState('');
  
  
    const toggleSwitch = async() => {
        let isEnabled
        setIsEnabledNotification(previousState => !previousState)
    if(!isEnabledNotification){
        isEnabled=true
    
    }else{
        isEnabled=false
    }
    console.log(isEnabled,'true')


    try{
        const res = await API().updateNotificationSettings(
            podName,
            isEnabled,
            false
        )
        // console.log(isEnabled,res,'true')
            }catch(err){console.log(err,'errrrrrrrrrrrrrrrrrrrrrrr')}
        }



    const toggleSwitchLocation =async () => {
        let isEnabled
        setIsEnabledLocation(previousState => !previousState)

    
    if(!isEnabledLocation){
        isEnabled=true
    
    }else{
        isEnabled=false
    }
    console.log(isEnabled,'true')


    try{
        const res = await API().updateNotificationSettings(
            podName,
            false,
            isEnabled
        )
        console.log(isEnabled,res,'true')
            }catch(err){console.log(err,'errrrrrrrrrrrrrrrrrrrrrrr')}
    
    }

    const toggleSwitchCamera = () => setIsEnabledCamera(previousState => !previousState);

// const requestLocationPermission = async () => {
//         try {
          
//                   if (Platform.OS === 'android') {
//               getPermissions();
//               function getPermissions() {
//                 RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
//                   interval: 10000,
//                   fastInterval: 5000,
//                 }).then((data) => {
              
//                   console.log('location enabled');
//                 });
              
//             }
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       };


   
   
const getData=async()=>{
   const PodName = await AsyncStorage.getItem('PodName')
        setPodName(PodName)
        console.log('PodName',PodName)
        
}
      useEffect(() => {
          getData()
     // requestLocationPermission()
      }, [])


    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={()=>props.navigation.goBack()}/>
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>T2Oasis needs this permissions to work properly</Text>

            </View>
            <ScrollView style={{ marginTop: '10%' }} contentContainerStyle={{alignItems:'center'}}>
                <View style={{ width: "80%", marginTop: '10%', flexDirection: 'row' }}>
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Push Notifications</Text>
                        <Text style={{ fontSize: 16 }}>Make sure you know right away when a Pod member sends an alert</Text>
                    </View>

                    <Switch
                        style={{ marginTop: '-12%' }}
                        trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                        thumbColor={isEnabledNotification ? "White" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabledNotification}
                    />

                </View>

                <View style={{ width: "80%", marginTop: '5%', flexDirection: 'row' }}>
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Location Sharing</Text>
                        <Text style={{ fontSize: 16 }}>Real-time location sharing with your Pod</Text>
                    </View>

                    <Switch
                        style={{ marginTop: '-12%' }}
                        trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                        thumbColor={isEnabledLocation ? "White" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchLocation}
                        value={isEnabledLocation}
                    />

                </View>
                <View style={{ width: "80%", marginTop: '5%', flexDirection: 'row' }}>
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Camera Access</Text>
                        <Text style={{ fontSize: 16 }}>Real-time camera access with your Pod</Text>
                    </View>

                    <Switch
                        style={{ marginTop: '-12%' }}
                        trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                        thumbColor={isEnabledCamera ? "White" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchCamera}
                        value={isEnabledCamera}
                    />

                </View>
                <Text style={{ fontSize: 16, marginTop: '15%',width:'77%' }}>While T2Oasis needs permission to always use your location, you are in full control of when and where you share location </Text>
               
                

                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '15%' }}onPress={()=>props.navigation.navigate('ReadyToGo')}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '20%', alignItems: 'center', padding: 10, marginTop: '5%' }} onPress={()=>props.navigation.navigate('ReadyToGo')}>
                    <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>Skip</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Notification
