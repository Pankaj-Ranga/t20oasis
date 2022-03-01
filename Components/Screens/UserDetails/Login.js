import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, StatusBar, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import API from '../../Constant/Api'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props) => {
    // console.log(props.route.params,'prams')



    const [modalVisible, setModalVisible] = useState(false);
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoader, setOtpLoader] = useState(false);
    const [otpStatus, setOtpStatus] = useState('We have sent OTP on your Mobile, please type it here.');
    const [countryCodeApi, setCountryCodeApi] = useState([]);
    const [phonCode, setPhonCode] = useState('+93');
    const [phonNum, setPhonNum] = useState('');
    const [phonNumStatus, setPhonNumStatus] = useState('');
    const [phonNumLoader, setPhonNumLoader] = useState(false);
    const [isLoader, setIsLoader] = useState(true);
    const [search, setSearch] = useState('');
    const [searchData, setSearchData] = useState([]);
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
        // console.log(DivecToken,'DivecToken......................................>')
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
        // console.log(e.length, 'lll')
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
            console.log('login')
            setPhonNumLoader(true)
            try {


                setPhonNumStatus('')
                const resOtpSend = await API().OtpSendSignIn(
                    phonCode,
                    phonNum,
                )
                console.log(resOtpSend, 'resOtpSend')
                setPhonNumLoader(false)
                if(resOtpSend.isSuccess){

                    setOtpModal(true)
                }else{
                    setPhonNumStatus('Phone Number not valid')
                }


            } catch (err) { console.log(err, 'errphonNumValidation') }

        } else {
            setPhonNumStatus('Enter Phone Number')

        }

    };

    const ResendOtp = async () => {
        setOtpLoader(true)
        try {

            console.log(phonCode,
                phonNum, 'phonCodephonNum')

            setOtp('')
            const resOtpSend = await API().OtpSendSignIn(
                phonCode,
                phonNum,
            )
            console.log(resOtpSend, 'resOtpSend')
            setOtpLoader(false)
            setOtpStatus('We have sent OTP on your Mobile, please type it here.')


        } catch (err) { console.log(err, 'errphonNumValidation') }
    }

    const VerifyOtpModal = async () => {
        console.log(otp, 'otp')
        setOtpLoader(true)
        try {
            const res = await API().getOTPVerifySignIn(
                phonCode,
                phonNum,
                otp
            )
            // console.log(res, 'sssssssssssssssssssssssssss')
            setOtpLoader(false)
            if (res.isSuccess) {

                const resData = await JSON.parse(res.response)
                console.log(resData, 'resDataresDataresDataresData')
                const UserData = {
                    "email": resData.Email,
                    "phonCode": resData.CountryMobileCode,
                    "phonNum": resData.PhoneNumber,
                    "firstName": resData.ProfileName,
                    "lastName": '',
                    "legalName":resData.LegalName
                }

                const PushNotification=await API().PushNotification(
                    divecToken
                )

                console.log(PushNotification,'PushNotification....................>')
                AsyncStorage.setItem('UserData', JSON.stringify(UserData))
                AsyncStorage.setItem("UserId", JSON.stringify(resData.UserId));
                AsyncStorage.setItem("token", JSON.stringify(resData.Token));
                setOtpModal(false)
                props.navigation.replace('CreateOrJoinPod')

            } else {
                setOtpStatus(res.errors[0].message)
            }

        } catch (err) { console.log(err, 'errVerifyCod') }
    }

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

    useEffect(() => {
        GetData()
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={otpModal}
                //   onRequestClose={() => {

                //     setModalVisible(!modalVisible)
                //     setSwipeablePanelShow(0)
                //   }}
                >
                    <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: "white", padding: '10%', borderRadius: 10 }}>

                            <View style={{ alignItems: 'center' }}>

                                <SmoothPinCodeInput
                                    value={otp}
                                    onTextChange={(code) => setOtp(code)}
                                    cellStyle={{
                                        borderWidth: 1,
                                        borderRadius: 2,
                                        borderColor: '#3A0CA3',
                                    }}
                                    cellStyleFocused={{
                                        borderWidth: 2,
                                        borderRadius: 2,
                                        borderColor: '#3A0CA3',
                                    }}
                                    codeLength={6}
                                    cellSize={40}
                                    cellSpacing={10}
                                />

                            </View>

                            {otpLoader ?
                                <ActivityIndicator size='large' color="rgb(176, 176, 176)" /> :


                                <Text style={{ color: 'black', marginTop: '5%', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{otpStatus}</Text>
                            }

                            <View style={{ alignItems: 'center', marginTop: '10%' }}>


                                {otp.length == 6 ?
                                    <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '80%' }} onPress={VerifyOtpModal} >
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{ backgroundColor: 'rgb(154, 149, 193)', alignItems: 'center', padding: 10, borderRadius: 20, width: '80%' }} >
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                                    </View>

                                }
                            </View>

                            <TouchableOpacity style={{ alignSelf: 'center', padding: 10, width: '40%' }} onPress={ResendOtp}>
                                <Text style={{ color: '#3A0CA3', fontSize: 16, fontWeight: 'bold' }}>Resend OTP</Text>
                            </TouchableOpacity>



                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default Login
