import React, { useState,useEffect } from 'react'
import { View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import API from '../../Constant/Api'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';


import AsyncStorage from '@react-native-async-storage/async-storage';

const Name = (props) => {




    const { email, phonCode, phonNum, leglName } = props.route.params
    console.log(leglName, 'legal................ ')
    const data = "string"
    const userType = "MobileApp"

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nameStatus, setNameStatus] = useState('');

    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoader, setOtpLoader] = useState(false);
    const [otpStatus, setOtpStatus] = useState('We have sent OTP on your Mobile, please type it here.')
    const [otpEmailModal, setOtpEmailModal] = useState(false);
    const [otpEmail, setOtpEmail] = useState('');
    const [otpEmailLoader, setOtpEmailLoader] = useState(false);
    const [otpEmailStatus, setOtpEmailStatus] = useState('We have sent OTP on your Email, please type it here.')

    const [divecToken, setDivecToken] = useState('');
    const GetData= async()=>{

        let DivecToken = await AsyncStorage.getItem('DivecToken')
        setDivecToken(DivecToken)
    }
    // console.log(divecToken,'.......................divecToken')
    const [nameLoader, setNameLoader] = useState(false);
    const fName = function (ad) {
        return function (ad) {
            if (ad.length >= 1) {
                return true;
            } else {
                return false;
            }
        };
    };
    const lName = function (ad) {
        return function (ad) {
            if (ad.length >= 1) {
                return true;
            } else {
                return false;
            }
        };
    };




    const VerifyOtpEmailModal = async () => {

        setOtpEmailLoader(true)
        try {
            // const res = await API().getOTPVerifySignUp(
            //     phonCode,
            //     phonNum,
            //     otp
            // )
            // console.log(res, 'sssssssssssssssssssssssssss')
            setOtpEmailLoader(false)
            // if (res.isSuccess) {
            //     setOtpModal(false)
            props.navigation.replace('CreateOrJoinPod')

            // } else {
            //     setOtpStatus(res.errors[0].message)
            // }

        } catch (err) { console.log('errVerifyCod') }
    }

    const VerifyOtpEmailModalClose = () => {
        setOtpEmailLoader(false)

        props.navigation.replace('CreateOrJoinPod')
    }
    const VerifyOtpModal = async () => {

        setOtpLoader(true)
        try {
            const res = await API().getOTPVerifySignUp(
                phonCode,
                phonNum,
                otp
            )
            console.log(res, 'sssssssssssssssssssssssssss')
            setOtpLoader(false)
            if (res.isSuccess) {
                setOtpModal(false)
                // props.navigation.replace('CreateOrJoinPod')

                if (email.length >= 2) {

                    setOtpEmailModal(true)
                } else {
                    props.navigation.replace('CreateOrJoinPod')
                }
            } else {
                setOtpStatus(res.errors[0].message)
            }

        } catch (err) { console.log('errVerifyCod') }
    }
    const CloseOtpModal = () => {
        setOtpModal(false)
        props.navigation.replace('CreateOrJoinPod')

    }
    const CreateAccount = async () => {
        var fnValid = fName('ad');
        var fValid = fnValid(firstName);
        // console.log(leglName,
        //     firstName,
        //     email,
        //     phonCode,
        //     phonNum,
        //     userType,
        //     data, '.........................................................!!!!!!!!!!!!')
        const UserData = {
            "email": email,
            "phonCode": phonCode,
            "phonNum": phonNum,
            "firstName": firstName,
            "lastName": lastName,
            "legalName": leglName
        }
        // console.log(typeof(UserData),'UserData,,,,,,,,,,,,,,,,,,,,,,,,,,,,,!')

        if (fValid) {
            setNameLoader(true)
            try {
                const res = await API().CreateUser(
                    leglName,
                    firstName,
                    email,
                    phonCode,
                    phonNum,
                    userType,
                    data
                )

                console.log(res, ';;;;')
                if (res.isSuccess) {

                    AsyncStorage.setItem('UserData', JSON.stringify(UserData))
                    AsyncStorage.setItem("UserId", JSON.stringify(res.response.userId));
                    AsyncStorage.setItem("token", JSON.stringify(res.response.token));

                    const PushNotification=await API().PushNotification(
                        divecToken
                    )

                    const resOtpSend = await API().OtpSendSignUp(
                        phonCode,
                        phonNum,
                    )
                    console.log(resOtpSend, 'resOtpSend')
                    setOtpModal(true)
                    setNameStatus('')
                    setNameLoader(false)
                } else {
                    setNameLoader(false)

                    setNameStatus('Username Already Exists')
                }
            }
            catch (err) { console.log(err, 'errCreateUser') }
        } else { setNameStatus('Fill this feilds') }

    }

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

    useEffect(() => {
        GetData()
    
     
    }, [])
    
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => props.navigation.goBack()} />
                <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>What's your Profile Name?</Text>

            </View>

            <View style={{ alignItems: 'center', marginTop: '20%' }}>
                <View style={{ width: '80%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Feather style={{}} name='user' size={30} />

                    <TextInput onChangeText={(e) => setFirstName(e)}
                        style={{ width: '80%', height: 40, marginLeft: 5 }}
                        placeholder="Profile Name"
                    />

                </View>
                {nameLoader ?
                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                    :
                    <Text style={{ marginTop: '3%', color: 'red' }}>{nameStatus}</Text>
                }
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '20%' }} onPress={CreateAccount}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>


            </View>

            {/* #########################
            ########## OTP Modal#########
            ########3#################*/}

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

                        <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>


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


            {/* #########################
            ##### OTP Email Modal #######
            ########3#################*/}

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={otpEmailModal}
           onRequestClose={() => {

             setModalVisible(!modalVisible)
             setSwipeablePanelShow(0)
           }}
            >
                <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: "white", padding: '10%', borderRadius: 10 }}>

                        <View style={{ alignItems: 'center' }}>

                            <SmoothPinCodeInput
                                value={otpEmail}
                                onTextChange={(code) => setOtpEmail(code)}
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

                        {otpEmailLoader ?
                            <ActivityIndicator size='large' color="rgb(176, 176, 176)" /> :


                            <Text style={{ color: 'black', marginTop: '5%', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{otpEmailStatus}</Text>
                        }

                        <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>


                            {otpEmail.length == 6 ?
                                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '80%' }} onPress={VerifyOtpEmailModal} >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                                </TouchableOpacity>
                                :
                                <View style={{ backgroundColor: 'rgb(154, 149, 193)', alignItems: 'center', padding: 10, borderRadius: 20, width: '80%' }} >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                                </View>

                            }

                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', padding: 10, width: '40%' }} onPress={ResendOtpEmail} >
                            <Text style={{ color: '#3A0CA3', fontSize: 16, fontWeight: 'bold' }}>Resend OTP</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal> */}


            {/* #########################
                ####  EmailVeryfy Modal #####
                ########3#################*/}

            <Modal
                animationType="slide"
                transparent={true}
                visible={otpEmailModal}

            >
                <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: "white", padding: '10%', borderRadius: 10 }}>

                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                            We have sent a link on your email-ID, please click the link to verify your email address.
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>



                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={VerifyOtpEmailModalClose}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify Later</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(154, 149, 193)', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={VerifyOtpEmailModal} >
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                            </TouchableOpacity>



                        </View>


                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default Name
