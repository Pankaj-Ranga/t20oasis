import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, TextInput, FlatList, TouchableOpacity, StatusBar, Image, ScrollView, Modal } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from '../../../Constant/Base64';
import FilePickerManager from 'react-native-file-picker';
import ImgToBase64 from 'react-native-image-base64';
import API from '../../../Constant/Api';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'





const MyAccount = ({ navigation }) => {
    const [countryCodeModal, setCountryCodeModal] = useState(false);
    const [countryCodeApi, setCountryCodeApi] = useState([]);
    const [search, setSearch] = useState('');
    const [phonCode, setPhonCode] = useState('+93');
    const [phonNum, setPhonNum] = useState('');
    const [searchData, setSearchData] = useState([]);

    const [loader, setLoader] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [legalName, setLegalName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nameLoader, setNameLoader] = useState(false);
    const [nameStatus, setNameStatus] = useState('');
    const [phoneModal, setPhoneModal] = useState(false);
    const [phonNumLoader, setPhonNumLoader] = useState(false);
    const [phonNumStatus, setPhonNumStatus] = useState('');
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoader, setOtpLoader] = useState(false);
    const [otpStatus, setOtpStatus] = useState('We have sent OTP on your Mobile, please type it here.')

    const [emailModal, setEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailLoader, setEmailLoader] = useState(false);
    const [emailVerify, setEmailVerify] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');

    const [otpEmailModal, setOtpEmailModal] = useState(false);
    const [otpEmail, setOtpEmail] = useState('');
    const [otpEmailLoader, setOtpEmailLoader] = useState(false);
    const [otpEmailStatus, setOtpEmailStatus] = useState('We have sent OTP on your Email, please type it here.')

    const [userData, setUserData] = useState({})
    const [userImage, setUserImage] = useState(null);
    const [UserId, setUserId] = useState('');
    const [UserToken, setUserToken] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    console.log(userData, 'userData.........s................................')
    const ProfileModalOpen = () => {
        setProfileModal(true)
    }

    const phoneNumberModalOpen = async () => {
        setPhoneModal(true)
    }

    const profilNameEddit = async () => {
        let legalname = legalName + ' ' + lastName
        const userType = "MobileApp"
        let userid = parseInt(UserId)
        const UserData = {
            "email": userData.email,
            "phonCode": userData.phonCode,
            "phonNum": userData.phonNum,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "legalName": legalname
        }
        setNameLoader(true)
        if (legalName.length >= 2 && lastName.length >= 2) {


            try {
                const ress = await API().UpdateUser(
                    userid,
                    legalname,
                    userData.firstName,
                    userData.email,
                    userData.phonCode,
                    userData.phonNum,
                    userType,

                )

                console.log(ress, ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,ress')
                if (ress.isSuccess) {

                    AsyncStorage.setItem('UserData', JSON.stringify(UserData))


                    setProfileModal(false)
                    GetData()



                    setNameStatus('')

                    setNameLoader(false)
                } else {
                    setNameLoader(false)
                    setNameStatus(ress.errors[0].message)

                }


            }
            catch (err) { console.log(err, 'errCreateUser') }
        } else {
            setNameStatus('fill both feild')
            setNameLoader(false)
        }
    }
    const phoneNumberEddit = async () => {
        setPhonNumLoader(true)
        const userType = "MobileApp"
        const UserData = {
            "email": userData.email,
            "phonCode": phonCode,
            "phonNum": phonNum,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "legalName": userData.legalName
        }

        if (phonNum.length == 10) {

            let userid = parseInt(UserId)
            try {

                const res = await API().getUserValidations(1, 1, phonNum)

                // console.log(res,',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,')

                setPhonNumLoader(false)
                if (res.isSuccess == true) {
                    const ress = await API().UpdateUser(
                        userid,
                        userData.legalName,
                        userData.firstName,
                        userData.email,
                        phonCode,
                        phonNum,
                        userType,

                    )
                    if (ress.isSuccess) {

                        AsyncStorage.setItem('UserData', JSON.stringify(UserData))





                        const resOtpSend = await API().OtpSendSignIn(
                            phonCode,
                            phonNum,
                        )
                        console.log(resOtpSend, 'resOtpSendsssssssssss')
                        setOtpModal(true)
                        setNameStatus('')

                    }

                } else {
                    setPhonNumStatus(res.errors[0].message)

                }


            }
            catch (err) { console.log(err, 'errCreateUser') }
        }
        else {
            setPhonNumLoader(false)
            setPhonNumStatus('Enter Phone Number')
        }

    }
    const ResendOtp = async () => {
        setOtpLoader(true)
        try {


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
                GetData()
                setOtpModal(false)
                setPhoneModal(false)
            } else {
                setOtpStatus(res.errors[0].message)
            }

        } catch (err) { console.log('errVerifyCod') }
    }
    const EmailEddit = async () => {
        let userid = parseInt(UserId)
        const userType = "MobileApp"
        const UserData = {
            "email": email,
            "phonCode": userData.phonCode,
            "phonNum": userData.phonNum,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "legalName": userData.legalName
        }
        if (email.length >= 1) {

            setEmailLoader(true)
            try {
                const res = await API().getUserValidations(1, 0, email)

                console.log(res, 'resemail')

                setEmailLoader(false)
                if (res.isSuccess == true) {
                    const ress = await API().UpdateUser(
                        userid,
                        userData.legalName,
                        userData.firstName,
                        email,
                        userData.phonCode,
                        userData.phonNum,
                        userType,

                    )
                    setEmailVerify(true)
                    // setOtpEmailModal(true)
                    if (ress.isSuccess) {

                        AsyncStorage.setItem('UserData', JSON.stringify(UserData))
                        setEmailLoader(false)
                    }


                } else {
                    setEmailStatus(res.errors[0].message)

                }

            } catch (err) { console.log(err, 'erremailValidation') }

        } else {
            setEmailStatus('Enter Email')

        }
    }

    const VerifyOtpEmailModal = async () => {

        setOtpEmailLoader(true)
        try {
            // const res = await API().getOTPVerifySignUp(
            //     phonCode,
            //     phonNum,
            //     otp
            // )
            GetData()
            setOtpEmailModal(false)
            setEmailModal(false)
            setEmail('')
            // console.log(res, 'sssssssssssssssssssssssssss')
            setOtpEmailLoader(false)
            // if (res.isSuccess) {
            //     setOtpModal(false)


            // } else {
            //     setOtpStatus(res.errors[0].message)
            // }

        } catch (err) { console.log('errVerifyCod') }
    }
    const emailModalOpen = () => {
        setEmailModal(true)
    }
    const [profileImageFile, setProfileImageFile] = useState(null);

    const [apiRes, setApiRes] = useState('');
    const [apiLoader, setApiLoader] = useState(false);
    const LogOut = () => {
        AsyncStorage.setItem('UserData', '')
        navigation.replace('FirstSplash')
    }

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
                    .catch((err) => console.log(err));
            })
        } catch (err) {
            console.log(err, 'errrr')

        }
    };

    let UploadImage = async () => {

        if (profileImageFile != null) {
            setApiLoader(true)
            let fileToUpload = profileImageFile;
            fileToUpload['name'] = fileToUpload.fileName

            console.log(fileToUpload, 'fileToUpload')

            var formdata = new FormData();
            formdata.append("image", fileToUpload);

            console.log(formdata, 'dataaaaaaa')

            // console.log(token, 'tokenlllllllllllllll')
            let res = await fetch(
                `https://app1.gingerbox.in/api/User/updateUsersImage?userType=MobileApp&userId=${UserId}`,
                {
                    method: 'PUT',
                    body: formdata,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${UserToken}`,
                    },
                }
            );
            console.log(res, 'sssssssssssssssssssss')
            let responseJson = await res.json();

            console.log(responseJson, 'llllllllllllsssssssssssssssssssss')
            setApiLoader(false)
            if (responseJson.isSuccess) {
                AsyncStorage.setItem('UserImage', profileImage)
                // props.navigation.navigate('Notification')
            } else {
                //if no file selected the show alert
                setApiRes("This photo extension is not allowed!");
            }
        }
    };

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
    const CodeModalOpen = () => {
        setCountryCodeModal(true)
    }
    const CodeModalClose = (data) => {
        // console.log(data, 'code')
        setPhonCode(data.code)
        setCountryCodeModal(false)
    }

    const emailVerification = () => {
        setEmailVerify(false)
        setEmailModal(false)
        GetData()
    }

    const GetData = async () => {
        setLoader(true)
        const userId = await AsyncStorage.getItem('UserId')
        setUserId(userId)
        const userData = await AsyncStorage.getItem('UserData')
        setUserData(JSON.parse(userData))
        // console.log(userData,'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
        let UserImage = await AsyncStorage.getItem('UserImage')
        setUserImage(UserImage)
        let userToken = await AsyncStorage.getItem('token')
        const res = await API().getCountryCode()
        // console.log(res.response[0],'resCountryCode')
        setPhonCode(res.response[0].code)
        setCountryCodeApi(res.response)
        let dd = JSON.parse(userToken)
        setUserToken(dd)
        setLoader(false)
    }
    useEffect(() => {
        GetData()
    }, [])

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
                <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>

                    <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />



                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', /* marginLeft: '24%' */ }}>My Account</Text>

                    <AntDesign style={{ marginTop: '1%', marginRight: 10 }} name='logout' size={20} onPress={() => setLogoutModalVisible(true)} />
                </View>
                <ScrollView>

                    {profileImage == null ?
                        <>
                            {userImage !== null ?

                                <Image style={{ height: 80, width: 80, alignSelf: 'center', borderRadius: 100, marginTop: '10%' }} source={{
                                    uri: `data:image/gif;base64,${userImage}`,
                                }} />


                                :
                                <View style={{ height: 80, borderWidth: 1, borderRadius: 100, borderColor: 'gray', width: 80, alignSelf: 'center', marginTop: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Feather name='camera-off' size={25} />
                                </View>
                            }</>
                        :
                        <Image source={{
                            uri: `data:image/gif;base64,${profileImage}`,
                        }} style={{ height: 80, width: 80, alignSelf: 'center', borderRadius: 100, marginTop: '10%' }} />

                    }


                    {apiLoader ?
                        <ActivityIndicator style={{ alignSelf: 'center' }} size='large' color="rgb(176, 176, 176)" />
                        :
                        <Text style={{ alignSelf: 'center', color: 'red', fontSize: 18 }}>{apiRes}</Text>
                    }
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: '5%' }} onPress={imagePicker}>

                        <Text style={{ color: 'rgb(254, 162, 150)', fontWeight: 'bold', fontSize: 18, }}>Change Avatar</Text>

                    </TouchableOpacity>


                    {profileImageFile == null ?
                        <View style={{ alignSelf: 'center', backgroundColor: 'rgb(164, 145, 211)', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Continue</Text>
                        </View>
                        :
                        <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }}

                            onPress={UploadImage}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Continue</Text>
                        </TouchableOpacity>
                    }


                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%' }}>

                        <Text style={{ color: "black", fontSize: 25, fontWeight: 'bold', marginTop: '20%' }}>Profile</Text>
                    </View>



                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


                        <Text style={{ fontSize: 18 }}> {userData.legalName}</Text>


                        <TouchableOpacity style={{}} onPress={ProfileModalOpen}>
                            <Text style={{ color: 'red', fontSize: 18 }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                        {userData.phonNum.length < 10 ?
                            <Text style={{ fontSize: 18 }}>Phone: N/A </Text>
                            :
                            <Text style={{ fontSize: 18 }}>{userData.phonCode}-{userData.phonNum} </Text>
                        }


                        <TouchableOpacity style={{}} onPress={phoneNumberModalOpen}>
                            <Text style={{ color: 'red', fontSize: 18 }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                        {userData.email.length > 1 ?
                            <Text style={{ fontSize: 18 }}>{userData.email}</Text>
                            :
                            <Text style={{ fontSize: 18 }}>Email: N/A</Text>
                        }


                        <TouchableOpacity style={{}} onPress={emailModalOpen}>
                            <Text style={{ color: 'red', fontSize: 18 }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: '10%' }} onPress={() => setModalVisible(true)}>

                        <Text style={{ color: 'rgb(255, 88, 89)', fontSize: 18, borderBottomWidth: 1, borderColor: 'rgb(255, 88, 89)' }}>Delete Account</Text>

                    </TouchableOpacity>
                </ScrollView>



                {/*##########################
                ######## Modal Delete #######
                ###########################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '80%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 20,
                                borderRadius: 10,

                            }}>


                            <Text style={{ color: 'grey', marginTop: '10%' }}>
                                Do you want to delete this account?
                            </Text>

                            <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: "rgb(209, 209, 209)" }} onPress={() => setModalVisible(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }}>
                                    <Text style={{ color: 'white' }}>Delete </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>

                {/*##########################
                ######## LogOut Delete #######
                ###########################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={logoutModalVisible}
                >

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '80%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 20,
                                borderRadius: 10,
                                alignItems: 'center'
                            }}>


                            <Text style={{ color: 'grey', marginTop: '10%' }}>
                                Do you want to Log Out this account
                            </Text>

                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 25, borderRadius: 20, borderWidth: 1, borderColor: "rgb(209, 209, 209)" }} onPress={() => setLogoutModalVisible(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }} onPress={LogOut} >
                                    <Text style={{ color: 'white' }}>Log Out </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>

                {/*##########################
                ######## Profile Name #######
                ###########################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={profileModal}
                >

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '90%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 30,
                                borderRadius: 10,
                                // alignItems: 'center'
                            }}>


                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                                Enter Your name
                            </Text>

                            <View style={{ width: '100%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '10%' }}>
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
                                <Text style={{ alignSelf: 'center', marginTop: '3%', color: 'red' }}>{nameStatus}</Text>
                            }
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>

                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }} onPress={profilNameEddit}>
                                    <Text style={{ color: 'white' }}>Change </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(164, 145, 211)', paddingVertical: 5, paddingHorizontal: 25, borderRadius: 20 }} onPress={() => setProfileModal(false)}>
                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                </Modal>

                {/*##########################
                #######@# Phone Number ###@####
                ###########################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={phoneModal}
                >

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '90%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 30,
                                borderRadius: 10,
                                // alignItems: 'center'
                            }}>


                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                                Enter Your new Phone Number
                            </Text>

                            <Text style={{ color: 'black', fontSize: 10 }}>
                                (We shall send OTP to confirm the Mobile number)
                            </Text>

                            <View style={{ marginTop: '10%', width: '90%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
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
                                <Text style={{ alignSelf: 'center', marginTop: '3%', color: 'red' }}>{phonNumStatus}</Text>
                            }
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>

                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }} onPress={phoneNumberEddit} >
                                    <Text style={{ color: 'white' }}>Change </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(164, 145, 211)', paddingVertical: 5, paddingHorizontal: 25, borderRadius: 20 }} onPress={() => setPhoneModal(false)}>
                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                </Modal>



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


                {/*##########################
                #######@# Email modal ###@####
                ###########################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={emailModal}
                >

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '90%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 30,
                                borderRadius: 10,
                                // alignItems: 'center'
                            }}>


                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                                Enter Your new Email Id
                            </Text>

                            <Text style={{ color: 'black', fontSize: 12 }}>
                                (We shall send a link to validate your email ID)
                            </Text>
                            <View style={{ alignItems: 'center', marginTop: '10%' }}>

                                <View style={{ width: '100%', borderWidth: 1, borderColor: "rgb(208, 208, 208)", paddingHorizontal: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='email-outline' size={30} />
                                    <TextInput style={{ width: '80%', height: 40, marginLeft: 5 }}
                                        value={email}
                                        onChangeText={(e) => setEmail(e)}
                                        placeholder="Enter your email Id"
                                    />
                                </View>
                                {emailLoader ?
                                    <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
                                    :

                                    <Text style={{ marginTop: '3%', color: 'red' }}>{emailStatus}</Text>
                                }



                            </View>

                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>

                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }} onPress={EmailEddit} >
                                    <Text style={{ color: 'white' }}>Change </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(164, 145, 211)', paddingVertical: 5, paddingHorizontal: 25, borderRadius: 20 }} onPress={() => setEmailModal(false)}>
                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                </Modal>
                {/* #########################
            ##### OTP Email Modal #######
            ########3#################*/}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={otpEmailModal}

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
                            <TouchableOpacity style={{ alignSelf: 'center', padding: 10, width: '40%' }} /* onPress={ResendOtpEmail} */>
                                <Text style={{ color: '#3A0CA3', fontSize: 16, fontWeight: 'bold' }}>Resend OTP</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
                {/* #########################
                ####  EmailVeryfy Modal #####
                ########3#################*/}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={emailVerify}

                >
                    <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: "white", padding: '10%', borderRadius: 10 }}>

                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                                We have sent a link on your email-ID, please click the link to verify your email address.
                            </Text>

                            <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>



                                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={emailVerification}>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify Later</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(154, 149, 193)', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={emailVerification} >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify</Text>
                                </TouchableOpacity>



                            </View>


                        </View>
                    </View>
                </Modal>
                {/* ###############################
            ######Country Code Modal##########
            ###############################*/}
                <Modal

                    visible={countryCodeModal}
                    onRequestClose={() => {

                        setCountryCodeModal(false);
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
            </View>
        )
    }
}

export default MyAccount
