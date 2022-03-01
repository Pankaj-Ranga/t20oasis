import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Image, Switch, Modal } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PodContext } from '../../../Constant/Context/PodContext'
import API from '../../../Constant/Api'


const Notification = ({ navigation }) => {
    const [userData, setUserData] = useState({})
    const [userImage, setUserImage] = useState('');
    const Value = useContext(PodContext);

    // console.log(Value.PodValue.podName,'vvvvvvvvvvvvvvvvvvvvvvvvv')
    const [isLocationSharing, setIsLocationSharing] = useState(false);
    const [isLocationHistory, setIsLocationHistory] = useState(false);


    const toggleSwitchLocationSharing = async () => {
        setIsLocationSharing(previousState => !previousState)
        let isEnabled
        if (!isLocationSharing) {
            isEnabled = true

        } else {
            isEnabled = false
        }
        console.log(isEnabled, 'true')


        try {
            const res = await API().updateNotificationSettings(
                Value.PodValue.podName,
                false,
                isEnabled
            )
            console.log(isEnabled, res, 'true')
        } catch (err) { console.log(err, 'errrrrrrrrrrrrrrrrrrrrrrr') }

    }
    const toggleSwitchLocationHistory = async () => {
        setIsLocationHistory(previousState => !previousState)
        let isEnabled
        if (!isLocationHistory) {
            isEnabled = true

        } else {
            isEnabled = false
        }
        console.log(isEnabled, 'true')


        try {
            const res = await API().updateNotificationSettings(
                Value.PodValue.podName,
                isEnabled,
                false
            )
            console.log(isEnabled, res, 'true')
        } catch (err) { console.log(err, 'errrrrrrrrrrrrrrrrrrrrrrr') }
    }
    const GetData = async () => {
        const userData = await AsyncStorage.getItem('UserData')

        setUserData(JSON.parse(userData))
        // console.log(userData,'userData')
        let UserImage = await AsyncStorage.getItem('UserImage')

        setUserImage(UserImage)

    }
    useEffect(() => {
        GetData()
    }, [])
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />

                <View style={{ backgroundColor: 'white', width: '60%', marginLeft: '13%', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 4, shadowOpacity: 4 }} >

                    <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>

                </View>
            </View>

            {userImage !== null ?

                <Image style={{ height: 80, width: 80, alignSelf: 'center', borderRadius: 100, marginTop: '10%' }} source={{
                    uri: `data:image/gif;base64,${userImage}`,
                }} />


                :
                <View style={{ height: 80, borderWidth: 1, borderRadius: 100, borderColor: 'gray', width: 80, alignSelf: 'center', marginTop: '10%', justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name='camera-off' size={25} />
                </View>
            }
            <Text style={{ color: "black", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: '2%' }}> {userData.firstName} {userData.lastName}</Text>


            <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%' }}>

                <Text style={{ color: "black", fontSize: 25, fontWeight: 'bold', marginTop: '20%' }}>Notification</Text>


            </View>





            <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


                <Text style={{ fontSize: 16, }}>Location Alerts</Text>
                <Switch
                    style={{}}
                    trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                    thumbColor={isLocationSharing ? "White" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchLocationSharing}
                    value={isLocationSharing}
                />
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


                <Text style={{ fontSize: 16, }}>SOS Alerts</Text>
                <Switch
                    style={{}}
                    trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                    thumbColor={isLocationHistory ? "White" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchLocationHistory}
                    value={isLocationHistory}
                />
            </View>






        </View>
    )
}

export default Notification
