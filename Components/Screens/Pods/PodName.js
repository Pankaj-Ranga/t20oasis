import React, { useState } from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Api from '../../Constant/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PodName = ({ navigation }) => {
    const [PodName, setPodName] = useState('')
    const [PodNameStatus, setPodNameStatus] = useState('')
    const [PodNameLoader, setPodNameLoader] = useState(false)
    const [validation, setValidation] = useState(true);
    

    const PodValid = function (ad) {
        return function (ad) {
            if (ad.length >= 2) {
                return true;
            } else {
                return false;
            }
        };
    };

    const CreatePod = async () => {

        var pdValid = PodValid('ad');
        var dataPod = pdValid(PodName);
        if (!dataPod) {
            setValidation(dataPod)
        } else {
            setPodNameLoader(true)
            try {
                const res = await Api().CreatePodeName(
                    PodName
                )
                console.log(res, 'resPodname')
                setPodNameLoader(false)

                if (res.isSuccess === true) {
                    const resUserPod = await Api().PodUserAssociationPodName(
                        PodName
                    )

                    AsyncStorage.setItem('PodName',PodName)
                    console.log(resUserPod, 'resUserPod')
                    let key = res.response.inviteCode
                    navigation.replace('InviteCode', key)
                }
                else {
                    setPodNameStatus('Pod name already exists')
                }

            } catch (err) {
                console.log(err, 'ErrCreatePod')
            }
        }
    }
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Name your Pod</Text>

            </View>

            <View style={{ alignItems: 'center', marginTop: '20%' }}>
                {validation || PodName.length >= 2 ? (
                    <View style={{ width: '80%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Feather style={{}} name='users' size={30} />

                        <TextInput style={{ width: '80%', height: 40, marginLeft: 5 }}
                            placeholder="Enter Pod Name"
                            onChangeText={(e) => setPodName(e)}
                        />

                    </View>
                ) :
                    (
                        <View style={{ width: '80%', borderWidth: 1, borderColor: "red", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Feather style={{}} name='users' color="red" size={30} />

                            <TextInput style={{ width: '80%', height: 40, marginLeft: 5 }}
                                placeholder="Enter Pod Name"
                                placeholderTextColor="red"
                                onChangeText={(e) => setPodName(e)}
                            />

                        </View>
                    )}
                {PodNameLoader ?
                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                    :
                    <Text style={{ marginTop: '3%', color: 'red' }}>{PodNameStatus}</Text>

                }
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '20%' }}
                    onPress={CreatePod}

                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>


            </View>
        </View>
    )
}

export default PodName
