import React from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
const ChangePhoto = (props) => {
    // console.log(props.route.params,'Props')
    // const InviteCode = props.route.params
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Add your photo so your Pod can easily find you</Text>

            </View>
            <View style={{ alignItems: 'center' }}>



                <ImageBackground style={{ height: 200, width: "75%", marginTop: '15%', marginLeft: '10%', alignItems: 'center' }} imageStyle={{ borderRadius: 150 }} source={require('../../Images/Map.jpg')} >

                    <Image source={require('../../Images/Location1.png')} style={{ marginBottom: -2, marginRight: '10%' }} />

                </ImageBackground>

                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', marginTop: '5%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", padding: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: "space-around" }}>
                    <Feather name="camera" size={25} color='white' />
                    <Text style={{ width: '65%', fontSize: 18, color: 'white' }}>Change photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={() => props.navigation.navigate('Notification')}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '20%', alignItems: 'center', padding: 10, marginTop: '5%' }} onPress={() => props.navigation.navigate('Notification')}>
                    <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>Skip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChangePhoto
