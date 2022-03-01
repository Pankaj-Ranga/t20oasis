import React, { useState,useEffect } from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import API from '../../Constant/Api'
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';



const Email = (props) => {



    console.log(props.route.params, 'props.route.params')
    const { phonCode, phonNum } = props.route.params
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [emailLoader, setEmailLoader] = useState(false);
   

    const forSkip = () => {
        let email = ''

        props.navigation.replace('LegalName', { email, phonCode, phonNum })
    }
    const ggg = async () => {
        try {
            await GoogleSignin.hasPlayServices()

            const uuu = await GoogleSignin.signIn()
            console.log(uuu, 'sssssssssssshhhhhhhhhhhhhhssssss')
        } catch (err) { console.log(err, 'errrrrrrrr') }
    }

    const EmailValidation = async () => {
        // console.log(email,'email')
        if (email.length >= 1) {

            setEmailLoader(true)
            try {
                const res = await API().getUserValidations(1, 0, email)

                console.log(res, 'resemail')

                setEmailLoader(false)
                if (res.isSuccess == true) {
                    props.navigation.replace('LegalName', { email, phonCode, phonNum })
                    setEmailStatus('')

                } else {
                    setEmailStatus(res.errors[0].message)

                }

            } catch (err) { console.log(err, 'erremailValidation') }

        } else {
            setEmailStatus('Enter Email')

        }

    };

    useEffect(() => {
        GoogleSignin.configure({

            ClientId: '25263229460-9rlue0dug04tbq3ueonc5842l1m2iiso.apps',
            // offlineAccess: true,
        });
    }, [])
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Let's get started. What's your email address?</Text>

            </View>

            <View style={{ alignItems: 'center', marginTop: '10%' }}>

                <View style={{ width: '80%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name='email-outline' size={30} />
                    <TextInput style={{ width: '80%', height: 40, marginLeft: 5 }}
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                        placeholder="Enter your email Address"
                    />
                </View>
                {emailLoader ?
                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                    :

                    <Text style={{ marginTop: '3%', color: 'red' }}>{emailStatus}</Text>
                }
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '10%' }}
                    onPress={EmailValidation} >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: '20%', alignItems: 'center', padding: 10, marginTop: '5%' }} onPress={forSkip} >
                    <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>Skip</Text>
                </TouchableOpacity>

               
            </View>

          
        </View>
    )
}

export default Email
