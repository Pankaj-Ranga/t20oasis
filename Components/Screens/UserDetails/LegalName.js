import React, { useState } from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import API from '../../Constant/Api'


import AsyncStorage from '@react-native-async-storage/async-storage';

const LegalName = (props) => {


    console.log(props.route.params, 'props.route.paramlll')

    const { email, phonCode, phonNum } = props.route.params


    const [legalName, setLegalName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nameStatus, setNameStatus] = useState('');
    let leglName = legalName + ' '+ lastName
    const [nameLoader, setNameLoader] = useState(false);

    const LegalNameValidation = async () => {

        let paramApi = 'LegalName'
        console.log
        if (legalName.length >= 1 && lastName.length >= 1) {

            // console.log(leglName, 'llllllllllllllllllllllllllllllllllllllllllll')
            setNameLoader(true)
            try {
                const res = await API().getUserValidations(1, paramApi, leglName)

                console.log(res, 'res')


                setNameLoader(false)
                if (res.isSuccess == true) {
                    props.navigation.replace('Name', { phonCode, phonNum, email, leglName })
                    setNameStatus('')

                } else {
                    setNameStatus(res.errors[0].message)

                }

            } catch (err) { console.log(err, 'errphonNumValidation') }

        } else {
            setNameStatus('fill both feild')

        }

    };


    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>What's your Legal name?</Text>

            </View>

            <View style={{ alignItems: 'center', marginTop: '20%' }}>
                <View style={{ width: '80%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Feather style={{}} name='user' size={30} />

                    <TextInput onChangeText={(e) => setLegalName(e)}
                        style={{ width: '40%', height: 40, marginLeft: 5 }}
                        placeholder="First Name"
                    />
                    <TextInput onChangeText={(e) => setLastName(e)}
                        style={{ width: '40%', height: 40, marginLeft: 5 }}
                        placeholder="Last Name"
                    />

                </View>
                {nameLoader ?
                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                    :
                    <Text style={{ marginTop: '3%', color: 'red' }}>{nameStatus}</Text>
                }
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '20%' }}
                    onPress={LegalNameValidation}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>


            </View>





        </View>
    )
}

export default LegalName
