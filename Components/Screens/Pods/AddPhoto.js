import React, { useState,useEffect } from 'react'
import { View, Text, TextInput, StatusBar, ActivityIndicator, TouchableOpacity, Image, ImageBackground } from 'react-native'
import ImgToBase64 from 'react-native-image-base64';


import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import API from '../../Constant/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from '../../Constant/Base64';
import FilePickerManager from 'react-native-file-picker';

const AddPhoto = (props) => {

    const UserId = props.route.params
    const [profileImage, setProfileImage] = useState(null);


    const [profileImageFile, setProfileImageFile] = useState(null);

    const [apiRes, setApiRes] = useState('');
    const [UserToken, setUserToken] = useState('');
    const [apiLoader, setApiLoader] = useState(false);



    const imagePicker = async () => {

        try {


            FilePickerManager.showFilePicker(null, (response) => {
                console.log('Response = ', response);

                if (response.hasOwnProperty('didCancel')) {
                    console.log('cancle')
                } else {
                    console.log('yes')
                    setProfileImageFile(response)
                }


                ImgToBase64.getBase64String(response.uri)
                    .then(
                        (base64String) =>

                            setProfileImage(base64String),

                    )
                    .catch((err) =>  console.log(err));
            })
        } catch (err) {
            console.log(err,'errrr')
         
        }
    };


    let UploadImage = async () => {
console.log(UserToken,'UserToken')
        if (profileImageFile != null) {
            setApiLoader(true)
            let fileToUpload = profileImageFile;
            fileToUpload['name'] = fileToUpload.fileName

            console.log(fileToUpload, 'fileToUpload')

            var formdata = new FormData();
            formdata.append("image", fileToUpload);

            console.log(formdata, 'dataaaaaaa')
          
            
            let res = await fetch(
                `https://app1.gingerbox.in/api/User/updateUsersImage?userType=MobileApp&userId=${UserId}`,
                {
                    method: 'PUT',
                    body: formdata,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': ` ${UserToken}`,
                    },
                }
            );
            let responseJson = await res.json();
            setApiLoader(false)
            if (responseJson.isSuccess) {
                AsyncStorage.setItem('UserImage', profileImage)
                props.navigation.navigate('Notification')
            } else {
                //if no file selected the show alert
                setApiRes("This photo extension is not allowed!");
            }
        }
    };

    const GetData = async () => {

     
        let userToken = await AsyncStorage.getItem('token')

        let dd = JSON.parse(userToken)
        setUserToken(dd)
    }
    useEffect(() => {
        GetData()
    }, [])
   
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Add your photo so your Pod can easily find you</Text>

            </View>
            <View style={{ alignItems: 'center' }}>



                <ImageBackground style={{ height: 200, width: "75%", marginTop: '15%', marginLeft: '10%' }} imageStyle={{ borderRadius: 150 }} source={require('../../Images/Map.jpg')} >
                    <ImageBackground style={{ height: 70, width: 65, alignSelf: 'center', marginTop: '15%', marginRight: '15%', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ borderRadius: 150 }} source={require('../../Images/Location.png')} >
                        <View style={{ height: '75%', width: "85%", marginTop: -5, borderRadius: 50, backgroundColor: 'white', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {profileImage == null ?
                                <Image source={require('../../Images/uploadImage.png')} style={{ marginBottom: -2 }} />

                                :
                                <Image source={{
                                    uri: `data:image/gif;base64,${profileImage}`,
                                }} style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />
                            }

                        </View>

                    </ImageBackground>
                </ImageBackground>

                {apiLoader ?
                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                    :
                    <Text style={{ color: 'red', fontSize: 18, marginTop: '3%' }}>{apiRes}</Text>
                }
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', marginTop: '2%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", padding: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: "space-around" }} onPress={imagePicker}>
                    <Feather name="camera" size={20} color='white' />
                    <Text style={{ width: '70%', fontSize: 18, color: 'white' }}>Add your photo</Text>
                </TouchableOpacity>
                {profileImage == null ?
                    <View style={{ backgroundColor: 'rgb(164, 145, 211)', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Continue</Text>
                    </View>
                    :
                    <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }}

                        onPress={UploadImage}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Continue</Text>
                    </TouchableOpacity>
                }


                <TouchableOpacity style={{ width: '20%', alignItems: 'center', padding: 10, marginTop: '5%' }} onPress={() => props.navigation.navigate('Notification')}>
                    <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>Skip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddPhoto
