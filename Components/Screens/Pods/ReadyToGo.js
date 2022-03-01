import React,{useState,useEffect} from 'react'
import { View, Text, ActivityIndicator,TextInput, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';



const ReadyToGO = (props) => {
  const [loader,setLoader]=useState(true)
  const [podName,setPodName]=useState('')
  const [userImage, setUserImage] = useState('');

    const GetData= async()=>{
        let PodName = await AsyncStorage.getItem('PodName')

        setPodName(PodName)
        let UserImage = await AsyncStorage.getItem('UserImage')

    setUserImage(UserImage)
        setLoader(false)
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
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>The {podName} Pod is all set and ready to go</Text>

            </View>
            <View style={{ alignItems: 'center' }}>



                <ImageBackground style={{ height: 200, width: "75%", marginTop: '15%', marginLeft: '10%' }} imageStyle={{ borderRadius: 150 }} source={require('../../Images/Map.jpg')} >
                    {/* <Image source={require('../../Images/Location1.png')} style={{ alignSelf: 'center', marginTop: '-10%', marginLeft: '5%' }} /> */}
                    <Image source={{
                            uri: `data:image/gif;base64,${userImage}`,
                          }} style={{ height: 53, width: 55,  borderRadius: 100, marginLeft: 1 }} />
                </ImageBackground>

                <Text style={{ width: "90%", textAlign: 'center', fontSize: 18, color: 'black', marginTop: '10%' }}>A Pod is your private group accessible by invitation to those you trust</Text>

                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={() => props.navigation.navigate('MyTabs')}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Take me to the app</Text>
                </TouchableOpacity>
                {/* <View style={{ marginTop: '5%', flexDirection: 'row' }}>

                    <Text style={{ color: 'gray', fontSize: 16, }}>Already have a T2Oasis account?</Text>
                    <TouchableOpacity>

                        <Text style={{ color: 'rgb(255, 163, 151)', fontSize: 16, marginLeft: 3 }}>Sign in</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>
    )
}
}

export default ReadyToGO
