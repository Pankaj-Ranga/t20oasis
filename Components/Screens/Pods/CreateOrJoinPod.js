import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../Constant/Api'




const CreateOrJoinPod = (props) => {


   
    const [userId, setUserid] = useState(0)
    const [userData, setUserData] = useState({})
    const [resStatus, setResStatus] = useState([])
    const [loader, setLoader] = useState(true)

    // console.log(userId,'userId')
    const code = '';
    //
    const GetData = async () => {
        let UserDetal = await AsyncStorage.getItem('UserData')

        // console.log(UserDetal,'UserDetal')
        setUserData(JSON.parse(UserDetal))

        try {
            console.log('hello')
            const res = await API().getUserAllPods()

            // console.log(res, 'resalLpodsJoinScreen')
            setLoader(false)
            setResStatus(res.response)
        } catch (err) { console.log(err, 'ErralLpodsJoinScreen') }

    }

    useEffect(() => {
        GetData()
    }, [])

    if (loader) {
        return (
            <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                    <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Hi {userData.firstName} {userData.lastName}! Create or join a Pod of your friends and allies</Text>

                </View>
                <ScrollView contentContainerStyle={{ alignItems: "center" }}>



                    <ImageBackground style={{ height: 200, width: "75%", marginTop: '15%', marginLeft: '10%' }} imageStyle={{ borderRadius: 150 }} source={require('../../Images/Map.jpg')} >
                        <Image source={require('../../Images/Location1.png')} style={{ alignSelf: 'center', marginTop: '-10%', marginLeft: '5%' }} />
                        <Image source={require('../../Images/Location3.png')} style={{ height: 60, width: 60 }} />

                        <Image source={require('../../Images/Location2.png')} style={{ alignSelf: 'center', marginLeft: '5%' }} />
                    </ImageBackground>

                    <Text style={{ width: "90%", textAlign: 'center', fontSize: 18, color: 'black', marginTop: '5%' }}>A Pod is your private group accessible by invitation to those you trust</Text>

                    {resStatus.length > 0 ?
                        <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '10%' }} onPress={() => props.navigation.navigate('MyTabs')}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>My Pods</Text>
                        </TouchableOpacity>

                        : <></>}

                    <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={() => props.navigation.navigate('PodName')}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Create Pod</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={{ backgroundColor: 'rgb(255, 163, 151)', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={() => props.navigation.navigate('InvitationCode', { "code": code, "id": userId })}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Join Pod</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        )
    }
}

export default CreateOrJoinPod
