import auth from '@react-native-firebase/auth';

import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Image, FlatList, StatusBar, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import API from '../../Constant/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
const PhoneNo = (props) => {
    // console.log(props.route.params,'prams')



    const [modalVisible, setModalVisible] = useState(false);


    const [countryCodeApi, setCountryCodeApi] = useState([]);
    const [phonCode, setPhonCode] = useState('+93');
    const [phonNum, setPhonNum] = useState('');
    const [phonNumStatus, setPhonNumStatus] = useState('');
    const [phonNumLoader, setPhonNumLoader] = useState(false);
    const [isLoader, setIsLoader] = useState(true);
    const [search, setSearch] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [nameStatus, setNameStatus] = useState('');
    const [nameLoader, setNameLoader] = useState(false);
    const [divecToken, setDivecToken] = useState('');
    // console.log(modalVisible,'modalVisible')
    const CodeModalOpen = () => {
        setModalVisible(true)
    }
    const CodeModalClose = (data) => {
        // console.log(data, 'code')
        setPhonCode(data.code)
        setModalVisible(false)
    }

    const GetData = async () => {

        
        let DivecToken = await AsyncStorage.getItem('DivecToken')
        setDivecToken(DivecToken)
        try {
            const res = await API().getCountryCode()
            // console.log(res.response[0],'resCountryCode')
            setPhonCode(res.response[0].code)
            setCountryCodeApi(res.response)

            setIsLoader(false)
        } catch (err) {
            console.log(err, 'errCountryCode')

        }
    }

    const OnSearch = (e) => {
        setSearch(e)
        console.log(e.length, 'lll')
        let dd = []
        countryCodeApi.map((item) => {
            // console.log(item.name.indexOf(e.toUpperCase()),'Item.............')
            let Itm = item.name.toUpperCase()
            let cond = Itm.indexOf(e.toUpperCase()) !== -1
            if (e.length >= 1) {
                if (cond) {
                    // console.log(item,'item ifffffff')
                    console.log(cond, 'item item Itm')
                    // setSearchListLoadin(true)
                    dd.push(item)
                    setSearchData(dd)
                    // setSearchListLoadin(false)
                }
            } else {
                console.log('else...........................')

                // setSearchData([])

            }
        })
    }

    const PhoneValidation = async () => {
        if (phonNum.length >= 1) {
            console.log('sinup')
            setPhonNumLoader(true)
            try {
                const res = await API().getUserValidations(1, 1, phonNum)

                // console.log(res,'res')


                setPhonNumLoader(false)
                if (res.isSuccess == true) {

                    props.navigation.replace('Email', { phonCode, phonNum, })
                } else {
                    setPhonNumStatus(res.errors[0].message)

                }

            } catch (err) { console.log(err, 'errphonNumValidation') }

        } else {
            setPhonNumStatus('Enter Phone Number')

        }

    };





    const Item = ({ renderItem }) => {
        // console.log(renderItem,'ren')

        return (

            <TouchableOpacity style={{ borderWidth: 1, borderRadius: 5, borderColor: 'gray', padding: 10, margin: 2 }} onPress={() => CodeModalClose(renderItem)} >
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{renderItem.name} </Text>

            </TouchableOpacity>
        );
    }
    const renderItem = ({ item }) => {
        return (
            <Item renderItem={item} />
        );
    }

    const signIn = async () => {
        let PhonCode = ''
        let PhonNumber = ''
        const data = "string"
        const userType = "MobileApp"
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            //   this.setState({ userInfo });
            console.log(userInfo.user, 'userInfo')

            var UserData = {
                "email": userInfo.user.email,
                "phonCode": '',
                "phonNum": '',
                "firstName": userInfo.user.name,
                "lastName": '',
                "legalName": userInfo.user.name
            }
            setNameLoader(true)
            const resEmailValid = await API().getUserValidations(1, 0, userInfo.user.email)

            console.log(resEmailValid, 'resemail')

            if (resEmailValid.isSuccess == true) {

                const res = await API().CreateUser(
                    userInfo.user.name,
                    userInfo.user.name,
                    userInfo.user.email,
                    PhonCode,
                    PhonNumber,
                    userType,
                    data
                )

                console.log(res, ';;;;')
                if (res.isSuccess) {

                    AsyncStorage.setItem('UserData', JSON.stringify(UserData))
                    AsyncStorage.setItem("UserId", JSON.stringify(res.response.userId));
                    AsyncStorage.setItem("token", JSON.stringify(res.response.token));
                    props.navigation.replace('CreateOrJoinPod')
                    setNameStatus('')
                    setNameLoader(false)
                } else {
                    setNameLoader(false)

                    setNameStatus('Username Already Exists')
                }
            } else {
                const resEmailAuth = await API().getUserauthbyEmail(userInfo.user.email)
                // console.log(resEmailAuth.response.userId,'resEmailAuthresEmailAuth')
                AsyncStorage.setItem("UserId", JSON.stringify(resEmailAuth.response.userId));
                AsyncStorage.setItem("token", JSON.stringify(resEmailAuth.response.token));
                AsyncStorage.setItem('UserData', JSON.stringify(UserData))
                props.navigation.replace('CreateOrJoinPod')
                setNameLoader(false)

            }
            const PushNotification=await API().PushNotification(
                divecToken
            )
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log(error, "EEEEEEEEEEEEEEEEEEEEEEEE1")
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log(error, "EEEEEEEEEEEEEEEEEEEEEEEE2")
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log(error, "EEEEEEEEEEEEEEEEEEEEEEEE3")
            } else {
                // some other error happened
                console.log(error, "EEEEEEEEEEEEEEEEEEEEEEEE4")
            }
            console.log(error, "EEEEEEEEEEEEEEEEEEEEEEEE5")
        }
    };



    useEffect(() => {
        GetData()

        GoogleSignin.configure({
            // scopes: ['https://www.googleapis.com/auth/userinfo.email'],
            webClientId: '1029478692861-v1ibqhnbp7gm83d6m7dd3u5l3k20sjgf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user 
        })
        GoogleSignin.signOut()

    }, [])

    if (isLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
            </View>
        )
    } else {

        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                    <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>What's your phone number?</Text>

                </View>

                <View style={{ alignItems: 'center', marginTop: '20%' }}>
                    <View style={{ width: '80%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Feather style={{}} name='phone' size={30} onPress={CodeModalOpen} />
                        <Text style={{}} onPress={CodeModalOpen}>{phonCode}</Text>
                        <TextInput onChangeText={(e) => setPhonNum(e)}
                            style={{ width: '70%', height: 40, marginLeft: 5 }}
                            placeholder="(363)734-298"
                            keyboardType="number-pad"
                        />
                    </View>
                    {phonNumLoader ?
                        <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                        :
                        <Text style={{ marginTop: '3%', color: 'red' }}>{phonNumStatus}</Text>
                    }
                    <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '20%' }} onPress={PhoneValidation}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: '10%', width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>

                        <View style={{ borderBottomWidth: 1, width: "40%", borderColor: "rgb(208, 208, 208)" }}>
                        </View>
                        <Text style={{ color: "rgb(208, 208, 208)", fontSize: 18 }}> Or use</Text>
                        <View style={{ borderBottomWidth: 1, width: "40%", borderColor: "rgb(208, 208, 208)" }}>
                        </View>
                    </View>


                    <TouchableOpacity style={{ width: '80%', marginTop: '10%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", padding: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: "space-around" }} onPress={signIn} >
                        {nameLoader ?
                            <ActivityIndicator size='small' color="rgb(176, 176, 176)" />
                            :
                            <>

                                <Image source={require('../../Images/Google.jpg')} />
                                <Text style={{ width: '75%', fontSize: 18 }}>Sign in with google</Text>
                            </>
                        }
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{ width: '80%', marginTop: '10%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", padding: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: "space-around" }}  onPress={()=>GoogleSignin.signOut()} >
                        <Image source={require('../../Images/Google.jpg')} />
                        <Text style={{ width: '75%', fontSize: 18 }}>Sign Out with google</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={{ width: '80%', marginTop: '5%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", padding: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: "space-around" }}>
                        <Image source={require('../../Images/Apple.jpg')} />
                        <Text style={{ width: '75%', fontSize: 18 }}>Sign in with apple</Text>
                    </TouchableOpacity>

                </View>

                {/* ###############################
            ######Country Code Modal##########
            ###############################*/}
                <Modal

                    visible={modalVisible}
                    onRequestClose={() => {

                        setModalVisible(false);
                    }}
                >
                    <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', height: '80%', width: "90%", borderRadius: 20, padding: 20 }}>

                            <View style={{ backgroundColor: 'white', width: "100%", alignSelf: 'center', borderRadius: 30, shadowOpacity: 1, elevation: 4, shadowColor: 'gray', marginBottom: '5%' }}>
                                <TextInput
                                    value={search} onChangeText={(e) => OnSearch(e)}
                                    style={{ width: "90%", alignSelf: 'center', fontSize: 20 }}
                                    placeholderTextColor="gray" placeholder="Search Country"
                                />
                            </View>


                            {search.length < 1 ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={countryCodeApi}
                                    renderItem={renderItem}
                                    onEndReachedThreshold={0}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={searchData}
                                    renderItem={renderItem}
                                    onEndReachedThreshold={0}
                                    keyExtractor={item => item.id}
                                />

                            }


                        </View>
                    </View>
                </Modal>

                {/* ####################################
            ############ OTP Send Modal ############ 
            #####################################*/}

            </View>
        )
    }
}

export default PhoneNo
